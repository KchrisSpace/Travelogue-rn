import { useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";

import { useAuth } from "../../hooks/useAuth";

// 可配置需要登录的受保护路由
const protectedRoutes = ["publish"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const currentRoute = segments[0];
    const inAuthGroup = currentRoute === "auth";
    const inProtectedRoute = protectedRoutes.includes(currentRoute);
    if (!isAuthenticated && inProtectedRoute && !inAuthGroup) {
      // 跳转到登录页，并带上来源参数
      router.replace({
        pathname: "/auth",
        params: { redirect: `/${currentRoute}` },
      });
    }
    // 已登录时不自动跳主页
  }, [isAuthenticated, segments, isLoading]);

  return <>{children}</>;
}
