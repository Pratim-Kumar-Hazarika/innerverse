import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../../stores/useAppStore";

export default function CategoryEntriesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getCategoryById, getEntriesByCategory } = useAppStore();

  const category = getCategoryById(id as string);
  const entries = getEntriesByCategory(id as string);

  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Category not found</Text>
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

  const handleEntryPress = (entryId: string) => {
    router.push(`/entry/${entryId}`);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.categoryInfo}>
            <Ionicons
              name={category.icon as any}
              size={24}
              color={category.color}
            />
            <Text style={styles.headerTitle}>{category.name}</Text>
          </View>
          <Text style={styles.entryCount}>{entries.length} thoughts</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color="#6B7280" />
            <Text style={styles.emptyTitle}>No thoughts yet</Text>
            <Text style={styles.emptySubtitle}>
              Start writing your first thought in this category
            </Text>
            <TouchableOpacity
              style={styles.writeButton}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/new",
                  params: { categoryId: id as string },
                })
              }
            >
              <Text style={styles.writeButtonText}>Write</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.entriesGrid}>
            {entries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={styles.entryCard}
                activeOpacity={0.8}
                onPress={() => handleEntryPress(entry.id)}
              >
                {entry.image && (
                  <Image
                    source={{ uri: entry.image }}
                    style={styles.entryImage}
                  />
                )}
                <View style={styles.entryContent}>
                  <Text style={styles.entryTitle} numberOfLines={2}>
                    {entry.title}
                  </Text>
                  <Text style={styles.entryDescription} numberOfLines={3}>
                    {truncateText(entry.content, 120)}
                  </Text>
                  <View style={styles.entryMeta}>
                    <Text style={styles.entryDate}>
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  entryCount: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  entriesGrid: {
    gap: 16,
    paddingVertical: 16,
  },
  entryCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  entryImage: {
    width: "100%",
    height: 160,
  },
  entryContent: {
    padding: 16,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  entryDescription: {
    fontSize: 14,
    color: "#9CA3AF",
    lineHeight: 20,
    marginBottom: 12,
  },
  entryMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entryDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    paddingHorizontal: 40,
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
  writeButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginTop: 20,
  },
  writeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
