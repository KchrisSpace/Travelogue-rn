import { Text, View } from 'react-native';
import { NoteDetail } from '../../services/noteService';

interface PostHeaderProps {
  post: NoteDetail;
}
const PostHeader = ({ post,}: PostHeaderProps) => {
  return (
    <View className="px-4 pt-3 pb-2">
      {/* 标题 */}
      <Text className="text-xl font-bold">{post?.title}</Text>

    </View>
  );
};

export default PostHeader;
