import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterScreen() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!id || !password || !confirmPassword) {
      Alert.alert("错误", "请填写所有信息");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("错误", "两次输入的密码不一致");
      return;
    }
    try {
      await register(id, password);
    } catch (error: any) {
      Alert.alert("注册失败", error.message || "请重试");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>注册账号</Text>
          <Text style={styles.subtitle}>开启你的青春旅程</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="账号"
            value={id}
            onChangeText={setId}
            autoCapitalize="none"
            placeholderTextColor="#b3e0f7"
          />
          <TextInput
            style={styles.input}
            placeholder="密码"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#b3e0f7"
          />
          <TextInput
            style={styles.input}
            placeholder="确认密码"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor="#b3e0f7"
          />
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>注册</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>已经有账号？ </Text>
          <TouchableOpacity
            onPress={() => {
              // 跳转到登录页
              // @ts-ignore
              if (typeof router !== "undefined") router.replace("/auth/login");
            }}
          >
            <Text style={styles.loginLink}>去登录</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f6fb",
    justifyContent: "center",
    overflow: "hidden",
  },
  bgCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#b3e0f7",
    top: -80,
    left: -80,
    opacity: 0.3,
  },
  bgCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#3bb3e6",
    bottom: -60,
    right: -60,
    opacity: 0.22,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 36,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#3bb3e6",
    marginBottom: 6,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#5ac8fa",
    letterSpacing: 1,
  },
  form: {
    gap: 18,
    backgroundColor: "#ffffff90",
    borderRadius: 18,
    padding: 24,
    shadowColor: "#3bb3e6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  input: {
    backgroundColor: "#e6f6fb",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#b3e0f7",
    color: "#3bb3e6",
  },
  registerButton: {
    backgroundColor: "#3bb3e6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#3bb3e6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 2,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#5ac8fa",
    fontSize: 15,
  },
  loginLink: {
    color: "#3bb3e6",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 2,
  },
});
