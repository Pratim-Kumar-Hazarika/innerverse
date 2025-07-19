import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddCategoryModal from "../../components/AddCategoryModal";
import FloatingActionButton from "../../components/FloatingActionButton";
import { useAppStore } from "../../stores/useAppStore";

// ✅ This hides the header for this screen
export const unstable_settings = {
  initialRouteName: "categories",
};

export default function CategoriesScreen() {
  const { categories, addCategory, deleteCategory } = useAppStore();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddCategory = () => {
    setIsModalVisible(true);
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${categoryName}"? This will also delete all entries in this category.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCategory(categoryId),
        },
      ]
    );
  };

  return (
    <>
      {/* ✅ Hide default header */}
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Categories</Text>
          <Text style={styles.subtitle}>Organize your thoughts</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <View key={category.id} style={styles.categoryCardContainer}>
                <TouchableOpacity
                  style={[
                    styles.categoryCard,
                    { borderLeftColor: category.color },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleCategoryPress(category.id)}
                >
                  <View style={styles.categoryContent}>
                    <Ionicons
                      name={category.icon as any}
                      size={24}
                      color={category.color}
                      style={styles.categoryIcon}
                    />
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categoryCount}>
                        {category.count} thaughts
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Delete button for non-default categories */}
                {!["1", "2", "3"].includes(category.id) && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() =>
                      handleDeleteCategory(category.id, category.name)
                    }
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        <FloatingActionButton onPress={handleAddCategory} />
        <AddCategoryModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </SafeAreaView>
    </>
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    // textAlign: "center",
    // fontFamily: "ArianaVioleta",
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
    // textAlign: "center",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryCardContainer: {
    position: "relative",
  },
  categoryCard: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  deleteButton: {
    position: "absolute",
    right: 16,
    top: 16,
    backgroundColor: "#1F2937",
    borderRadius: 8,
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});
