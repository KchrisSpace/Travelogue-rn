import { Text, View } from 'react-native';
import { UserInfo } from '../../services/userService';
import { NoteDetail } from '../../services/noteService';

interface PostContentProps {
  content: string;
  userInfo: UserInfo | null;
  post: NoteDetail;
}

const PostContent = ({ content, userInfo, post }: PostContentProps) => {
  return (
    <View className="p-4 border-b border-b-gray-200">
      {/* 内容 */}
      <Text className="text-base leading-6 text-gray-800">{content}</Text>
 {/* 发布时间 */}
 <Text className="text-xs text-gray-500 mt-1.5">
        {post ? new Date(post.createdAt).toLocaleDateString() : ''}
      </Text>
      {/* 用户签名 */}
      {/* {userInfo?.['user-info']?.signature && (
        <View className="mt-3 pt-2 border-t border-gray-100">
          <Text className="text-sm text-gray-500 italic">
            {userInfo['user-info'].signature}
          </Text>
        </View>
      )} */}
    </View>
  );
};

export default PostContent;
