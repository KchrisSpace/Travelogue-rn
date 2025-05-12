import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "../../components/CustomAlert";
import { ThemedText } from "../../components/ThemedText";
import { useAuth } from "../../hooks/useAuth";
import { useThemeColor } from "../../hooks/useThemeColor";
import { publishNote } from "../../services/noteService";

const categories = [
  { label: "机遇", value: 1 },
  { label: "发现", value: 2 },
  { label: "标签", value: 4 },
];

export default function PublishScreen() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [imageLink, setImageLink] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [content, setContent] = useState("");
  const backgroundColor = useThemeColor({}, "background");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth?redirect=/publish");
    }
  }, [isAuthenticated, isLoading]);

  const handleCategoryChange = (value: number) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      showAlert("请先登录");
      router.replace("/auth?redirect=/publish");
      return;
    }
    if (!title.trim()) {
      showAlert("标题不能为空");
      return;
    }
    if (!content.trim()) {
      showAlert("正文不能为空");
      return;
    }

    try {
      // 显示加载状态
      setIsSubmitting(true);

      const images: string[] = [];
      if (imageLink) {
        images.push(imageLink);
      } else {
        images.push("https://picsum.photos/360/460?random=333");
      }

      const postData = {
        id: `post_${Date.now()}`,
        user_id: user.id,
        title,
        content,
        image: images,
        video: "",
        location,
        status: "pending",
        created_at: new Date().toISOString(),
        comments: [],
      };

      console.log("准备发布游记:", postData);
      const response = await publishNote(postData);
      console.log("发布游记成功，返回数据:", response);

      if (response) {
        console.log("发布成功，准备跳转页面");
        showAlert("发布成功！");
        setTimeout(() => {
          router.replace("/(tabs)"); // Navigate to the main page or another page
        }, 1500);
      } else {
        showAlert("发布失败，请重试。");
      }
    } catch (error) {
      console.error("发布游记时出错:", error);
      showAlert(error instanceof Error ? error.message : "发布失败，请重试。");
    } finally {
      // 隐藏加载状态
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
        发布游记
      </Text>
      <View style={styles.form}>
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.uploadedImg} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Text style={{ fontSize: 32, color: "#bbb", marginBottom: 8 }}>
                ＋
              </Text>
              <Text style={{ color: "#bbb", fontSize: 14 }}>上传图片</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.inputGroup}>
          <ThemedText>图片链接</ThemedText>
          <TextInput
            style={styles.input}
            value={imageLink}
            onChangeText={setImageLink}
            placeholder="请输入图片链接"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {imageLink ? (
            <Image
              source={{ uri: imageLink }}
              style={{
                width: "100%",
                height: 100,
                marginTop: 8,
                borderRadius: 8,
              }}
            />
          ) : null}
        </View>
        <View style={styles.inputGroup}>
          <ThemedText>标题</ThemedText>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="请输入标题"
          />
        </View>
        <View style={styles.inputGroup}>
          <ThemedText>位置</ThemedText>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="请输入位置"
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText>正文</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={content}
            onChangeText={setContent}
            placeholder="请输入游记内容"
            multiline
            numberOfLines={10}
          />
        </View>
        <Button
          title={isSubmitting ? "发布中..." : "发布"}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  form: {
    // padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 3,
  },
  inputGroup: {
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    backgroundColor: "#f3f4f6",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  uploadBox: {
    width: "100%",
    height: 120,
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  uploadPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  uploadedImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryTag: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#f3f4f6",
  },
  categoryTagActive: {
    borderColor: "#22c55e",
  },
  button: {
    backgroundColor: "#22c55e",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
