import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { UserInfo, getUserFans } from "../../services/userService";

const FansPage = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fansUsers, setFansUsers] = useState<UserInfo[]>([]);

  // 模拟当前登录用户
  const currentUserId = "user1";

  // 获取粉丝用户列表
  useEffect(() => {
    fetchFansData();
  }, []);

  const fetchFansData = async () => {
    try {
      setLoading(true);
      const users = await getUserFans(currentUserId);
      setFansUsers(users);
    } catch (error) {
      console.error("获取粉丝数据失败:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFansData();
  };

  const renderUserItem = ({ item }: { item: UserInfo }) => {
    return (
      <View className="mb-4 bg-white rounded-xl overflow-hidden shadow-sm">
        <View className="p-4 flex-row items-center justify-between">
          <TouchableOpacity
            className="flex-row items-center flex-1"
            onPress={() => {
              // 跳转到粉丝主页（可根据实际路由调整）
              router.push("/(tabs)");
            }}
          >
            <Image
              source={{
                uri: item.user_info?.avatar || "https://via.placeholder.com/40",
              }}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3 flex-1">
              <Text className="font-medium">
                {item.user_info?.nickname || item.name}
              </Text>
              <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>
                {item.user_info?.signature || "这个人很懒，什么都没留下"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF4D67" />
        <Text className="mt-2 text-gray-500">加载中...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
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
          粉丝
        </Text>
      </View>
      {/* 列表内容 */}
      {fansUsers.length > 0 ? (
        <FlatList
          data={fansUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#FF4D67"]}
              tintColor="#FF4D67"
            />
          }
        />
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <Ionicons name="people-outline" size={60} color="#cccccc" />
          <Text className="mt-4 text-gray-500 text-lg font-medium">
            暂无粉丝内容
          </Text>
          <Text className="mt-2 text-gray-400 text-center">
            还没有人关注你，快去分享你的精彩内容吧！
          </Text>
        </View>
      )}
    </View>
  );
};

export default FansPage;
