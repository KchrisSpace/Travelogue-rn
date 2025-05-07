import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { BASE_URL } from "../../const";
const PostDetail = () => {
  const {post_id}=useLocalSearchParams()
  // const post= axios.get(`${BASE_URL}/api/post/${Post_id}`)
  return (
    <View>
      <Text>PostDetail</Text>
    </View>
  );
};

export default PostDetail;
