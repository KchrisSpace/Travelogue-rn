import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { NoteDetail } from '../services/noteService';
import { UserInfo } from '../services/userService';

interface PostHeaderProps {
  post: NoteDetail;
  userInfo: UserInfo | null;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post, userInfo }) => {
  return (
    <View className="p-4 border-b border-b-gray-200">
      <Text className="text-xl font-bold mb-3">{post?.title}</Text>
      <View className="flex-row items-center">
        <Image
          source={{
            uri:
              userInfo?.['user-info']?.avatar ||
              'https://via.placeholder.com/40',
          }}
          className="w-10 h-10 rounded-full mr-2.5"
        />
        <View className="flex-1">
          <Text className="text-base font-medium">
            {userInfo?.['user-info']?.nickname || '用户未知'}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {post ? new Date(post.createdAt).toLocaleDateString() : ''}
          </Text>
        </View>
      </View>

      {/* 用户签名 */}
      {userInfo?.['user-info']?.signature && (
        <Text className="text-sm text-gray-500 italic mt-2">
          {userInfo['user-info'].signature}
        </Text>
      )}

      {/* 用户位置信息 */}
      {userInfo?.['user-info']?.city && (
        <View className="flex-row items-center mt-2">
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text className="text-sm text-gray-500 ml-1">
            {userInfo['user-info'].city}
          </Text>
        </View>
      )}
    </View>
  );
};

export default PostHeader;
