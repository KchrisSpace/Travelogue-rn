import { Ionicons } from "@expo/vector-icons";
import { MasonryFlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Video from "react-native-video";
// import { DATA } from "./data";
import { BASE_URL } from "../../const";
import { UserInfo, getUserInfo } from "../../services/userService";

// 定义 Note 接口，描述游记的结构
interface Note {
  id: string;
  user_id: string;
  image: string[];
  title: string;
  status: string;
  created_at: string;
  video?: string;
}

interface NotesResponse {
  data: Note[];
  nextCursor: string;
  hasMore: boolean;
}

// 添加带有用户信息的扩展Note接口
interface NoteWithUserInfo extends Note {
  userInfo?: UserInfo;
}
//该函数配合 useInfiniteQuery 实现前端的游记分页加载。
const fetchNotes = async ({
  pageParam = undefined,
}: {
  pageParam: string | undefined;
}): Promise<NotesResponse> => {
  const response = await axios.get(`${BASE_URL}/api/notes`, {
    params: {
      type: "cursor",//指定分页类型为游标分页
      cursor: pageParam,//当前分页的游标（第一页时为 undefined）。
      limit: 4,//每页请求 4 条数据
      status: "approved",//只请求已审核通过的游记。
    },
  });
  console.log("response.data", response.data);

  return response.data;
};

const Index_all = () => {
  const [notesWithUserInfo, setNotesWithUserInfo] = useState<
    NoteWithUserInfo[]
  >([]);

  const {
    data,//所有已加载的分页数据。
    fetchNextPage,//加载下一页的函数
    hasNextPage,//是否还有下一页
    isFetchingNextPage,//是否正在加载下一页
    isLoading,//是否正在加载数据
    isError,//是否加载数据出错
    // error,//加载数据出错时的错误信息
    error,
  } = useInfiniteQuery({
    queryKey: ["notes"],//查询的唯一标识符，通常用来区分不同的数据请求。
    queryFn: fetchNotes,//获取数据的函数。每次请求新的一页时会调用它
    initialPageParam: undefined,//初始的分页参数。第一次请求时传递给 fetchNotes。
    getNextPageParam: (lastPage) => {
     // 用于确定下一页的参数。lastPage 是上一次请求返回的数据。
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    // staleTime: 1000 * 60 * 1,
  });

  // 当笔记数据变化时，获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!data) return;

      const allNotes = data.pages.flatMap((page) => page.data);
      const notesWithInfo: NoteWithUserInfo[] = [...allNotes];

      // 获取所有不重复的用户ID 避免重复请求同一个用户的信息，提升效率。Set 结构去重
      const userIds = [...new Set(allNotes.map((note) => note.user_id))];

      // 批量获取用户信息
      try {
        const promises = userIds.map(async (userId) => {
          try {
            return await getUserInfo(userId);
          } catch (error) {
            console.error(`获取用户信息失败: ${userId}`, error);
            return null;
          }
        });

        const userInfoResults = await Promise.all(promises);

        // 创建用户ID到用户信息的映射
        //声明一个空对象 userInfoMap，类型为 Record<string, UserInfo>，即“以字符串为键、UserInfo 类型为值”的对象。
        const userInfoMap: Record<string, UserInfo> = {};
        userInfoResults.forEach((info) => {
          if (info) {
            userInfoMap[info.id] = info;
          }
        });

        // 将用户信息添加到笔记中
        const updatedNotes = notesWithInfo.map((note) => {
          return {
            ...note,
            userInfo: userInfoMap[note.user_id],
          };
        });

        setNotesWithUserInfo(updatedNotes);
      } catch (error) {
        console.error("获取用户信息失败", error);
      }
    };

    fetchUserInfo();
  }, [data]);

  if (isLoading) return <Text className="text-center py-4">加载中...</Text>;
  if (isError)
    return (
      <Text className="text-center py-4 text-red-500">
        加载失败: {error.message}
      </Text>
    );

  return (
    <View style={{ flex: 1, height: "100%" }}>
      <MasonryFlashList
        data={notesWithUserInfo}
        numColumns={2}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => {
          // 随机高度，范围100-250之间
          const imageHeight = 100 + Math.floor(Math.random() * 150);

          // 获取用户信息
          const avatar =
            item.userInfo?.["user_info"]?.avatar ||
            "https://via.placeholder.com/28";
          const nickname = item.userInfo?.["user_info"]?.nickname || "momo";

          // 格式化日期
          const createdDate = item.created_at
            ? new Date(item.created_at).toLocaleDateString("zh-CN", {
                month: "2-digit",
                day: "2-digit",
              })
            : "";

          return (
            <Pressable
              className="flex-1 flex-col bg-white m-1 rounded-lg overflow-hidden"
              style={{ marginBottom: 8 }}
              onPress={() =>
                router.push({
                  pathname: "/detail/[post_id]",
                  params: { post_id: item?.id, user_id: item?.user_id },
                })
              }
            >
              <View className="rounded-t-lg" style={{ height: imageHeight }}>
                {item.video ? (
                  <View className="w-full h-full bg-black">
                    <Video
                      source={{ uri: item.video }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      resizeMode="cover"
                      paused={true}
                      controls={false}
                    />
                    <View className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                      <Ionicons name="videocam" size={16} color="white" />
                    </View>
                  </View>
                ) : (
                  <Image
                    source={{ uri: item.image[0] }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                )}
              </View>
              <View className="mx-2 mt-2 mb-3">
                <Text className="font-medium text-sm line-clamp-2">
                  {item.title}
                </Text>
                <View className="flex flex-row items-center justify-start mt-2">
                  <Image
                    source={{ uri: avatar }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: "#E0E0E0",
                    }}
                  />
                  <View className="mx-2">
                    <Text className="text-xs text-gray-600">{nickname}</Text>
                    <Text className="text-[10px] text-gray-400">
                      {createdDate}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        }}
        estimatedItemSize={300}
      />
    </View>
  );
};

export default Index_all;
