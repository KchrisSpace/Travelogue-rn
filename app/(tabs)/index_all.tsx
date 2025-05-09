import { MasonryFlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
// import { DATA } from "./data";
import { BASE_URL } from '../../const';
import { UserInfo, getUserInfo } from '../../services/userService';

// 定义 Note 接口，描述游记的结构
interface Note {
  id: string;
  user_id: string;
  image: string[];
  title: string;
  status: string;
  created_at: string;
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

const fetchNotes = async ({
  pageParam = undefined,
}: {
  pageParam: string | undefined;
}): Promise<NotesResponse> => {
  const response = await axios.get(`${BASE_URL}/api/notes`, {
    params: {
      type: 'cursor',
      cursor: pageParam,
      limit: 4,
      status: 'approved',
    },
  });
  console.log('response.data', response.data);

  return response.data;
};

const Index_all = () => {
  const [notesWithUserInfo, setNotesWithUserInfo] = useState<
    NoteWithUserInfo[]
  >([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    staleTime: 1000 * 60 * 1,
  });

  // 当笔记数据变化时，获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!data) return;

      const allNotes = data.pages.flatMap((page) => page.data);
      const notesWithInfo: NoteWithUserInfo[] = [...allNotes];

      // 获取所有不重复的用户ID
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
        console.error('获取用户信息失败', error);
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
    <View style={{ flex: 1, height: '100%' }}>
      <MasonryFlashList
        data={notesWithUserInfo}
        numColumns={2}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.3}
        renderItem={({ item }) => {
          // 随机高度，范围100-250之间
          const imageHeight = 100 + Math.floor(Math.random() * 150);

          // 获取用户信息
          const avatar =
            item.userInfo?.['user_info']?.avatar ||
            'https://via.placeholder.com/28';
          const nickname = item.userInfo?.['user_info']?.nickname || 'momo';

          // 格式化日期
          const createdDate = item.created_at
            ? new Date(item.created_at).toLocaleDateString('zh-CN', {
                month: '2-digit',
                day: '2-digit',
              })
            : '';

          return (
            <Pressable
              className="flex-1 flex-col bg-white m-1 rounded-lg overflow-hidden"
              style={{ marginBottom: 8 }}
              onPress={() =>
                router.push({
                  pathname: '/detail/[post_id]',
                  params: { post_id: item?.id, user_id: item?.user_id },
                })
              }>
              <View
                style={{
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  height: imageHeight,
                }}>
                <Image
                  source={{ uri: item?.image[0] }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="cover"
                />
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
                      borderColor: '#E0E0E0',
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
