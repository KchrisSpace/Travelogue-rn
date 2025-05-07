import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";
    const inProtectedRoute = segments[0] === "publish";

    if (!isAuthenticated && inProtectedRoute) {
      // 跳转到登录页，并带上来源参数
      router.replace({
        pathname: "/auth",
        params: { redirect: "/publish" },
      });
    }
    // 已登录时不自动跳主页
  }, [isAuthenticated, segments, isLoading]);

  return <>{children}</>;
}
