import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../../hooks/useAuth";

function FilteredTouchableOpacity(props: any) {
  const { onPress, ...rest } = props;
  // 过滤掉 type/href 等属性
  const filteredProps = Object.fromEntries(
    Object.entries(rest).filter(([key]) => !["type", "href"].includes(key))
  );
  return (
    <TouchableOpacity
      {...filteredProps}
      onPress={(e) => {
        if (typeof e?.preventDefault === "function") e.preventDefault();
        if (onPress) onPress(e);
      }}
    />
  );
}

export default function TabLayout() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  console.log("isAuthenticated", isAuthenticated);

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === "auth";
    const inProtectedRoute = ["publish"].includes(segments[0]);
    if (!isAuthenticated && inProtectedRoute && !inAuthGroup) {
      router.replace("/auth");
    }
  }, [isAuthenticated, segments, isLoading]);

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "首页",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="publish"
        options={{
          title: "发布",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
          tabBarButton: (props) => (
            <FilteredTouchableOpacity
              {...props}
              onPress={() => {
                if (!isAuthenticated) {
                  router.push("/auth?redirect=/publish");
                } else {
                  router.push("/publish");
                }
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "我的",
          headerShown: false,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index_all"
        options={{
          title: "All",
          tabBarItemStyle: {
            display: "none",
          },
        }}
      />
      <Tabs.Screen
        name="index_follow"
        options={{
          title: "Follow",
          tabBarItemStyle: {
            display: "none",
          },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarItemStyle: {
            display: "none",
          },
        }}
      />
    </Tabs>
  );
}
