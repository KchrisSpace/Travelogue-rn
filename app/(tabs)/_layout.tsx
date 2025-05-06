import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../context/auth";

function FilteredTouchableOpacity(props) {
  // 过滤掉props中为null的属性，避免类型报错
  const filteredProps = Object.fromEntries(
    Object.entries(props).filter(([_, v]) => v !== null)
  );
  return <TouchableOpacity {...filteredProps} />;
}

export default function TabLayout() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "首页",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="publish"
        options={{
          title: "发布",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
          tabBarButton: (props) => (
            <FilteredTouchableOpacity
              {...props}
              onPress={() => {
                if (isAuthenticated) {
                  console.log("isAuthenticated", isAuthenticated);
                  router.push("/publish");
                } else {
                  // @ts-ignore

                  router.push("/auth");
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
