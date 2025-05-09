import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import type { NoteDetail } from "../../services/noteService";
import { getUserNotes } from "../../services/noteService";
import type { UserInfo } from "../../services/userService";
import {
  getUserFans,
  getUserFavorites,
  getUserFollows,
  getUserInfo,
} from "../../services/userService";

export default function PersonalCenter() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [travelogues, setTravelogues] = useState<NoteDetail[]>([]);
  const [followings, setFollowings] = useState<UserInfo[]>([]);
  const [followers, setFollowers] = useState<UserInfo[]>([]);
  const [favorites, setFavorites] = useState<NoteDetail[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    // 获取用户详细信息、游记、关注、粉丝、收藏
    const fetchData = async () => {
      try {
        const [userInfoData, notes, follows, fans, favs] = await Promise.all([
          getUserInfo(user.id),
          getUserNotes(user.id),
          getUserFollows(user.id),
          getUserFans(user.id),
          getUserFavorites(user.id),
        ]);
        console.log("notes:", notes); // 看看这里是不是数组
        setUserInfo(userInfoData);
        setTravelogues(Array.isArray(notes) ? notes : []);
        setFollowings(Array.isArray(follows) ? follows : []);
        setFollowers(Array.isArray(fans) ? fans : []);
        setFavorites(Array.isArray(favs) ? favs : []);
      } catch (e) {
        // 可以做错误提示
        setUserInfo(null);
        setTravelogues([]);
        setFollowings([]);
        setFollowers([]);
        setFavorites([]);
      }
    };
    fetchData();
  }, [user?.id]);

  const handleSettingsPress = () => {
    // TODO: 实现设置页面跳转
    console.log("Settings pressed");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fdfeff" }}>
      {/* 顶部蓝色渐变背景 */}
      <LinearGradient
        colors={["#38a3e0", "#a0e9ff"]}
        style={styles.gradientCover}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push("/setting")}
      >
        <Ionicons name="settings-outline" size={24} color="#ffffff1" />
      </TouchableOpacity>
      {/* 头像悬浮 */}

      <ScrollView>
        {/* 个人信息 */}
        <View style={styles.profileInfoWrap}>
          <View style={styles.profileRow}>
            <View style={styles.avatarWrap}>
              <Image
                source={
                  isAuthenticated && user && user["user-info"]?.avatar
                    ? { uri: user["user-info"].avatar }
                    : require("../../assets/images/avatar/image.png")
                }
                style={styles.avatar}
              />
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.nickname}>
                {isAuthenticated && user && user["user-info"]?.nickname
                  ? user["user-info"].nickname
                  : "未登录"}
              </Text>
              <Text style={styles.userid}>{user?.id ? `@${user.id}` : ""}</Text>
              {user && (user as any)["user-info"]?.signature ? (
                <Text style={styles.signature}>
                  {(user as any)["user-info"].signature}
                </Text>
              ) : null}
            </View>
          </View>
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNum}>
                {userInfo?.["user-info"]?.follow?.length || 0}
              </Text>
              <Text style={styles.statLabel}>关注</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNum}>
                {userInfo?.["user-info"]?.fans?.length || 0}
              </Text>
              <Text style={styles.statLabel}>粉丝</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNum}>
                {userInfo?.favorite?.length || 0}
              </Text>
              <Text style={styles.statLabel}>收藏</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push("/profile-edit")}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              编辑个人资料
            </Text>
          </TouchableOpacity>
        </View>
        {/* 我的游记 */}
        <View style={styles.travelogueSection}>
          <Text style={styles.travelogueTitle}>我的游记</Text>
          {Array.isArray(travelogues) && travelogues.length > 0 ? (
            travelogues.map((item) => (
              <View key={item.id} style={styles.travelogueItem}>
                <View>
                  <Text style={styles.travelogueItemTitle}>{item.title}</Text>
                  <Text style={styles.travelogueItemDate}>
                    {item.createdAt}
                  </Text>
                </View>
                <TouchableOpacity style={styles.viewBtn}>
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    查看
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={{ color: "#888", textAlign: "center" }}>暂无游记</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientCover: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    zIndex: 0,
  },
  settingsButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.129)",
    borderRadius: 20,
    padding: 8,
    zIndex: 999,
  },
  profileInfoWrap: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 60,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarWrap: {
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
  infoCol: {
    flex: 1,
    justifyContent: "center",
  },
  nickname: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2,
  },
  userid: {
    fontSize: 15,
    color: "#646567",
    marginBottom: 2,
  },
  signature: {
    fontSize: 14,
    color: "#38a3e0",
    marginBottom: 2,
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
  avatarFloatWrap: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: -30,
    zIndex: 2,
  },
});
