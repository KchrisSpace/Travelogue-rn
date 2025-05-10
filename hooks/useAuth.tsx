import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserInfo } from "../services/userService";

interface User {
  id: string;
  password: string;
  "user-info"?: {
    avatar?: string;
    nickname?: string;
    gender?: string;
    birthday?: string;
    city?: string;
    signature?: string;
    follow?: string[];
    fans?: string[];
  };
  favorite?: string[];
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (id: string, password: string) => Promise<void>;
  register: (id: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE_URL = "http://localhost:3001";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 从 AsyncStorage 加载用户数据
    loadUser();
    // TODO: 检查本地存储的token
    checkAuthStatus();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      console.error("Error loading user:", error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      // TODO: 验证token有效性
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const login = async (id: string, password: string) => {
    try {
      // 用userService的getUserInfo
      const user = await getUserInfo(id);
      console.log("user", user);
      if (!user) {
        throw new Error("用户不存在");
      }
      if (user.password !== password) {
        throw new Error("密码错误");
      }
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      router.replace("/(tabs)");
    } catch (error) {
      throw error;
    }
  };

  const register = async (id: string, password: string) => {
    try {
      // 检查id是否已存在
      let userExists = false;
      try {
        await getUserInfo(id);
        userExists = true;
      } catch (e) {
        userExists = false;
      }
      if (userExists) {
        throw new Error("该账号已存在");
      }
      // 写入新用户（此处需你后端支持POST /api/user，若无则仅本地存储模拟）
      const newUser = { id, password };
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      router.replace("/(tabs)");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/auth/login");
    } catch (error) {
      console.error("Error removing user:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!user?.id) return;
    try {
      const latest = await getUserInfo(user.id);
      setUser(latest);
      await AsyncStorage.setItem("user", JSON.stringify(latest));
    } catch (error) {
      // 可以选择清空用户或提示
      console.error("刷新用户信息失败", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
        isLoading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
