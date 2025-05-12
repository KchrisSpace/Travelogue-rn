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
import { changePassword } from "../../services/userService";

// 简单的自定义确认弹窗组件
function ConfirmModal({ visible, title, message, onConfirm, onCancel }: any) {
  if (!visible) return null;
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          padding: 24,
          width: 280,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#333",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {message}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={{
              flex: 1,
              marginRight: 8,
              backgroundColor: "#f1f1f1",
              borderRadius: 8,
              padding: 12,
              alignItems: "center",
            }}
            onPress={onCancel}
          >
            <Text style={{ color: "#333", fontWeight: "bold" }}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              marginLeft: 8,
              backgroundColor: "#22c55e",
              borderRadius: 8,
              padding: 12,
              alignItems: "center",
            }}
            onPress={onConfirm}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>确定</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// 简单自定义警告弹窗
function SimpleAlert({
  visible,
  message,
  onClose,
}: {
  visible: boolean;
  message: string;
  onClose: () => void;
}) {
  if (!visible) return null;
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 28,
          width: 260,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "#ff4d67",
            fontWeight: "bold",
            marginBottom: 16,
          }}
        >
          提示
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#333",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          {message}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          style={{
            backgroundColor: "#3bb3e6",
            borderRadius: 8,
            paddingVertical: 10,
            paddingHorizontal: 32,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            我知道了
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SettingScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [passwordModal, setPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    type: "",
    title: "",
    message: "",
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // 修改密码逻辑
  const handleChangePassword = async () => {
    if (!user?.id) {
      setAlertMessage("你还未登录，请先登录");
      setAlertVisible(true);
      return;
    }
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("");
      Alert.alert("错误", "请填写所有密码字段");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("");
      setNewPassword("");
      setConfirmPassword("");
      setNewPasswordError("两次新密码必须相同");
      setConfirmPasswordError("两次新密码必须相同");
      return;
    }
    if (newPassword === oldPassword) {
      setNewPasswordError("不能和旧密码相同");
      return;
    }
    try {
      await changePassword(user.id, oldPassword, newPassword);
      setPasswordError("");
      Alert.alert("成功", "密码已更新，请重新登录", [
        {
          text: "确定",
          onPress: handlePasswordChangeSuccess,
        },
      ]);
      setPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      setOldPassword("");
      setPasswordError("密码不正确");
    }
  };

  // 登出账号
  const handleLogout = () => {
    if (!user?.id) {
      setAlertMessage("你还未登录，请先登录");
      setAlertVisible(true);
      return;
    }
    setConfirmModal({
      visible: true,
      type: "logout",
      title: "确认登出",
      message: "确定要退出登录吗？",
    });
  };

  // 切换账号
  const handleSwitchAccount = () => {
    if (!user?.id) {
      setAlertMessage("你还未登录，请先登录");
      setAlertVisible(true);
      return;
    }
    setConfirmModal({
      visible: true,
      type: "switch",
      title: "确认切换账号",
      message: "确定要切换到其他账号吗？",
    });
  };

  // 修改密码成功后登出
  const handlePasswordChangeSuccess = async () => {
    await logout();
    router.replace("/auth");
  };

  // 关于开发者
  const handleAboutDeveloper = () => {
    router.push("/setting/about");
  };

  // 确认弹窗的回调
  const handleConfirm = async () => {
    setConfirmModal({ ...confirmModal, visible: false });
    if (confirmModal.type === "logout" || confirmModal.type === "switch") {
      await logout();
      router.replace("/auth");
    }
  };
  const handleCancel = () => {
    setConfirmModal({ ...confirmModal, visible: false });
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
                onChangeText={(text) => {
                  setOldPassword(text);
                  setPasswordError("");
                  setNewPasswordError("");
                  setConfirmPasswordError("");
                }}
                secureTextEntry
              />
              {passwordError ? (
                <Text style={{ color: "red", marginBottom: 8 }}>
                  {passwordError}
                </Text>
              ) : null}
              <TextInput
                style={styles.input}
                placeholder="新密码"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setPasswordError("");
                  setNewPasswordError("");
                  setConfirmPasswordError("");
                }}
                secureTextEntry
              />
              {newPasswordError ? (
                <Text style={{ color: "red", marginBottom: 8 }}>
                  {newPasswordError}
                </Text>
              ) : null}
              <TextInput
                style={styles.input}
                placeholder="确认新密码"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setPasswordError("");
                  setNewPasswordError("");
                  setConfirmPasswordError("");
                }}
                secureTextEntry
              />
              {confirmPasswordError ? (
                <Text style={{ color: "red", marginBottom: 8 }}>
                  {confirmPasswordError}
                </Text>
              ) : null}

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
      <ConfirmModal
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <SimpleAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
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
