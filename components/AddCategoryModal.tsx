import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useAppStore } from "../stores/useAppStore";

interface AddCategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const categoryIcons = [
  { name: "book-outline", label: "Book" },
  { name: "heart-outline", label: "Heart" },
  { name: "target-outline", label: "Target" },
  { name: "fitness-outline", label: "Fitness" },
  { name: "bulb-outline", label: "Bulb" },
  { name: "people-outline", label: "People" },
  { name: "medical-outline", label: "Medical" },
  { name: "school-outline", label: "School" },
  { name: "star-outline", label: "Star" },
  { name: "leaf-outline", label: "Leaf" },
  { name: "car-outline", label: "Car" },
  { name: "home-outline", label: "Home" },
  { name: "business-outline", label: "Business" },
  { name: "game-controller-outline", label: "Game" },
  { name: "musical-notes-outline", label: "Music" },
  { name: "camera-outline", label: "Camera" },
];

const categoryColors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
  "#14B8A6",
  "#F43F5E",
  "#8B5A2B",
  "#6B7280",
  "#059669",
  "#DC2626",
];

const iconColors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
  "#14B8A6",
  "#F43F5E",
];

export default function AddCategoryModal({
  isVisible,
  onClose,
}: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("book-outline");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [selectedIconColor, setSelectedIconColor] = useState("#3B82F6");
  const { addCategory } = useAppStore();

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }

    addCategory({
      name: categoryName.trim(),
      icon: selectedIcon,
      color: selectedColor,
      count: 0,
    });

    // Reset form
    setCategoryName("");
    setSelectedIcon("book-outline");
    setSelectedColor("#3B82F6");
    setSelectedIconColor("#3B82F6");
    onClose();
  };

  const handleCancel = () => {
    setCategoryName("");
    setSelectedIcon("book-outline");
    setSelectedColor("#3B82F6");
    setSelectedIconColor("#3B82F6");
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleCancel}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.container}>
        {/* Handle bar */}
        <View style={styles.handleBar} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add New Category</Text>
          <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Category Name Input */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Category Name</Text>
            <TextInput
              style={styles.textInput}
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="Enter category name..."
              placeholderTextColor="#6B7280"
              maxLength={30}
            />
          </View>

          {/* Icon Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Choose Icon</Text>
            <View style={styles.iconGrid}>
              {categoryIcons.map((icon) => (
                <TouchableOpacity
                  key={icon.name}
                  style={[
                    styles.iconItem,
                    selectedIcon === icon.name && styles.selectedIconItem,
                  ]}
                  onPress={() => setSelectedIcon(icon.name)}
                >
                  <Ionicons
                    name={icon.name as any}
                    size={24}
                    color={
                      selectedIcon === icon.name ? selectedIconColor : "#9CA3AF"
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Icon Color Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Choose Icon Color</Text>
            <View style={styles.colorGrid}>
              {iconColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorItem,
                    { backgroundColor: color },
                    selectedIconColor === color && styles.selectedColorItem,
                  ]}
                  onPress={() => setSelectedIconColor(color)}
                >
                  {selectedIconColor === color && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category Color Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Category Color</Text>
            <View style={styles.colorGrid}>
              {categoryColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorItem,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorItem,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: selectedColor }]}
            onPress={handleAddCategory}
          >
            <Text style={styles.addButtonText}>Create Category</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: "#111827",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 800,
    maxHeight: "100%",
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#374151",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  iconItem: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedIconItem: {
    borderColor: "#3B82F6",
    backgroundColor: "#1E3A8A",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColorItem: {
    borderColor: "#FFFFFF",
    borderWidth: 3,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
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
  addButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    paddingBottom: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
