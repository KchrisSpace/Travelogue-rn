import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AboutPage() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* 顶部返回栏 */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 4, marginRight: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#222" }}>
          关于本项目
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Travelogue 游记分享平台</Text>
        <Text style={styles.desc}>
          本项目是一个面向旅行爱好者的游记分享与社交平台。你可以：
        </Text>
        <Text style={styles.bullet}>• 发布和管理自己的旅行游记</Text>
        <Text style={styles.bullet}>• 浏览他人的精彩游记，获取灵感</Text>
        <Text style={styles.bullet}>• 关注感兴趣的用户，建立社交关系</Text>
        <Text style={styles.bullet}>• 查看粉丝列表，互动交流</Text>
        <Text style={styles.bullet}>• 对游记进行评论、点赞等操作</Text>
        <Text style={styles.desc}>
          项目采用 React Native + Node.js
          技术栈，支持多端访问，致力于为用户提供便捷、美观的旅行记录与分享体验。
        </Text>
        <Text style={styles.footer}>版本号：1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 24,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2089dc",
    marginBottom: 16,
  },
  desc: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
    lineHeight: 24,
  },
  bullet: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    marginLeft: 8,
    lineHeight: 24,
  },
  footer: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 32,
    alignSelf: "center",
  },
});
