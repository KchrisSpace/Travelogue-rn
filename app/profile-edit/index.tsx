import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { updateUserInfo } from "../../services/userService";

export default function EditProfile() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // 只允许编辑这三项
  const [avatar, setAvatar] = useState(user?.["user-info"]?.avatar || "");
  const [nickname, setNickname] = useState(user?.["user-info"]?.nickname || "");
  const [signature, setSignature] = useState(
    user?.["user-info"]?.signature || ""
  );

  const handleSave = async () => {
    if (!user) return;
    try {
      await updateUserInfo(user.id, {
        avatar,
        nickname,
        signature,
      });
      Alert.alert("保存成功");
      router.back();
    } catch (e) {
      Alert.alert("保存失败", e.message || "请重试");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.label}>账号（不可更改）</Text>
        <Text style={styles.value}>{user?.id}</Text>

        <Text style={styles.label}>头像链接</Text>
        <TextInput
          style={styles.input}
          value={avatar}
          onChangeText={setAvatar}
          placeholder="请输入头像图片URL"
        />
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : null}

        <Text style={styles.label}>昵称</Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder="请输入昵称"
        />

        <Text style={styles.label}>签名</Text>
        <TextInput
          style={styles.input}
          value={signature}
          onChangeText={setSignature}
          placeholder="请输入签名"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            保存
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 16 },
  value: { fontSize: 16, color: "#888", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 8,
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: "#22c55e",
    borderRadius: 8,
    marginTop: 32,
    paddingVertical: 12,
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: "#22c55e",
    borderRadius: 8,
    marginTop: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
});
