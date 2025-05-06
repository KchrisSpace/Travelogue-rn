import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-reanimated";
import { AuthGuard } from "./components/AuthGuard";
import { AuthProvider } from "./context/auth";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <AuthGuard>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
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
              headerShown: false,
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
  );
}
