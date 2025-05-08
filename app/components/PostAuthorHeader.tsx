import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { UserInfo } from '../../services/userService';

interface PostAuthorHeaderProps {
  userInfo: UserInfo | null;
  currentUserId?: string; // 当前登录用户ID
  onFollowPress?: () => void;
}

const PostAuthorHeader = ({
  userInfo,
  currentUserId = 'user1', // 默认用户ID，实际应从认证状态获取
  onFollowPress,
}: PostAuthorHeaderProps) => {
  const [isFollowing, setIsFollowing] = useState(false);

  // 检查当前用户是否已关注作者
  useEffect(() => {
    if (userInfo && currentUserId) {
      const isAlreadyFollowing =
        userInfo['user-info']?.fans?.includes(currentUserId);
      setIsFollowing(!!isAlreadyFollowing);
    }
  }, [userInfo, currentUserId]);

  const handleFollowPress = () => {
    setIsFollowing(!isFollowing);
    if (onFollowPress) {
      onFollowPress();
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
            userInfo?.['user-info']?.avatar || 'https://via.placeholder.com/32',
        }}
        className="w-12 h-12 rounded-full"
      />
      <Text className="ml-2 text-sm font-medium flex-1" numberOfLines={1}>
        {userInfo?.['user-info']?.nickname || 'momo'}
      </Text>
      <TouchableOpacity
        onPress={handleFollowPress}
        className={`ml-5 px-3 py-1 rounded-full ${
          isFollowing ? 'bg-gray-200' : 'bg-[#FF4D67]'
        }`}>
        <Text
          className={`text-xs ${isFollowing ? 'text-gray-600' : 'text-white'}`}>
          {isFollowing ? '已关注' : '关注'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostAuthorHeader;
