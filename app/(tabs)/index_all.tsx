import { MasonryFlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { router } from "expo-router";
// import { DATA } from "./data";
import { BASE_URL } from '../../const';

// 定义 Note 接口，描述游记的结构
interface Note {
  id: string;
  userId: string;
  image: string[];
  title: string;
  userAvatar: string;
  userName: string;
  status: string;
}

interface NotesResponse {
  data: Note[];
  nextCursor: string;
  hasMore: boolean;
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
      limit: 7,
      status: 'approved',
    },
  });
  console.log('response.data', response.data);

  return response.data;
};

const Index_all = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useInfiniteQuery({
      queryKey: ['notes'],
      queryFn: fetchNotes,
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => {
        // console.log(lastPage);
        return lastPage.hasMore ? lastPage.nextCursor : undefined;
      },
      staleTime: 1000 * 60 * 1,
    });

  if (isLoading) return <Text className="text-center py-4">加载中...</Text>;
  if (isError)
    return <Text className="text-center py-4 text-red-500">加载失败: {error.message}</Text>;
  const allNotes = data?.pages.flatMap((page) => page.data) || [];
  console.log('allNotes', allNotes);
  return (
    <View>
      <MasonryFlashList
        data={allNotes}
        numColumns={2}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.3}
        renderItem={({ item }) => (
            <Pressable
            className="flex-1 flex-col bg-white m-1"
            onPress={() => router.push({ pathname: '/detail/[post_id]', params: { post_id: item?.id } })}
            >
            <View style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
              <Image
              source={{ uri: item?.image[0] }}
              style={{
                width: '100%',
                height: '100%',
                minHeight: 200,
              }}
              resizeMode="cover"
              />
            </View>
            <View className="mx-2 mt-2 mb-3">
              <Text className="font-medium text-sm line-clamp-2">{item.title}</Text>
              <View className="flex flex-row items-center justify-start mt-2">
              <Image
                source={{ uri: item.userAvatar }}
                style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#E0E0E0',
                }}
              />
              <View className="mx-2">
                <Text className="text-xs text-gray-600">{item.userName}</Text>
                <Text className="text-[10px] text-gray-400">03-21</Text>
              </View>
              </View>
            </View>
            </Pressable>
        )}
        estimatedItemSize={300}
      />
    </View>
  );
};

export default Index_all;
