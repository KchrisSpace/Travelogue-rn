import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { UserInfo } from '../../services/userService';

interface PostUserBarProps {
  userInfo: UserInfo | null;
}

const PostUserBar = ({ userInfo }: PostUserBarProps) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    // TODO: 实际关注/取消关注的API调用
    setIsFollowing(!isFollowing);
  };

  if (!userInfo) return null;

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <View className="flex-row items-center">
        <Image
          source={{
            uri:
              userInfo['user-info']?.avatar || 'https://via.placeholder.com/40',
          }}
          className="w-9 h-9 rounded-full"
        />
        <View className="ml-2.5">
          <Text className="text-sm font-medium">
            {userInfo['user-info']?.nickname || 'momo'}
          </Text>
          {userInfo['user-info']?.city && (
            <View className="flex-row items-center mt-0.5">
              <Ionicons name="location-outline" size={12} color="#999" />
              <Text className="text-xs text-gray-500 ml-0.5">
                {userInfo['user-info'].city}
              </Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleFollow}
        className={`px-3.5 py-1 rounded-full ${
          isFollowing ? 'bg-gray-100 border border-gray-300' : 'bg-[#ff2442]'
        }`}>
        <Text
          className={`text-xs font-medium ${
            isFollowing ? 'text-gray-700' : 'text-white'
          }`}>
          {isFollowing ? '已关注' : '+ 关注'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostUserBar;
