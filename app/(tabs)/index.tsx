import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return <View style={styles.container}>首页{/* 首页内容 */}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
