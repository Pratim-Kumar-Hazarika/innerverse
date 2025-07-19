import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../../stores/useAppStore";

export default function NewEntryScreen() {
  const { categories, addEntry } = useAppStore();
  const router = useRouter();
  const { categoryId } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Set pre-selected category from URL parameters
  useEffect(() => {
    if (categoryId && typeof categoryId === "string") {
      setSelectedCategory(categoryId);
    }
  }, [categoryId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    if (!content.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    if (!selectedImage) {
      Alert.alert("Error", "Please add an image");
      return;
    }

    const newEntry = {
      title: title.trim(),
      content: content.trim(),
      categoryId: selectedCategory,
      image: selectedImage,
      tags: [],
    };

    // Add entry and get the generated ID
    const entryId = addEntry(newEntry);

    // Reset form
    setTitle("");
    setContent("");
    setSelectedCategory("");
    setSelectedImage(null);

    // Navigate back
    router.back();
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setSelectedCategory("");
    setSelectedImage(null);
    // Navigate back to the previous screen
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Write What You Feel</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Input */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Title *</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title... (Required)"
            placeholderTextColor="#6B7280"
            maxLength={100}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Description *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={content}
            onChangeText={setContent}
            placeholder="Write your thoughts..."
            placeholderTextColor="#6B7280"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Category Dropdown */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Category *</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <View style={styles.dropdownContent}>
              {selectedCategory ? (
                <View style={styles.selectedCategory}>
                  <Ionicons
                    name={
                      categories.find((cat) => cat.id === selectedCategory)
                        ?.icon as any
                    }
                    size={20}
                    color={
                      categories.find((cat) => cat.id === selectedCategory)
                        ?.color
                    }
                  />
                  <Text style={styles.selectedCategoryText}>
                    {
                      categories.find((cat) => cat.id === selectedCategory)
                        ?.name
                    }
                  </Text>
                </View>
              ) : (
                <Text style={styles.dropdownPlaceholder}>
                  Select a category (Required)
                </Text>
              )}
              <Ionicons
                name={showCategoryDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color="#9CA3AF"
              />
            </View>
          </TouchableOpacity>

          {showCategoryDropdown && (
            <ScrollView style={styles.dropdownList} nestedScrollEnabled>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    setShowCategoryDropdown(false);
                  }}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={20}
                    color={category.color}
                  />
                  <Text style={styles.dropdownItemText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Image Upload */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Image *</Text>
          <TouchableOpacity
            style={styles.imageUploadButton}
            onPress={pickImage}
          >
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImage}
              />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="camera-outline" size={32} color="#EF4444" />
                <Text style={styles.uploadText}>
                  Every thought deserves an image{" "}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {selectedImage && (
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Text style={styles.removeImageText}>Remove Image</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Entry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomColor: "#1F2937",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  inputSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#374151",
  },
  textArea: {
    minHeight: 140,
    paddingTop: 14,
  },
  dropdownButton: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#374151",
  },
  dropdownContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedCategory: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectedCategoryText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: "#6B7280",
  },
  dropdownList: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#374151",
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  imageUploadButton: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#374151",
    borderStyle: "dashed",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadPlaceholder: {
    alignItems: "center",
    gap: 8,
  },
  uploadText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  removeImageButton: {
    marginTop: 8,
    alignSelf: "center",
  },
  removeImageText: {
    fontSize: 14,
    color: "#EF4444",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 100,
    // borderTopWidth: 1,
    borderTopColor: "#1F2937",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#374151",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
