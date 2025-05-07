import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppRegistry } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import "react-native-reanimated";
import { AuthProvider } from "../hooks/useAuth";
import { AuthGuard } from "./components/AuthGuard";
import '../global.css';
// 创建一个 QueryClient 实例
const queryClient = new QueryClient();
export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider
         >
      <AuthGuard>
            <Stack>
              <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
              <Stack.Screen name="detail/post_detail" options={{ headerShown: false }} />
            <Stack.Screen
            name="auth"
            options={{
              headerShown: true,
              headerTitle: "",
            }}
          />
          <Stack.Screen
            name="auth/login"
            options={{
              headerShown: true,
              headerTitle: "",
            }}
          />
          <Stack.Screen
            name="auth/register"
            options={{
              headerShown: true,
              headerTitle: "",
            }}
          />

          <Stack.Screen
            name="publish"
            options={{
              headerShown: true,
              title: "发布游记",
            }}
          />
            </Stack>
      </AuthGuard>
          <StatusBar style="auto" />
        </AuthProvider>
      </QueryClientProvider>
  );
}

AppRegistry.registerComponent('YourAppName', () => RootLayout);
