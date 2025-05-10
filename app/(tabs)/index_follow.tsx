import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  UserInfo,
  getUserFollows,
  unfollowUser,
} from '../../services/userService';

const IndexFollow = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [followUsers, setFollowUsers] = useState<UserInfo[]>([]);

  // 模拟当前登录用户
  const currentUserId = 'user1';

  // 获取关注用户列表
  useEffect(() => {
    fetchFollowData();
  }, []);

  const fetchFollowData = async () => {
    try {
      setLoading(true);
      const users = await getUserFollows(currentUserId);
      setFollowUsers(users);
    } catch (error) {
      console.error('获取关注数据失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFollowData();
  };

  const handleUnfollow = async (userId: string) => {
    try {
      const success = await unfollowUser(currentUserId, userId);
      if (success) {
        setFollowUsers(followUsers.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error('取消关注失败:', error);
    }
  };

  const renderUserItem = ({ item }: { item: UserInfo }) => {
    return (
      <View className="mb-4 bg-white rounded-xl overflow-hidden shadow-sm">
        <View className="p-4 flex-row items-center justify-between">
          <TouchableOpacity
            className="flex-row items-center flex-1"
            onPress={() => {
              router.push('/(tabs)');
            }}>
            <Image
              source={{
                uri: item.user_info?.avatar || 'https://via.placeholder.com/40',
              }}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3 flex-1">
              <Text className="font-medium">
                {item.user_info?.nickname || item.name}
              </Text>
              <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>
                {item.user_info?.signature || '这个人很懒，什么都没留下'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleUnfollow(item.id)}
            className="bg-gray-200 px-3 py-1 rounded-full">
            <Text className="text-xs text-gray-600">已关注</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF4D67" />
        <Text className="mt-2 text-gray-500">加载中...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {followUsers.length > 0 ? (
        <FlatList
          data={followUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#FF4D67']}
              tintColor="#FF4D67"
            />
          }
        />
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <Ionicons name="people-outline" size={60} color="#cccccc" />
          <Text className="mt-4 text-gray-500 text-lg font-medium">
            暂无关注内容
          </Text>
          <Text className="mt-2 text-gray-400 text-center">
            关注感兴趣的用户，他们的最新动态将显示在这里
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)')}
            className="mt-6 bg-[#FF4D67] px-6 py-2 rounded-full">
            <Text className="text-white font-medium">去发现</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default IndexFollow;
