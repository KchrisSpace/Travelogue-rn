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
import { ThemedText } from "../../components/ThemedText";
import { useAuth } from "../../hooks/useAuth";
import { useThemeColor } from "../../hooks/useThemeColor";

const categories = [
  { label: "机遇", value: 1 },
  { label: "发现", value: 2 },
  { label: "标签", value: 4 },
];

export default function PublishScreen() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [content, setContent] = useState("");
  const backgroundColor = useThemeColor({}, "background");

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

  const handleSubmit = () => {
    if (!user) {
      alert("请先登录");
      router.replace("/auth?redirect=/publish");
      return;
    }
    // 只做本地打印，不请求任何接口
    console.log({
      userId: user.id,
      image,
      title,
      location,
      selectedCategories,
      content,
    });
    alert("发布成功！（仅本地模拟）");
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
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
          <ThemedText>分类</ThemedText>
          <View style={styles.categoryRow}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryTag,
                  selectedCategories.includes(cat.value) &&
                    styles.categoryTagActive,
                ]}
                onPress={() => handleCategoryChange(cat.value)}
              >
                <Text
                  style={{
                    color: selectedCategories.includes(cat.value)
                      ? "#22c55e"
                      : "#666",
                    fontWeight: selectedCategories.includes(cat.value)
                      ? "bold"
                      : "normal",
                  }}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
        <Button title="发布" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
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
});
