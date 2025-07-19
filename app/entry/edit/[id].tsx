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
import { useAppStore } from "../../../stores/useAppStore";

export default function EditEntryScreen() {
  const { id } = useLocalSearchParams();
  const { categories, getEntryById, updateEntry } = useAppStore();
  const router = useRouter();

  const entry = getEntryById(id as string);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Pre-populate form with existing entry data
  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setSelectedCategory(entry.categoryId);
      setSelectedImage(entry.image || null);
    }
  }, [entry]);

  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Entry not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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

    const updatedEntry = {
      title: title.trim(),
      content: content.trim(),
      categoryId: selectedCategory,
      image: selectedImage,
    };

    // Update entry
    updateEntry(entry.id, updatedEntry);

    // Navigate back to entry detail
    router.back();
  };

  const handleClose = () => {
    // Navigate back without saving
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleClose}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Thought</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
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
              <View style={styles.imagePreview}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.previewImage}
                />
                <View style={styles.imageOverlay}>
                  <Ionicons name="camera" size={24} color="#FFFFFF" />
                  <Text style={styles.imageOverlayText}>Change Image</Text>
                </View>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={32} color="#6B7280" />
                <Text style={styles.imagePlaceholderText}>
                  Add an image (Required)
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  backButton: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#374151",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  dropdownButton: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  dropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    marginTop: 4,
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
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
    borderWidth: 1,
    borderColor: "#374151",
    overflow: "hidden",
  },
  imagePreview: {
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: 200,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  imageOverlayText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  imagePlaceholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#9CA3AF",
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#3B82F6",
    fontWeight: "600",
  },
});
