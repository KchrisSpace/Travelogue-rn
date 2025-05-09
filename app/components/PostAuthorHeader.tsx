import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { UserInfo, followUser, unfollowUser } from '../../services/userService';

interface PostAuthorHeaderProps {
  userInfo: UserInfo | null;
  currentUserId?: string; // 当前登录用户ID
  onFollowPress?: () => void;
  isFollowing?: boolean; // 由父组件传递的关注状态
}

const PostAuthorHeader = ({
  userInfo,
  currentUserId = 'user1', // 默认用户ID，实际应从认证状态获取
  onFollowPress,
  isFollowing: externalIsFollowing, // 从外部传入的状态
}: PostAuthorHeaderProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // 如果父组件传递了关注状态，则使用父组件的状态
  useEffect(() => {
    if (externalIsFollowing !== undefined) {
      setIsFollowing(externalIsFollowing);
    } else if (userInfo && currentUserId) {
      // 否则使用本地计算的状态
      const isAlreadyFollowing =
        userInfo['user_info']?.fans?.includes(currentUserId);
      setIsFollowing(!!isAlreadyFollowing);
    }
  }, [userInfo, currentUserId, externalIsFollowing]);

  const handleFollowPress = async () => {
    if (!userInfo || !userInfo.id || loading) return;

    try {
      setLoading(true);
      if (isFollowing) {
        // 取消关注
        await unfollowUser(currentUserId, userInfo.id);
        setIsFollowing(false);
      } else {
        // 关注
        await followUser(currentUserId, userInfo.id);
        setIsFollowing(true);
      }

      if (onFollowPress) {
        onFollowPress();
      }
    } catch (error) {
      console.error('关注/取消关注操作失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) {
    return null;
  }

  return (
    <View className="flex-row items-center">
      <Image
        source={{
          uri:
            userInfo?.['user_info']?.avatar || 'https://via.placeholder.com/32',
        }}
        className="w-12 h-12 rounded-full"
      />
      <Text className="ml-2 text-sm font-medium flex-1" numberOfLines={1}>
        {userInfo?.['user_info']?.nickname || 'momo'}
      </Text>
      <TouchableOpacity
        onPress={handleFollowPress}
        disabled={loading}
        className={`ml-5 px-3 py-1 rounded-full ${
          isFollowing ? 'bg-gray-200' : 'bg-[#FF4D67]'
        }`}>
        <Text
          className={`text-xs ${isFollowing ? 'text-gray-600' : 'text-white'}`}>
          {loading ? '加载中...' : isFollowing ? '已关注' : '关注'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostAuthorHeader;
