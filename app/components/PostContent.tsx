import { Text, View } from 'react-native';

interface PostContentProps {
  content: string;
}

const PostContent = ({ content }: PostContentProps) => {
  return (
    <View className="p-4">
      <Text className="text-base leading-6 text-gray-800">{content}</Text>
    </View>
  );
};

export default PostContent;
