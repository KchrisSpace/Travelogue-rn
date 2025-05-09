import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";

export default function SettingScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [passwordModal, setPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 修改密码逻辑
  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("错误", "请填写所有密码字段");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("错误", "新密码与确认密码不匹配");
      return;
    }

    // 这里应调用更新密码的API
    Alert.alert("成功", "密码已更新");
    setPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // 登出账号
  const handleLogout = () => {
    Alert.alert("确认登出", "确定要退出登录吗？", [
      {
        text: "取消",
        style: "cancel",
      },
      {
        text: "确定",
        onPress: async () => {
          await logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  // 切换账号
  const handleSwitchAccount = () => {
    Alert.alert("确认切换账号", "确定要切换到其他账号吗？", [
      {
        text: "取消",
        style: "cancel",
      },
      {
        text: "确定",
        onPress: async () => {
          await logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  // 关于开发者
  const handleAboutDeveloper = () => {
    Alert.alert(
      "关于开发者",
      "该应用由XXX开发团队打造\n版本号: 1.0.0\n联系方式: example@email.com"
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "设置",
          headerTransparent: true,
        }}
      />
      <View style={styles.container}>
        <ScrollView>
          {/* 当前账号信息 */}
          <View style={styles.userInfoSection}>
            <View
              style={{ flexDirection: "row", alignItems: "center", height: 28 }}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { marginRight: 12, marginBottom: 0 },
                ]}
              >
                当前账号
              </Text>
              <Text style={[styles.userInfo, { lineHeight: 24 }]}>
                {" "}
                {user?.id || "未登录"}
              </Text>
            </View>
          </View>

          {/* 账号设置 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>账号设置</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setPasswordModal(true)}
            >
              <Ionicons name="key-outline" size={22} color="#555" />
              <Text style={styles.menuText}>更改密码</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSwitchAccount}
            >
              <Ionicons name="swap-horizontal-outline" size={22} color="#555" />
              <Text style={styles.menuText}>切换账号</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#555" />
              <Text style={styles.menuText}>登出账号</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* 关于 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>关于</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleAboutDeveloper}
            >
              <Ionicons
                name="information-circle-outline"
                size={22}
                color="#555"
              />
              <Text style={styles.menuText}>关于开发者</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 修改密码Modal */}
        <Modal
          visible={passwordModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setPasswordModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>修改密码</Text>

              <TextInput
                style={styles.input}
                placeholder="当前密码"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="新密码"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="确认新密码"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setPasswordModal(false)}
                >
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.confirmButtonText}>确认</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    marginTop: 40,
    backgroundColor: "#f5f5f5",
  },
  userInfoSection: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  section: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  userInfo: {
    fontSize: 16,
    color: "#666",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },
  // Modal样式
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
  },
  confirmButton: {
    backgroundColor: "#22c55e",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
