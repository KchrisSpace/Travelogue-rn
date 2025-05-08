import { Ionicons } from "@expo/vector-icons";
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
  const { user } = useAuth();
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

  if (!user?.id) {
    // 未登录时显示提示页
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#e6f7fb",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#38a3e0",
            marginBottom: 12,
          }}
        >
          您还未登录
        </Text>
        <Text style={{ color: "#38a3e0", fontSize: 16, marginBottom: 32 }}>
          登录后即可发布游记
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#38a3e0",
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 60,
            marginBottom: 16,
          }}
          onPress={() => router.replace("/auth/login")}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
            去登录
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderColor: "#38a3e0",
            borderWidth: 2,
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 60,
            marginBottom: 16,
          }}
          onPress={() => router.replace("/auth/register")}
        >
          <Text style={{ color: "#38a3e0", fontWeight: "bold", fontSize: 20 }}>
            去注册
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderColor: "#38a3e0",
            borderWidth: 2,
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 40,
          }}
          onPress={() => router.replace("/")}
        >
          <Text style={{ color: "#38a3e0", fontWeight: "bold", fontSize: 18 }}>
            咱不登陆 先去大厅看看
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={handleSettingsPress}
      >
        <Ionicons name="settings-outline" size={24} color="#fff" />
      </TouchableOpacity>
      <ScrollView>
        {/* 头部封面图 */}
        <View style={styles.cover} />
        {/* 个人信息 */}
        <View style={styles.profileInfoWrap}>
          <View style={styles.profileRow}>
            <View style={styles.avatarWrap}>
              <Image
                source={
                  user && (user as any)["user-info"]?.avatar
                    ? { uri: (user as any)["user-info"].avatar }
                    : require("../../assets/images/avatar/image.png")
                }
                style={styles.avatar}
              />
            </View>
            <View
              style={{
                marginLeft: 16,
                marginBottom: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.username}>
                {(user && (user as any)["user-info"]?.nickname) ||
                  user?.id ||
                  "未登录"}
              </Text>
              <Text style={styles.userTag}> {user?.id || ""}</Text>
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
          <TouchableOpacity style={styles.editBtn}>
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
  cover: {
    height: 120,
    backgroundColor: "#d1d5db",
    width: "100%",
  },
  settingsButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 8,
    zIndex: 999,
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
