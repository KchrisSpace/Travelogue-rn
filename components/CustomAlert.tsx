import React from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText"; // Assuming ThemedText is in the same directory or adjust path

interface CustomAlertProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const { width } = Dimensions.get("window");

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  message,
  onClose,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertContainer}>
          <View style={styles.messageContainer}>
            <ThemedText style={styles.alertMessage}>{message}</ThemedText>
          </View>
          <TouchableOpacity
            style={styles.alertButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.alertButtonText}>确定</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    width: width * 0.75,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  messageContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  alertMessage: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
    color: "#333",
  },
  alertButton: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  alertButtonText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomAlert;
