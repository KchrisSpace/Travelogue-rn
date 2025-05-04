import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Button,
} from "react-native";

const mockTravelogues = [
  { title: "探索巴厘岛的自然之美", date: "2024年4月18日" },
  { title: "探索墨西哥图卢姆的古遗址", date: "2024年4月15日" },
  { title: "大阪的樱花季节", date: "2024年4月10日" },
];

export default function PersonalCenter() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      {/* 头部封面图 */}
      <View style={styles.cover} />
      {/* 个人信息 */}
      <View style={styles.profileInfoWrap}>
        <View style={styles.profileRow}>
          <View style={styles.avatarWrap}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.avatarEditBtn}>
              <Text style={{ fontSize: 16, color: "#666" }}>✎</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginLeft: 16, marginBottom: 8 }}>
            <Text style={styles.username}>用户名</Text>
            <Text style={styles.userTag}>@username</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>128</Text>
            <Text style={styles.statLabel}>关注</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>256</Text>
            <Text style={styles.statLabel}>粉丝</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>32</Text>
            <Text style={styles.statLabel}>游记</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            编辑个人资料
          </Text>
        </TouchableOpacity>
      </View>
      {/* 我的游记 */}
      <View style={styles.travelogueSection}>
        <Text style={styles.travelogueTitle}>我的游记</Text>
        {mockTravelogues.map((item, idx) => (
          <View key={idx} style={styles.travelogueItem}>
            <View>
              <Text style={styles.travelogueItemTitle}>{item.title}</Text>
              <Text style={styles.travelogueItemDate}>{item.date}</Text>
            </View>
            <TouchableOpacity style={styles.viewBtn}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>查看</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 120,
    backgroundColor: "#d1d5db",
    width: "100%",
    // 可替换为ImageBackground实现背景图
  },
  profileInfoWrap: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: -40,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
  avatarEditBtn: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  userTag: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 8,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNum: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  statLabel: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  editBtn: {
    backgroundColor: "#22c55e",
    borderRadius: 8,
    marginTop: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  travelogueSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    marginBottom: 32,
  },
  travelogueTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
  },
  travelogueItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  travelogueItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  travelogueItemDate: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  viewBtn: {
    backgroundColor: "#22c55e",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
