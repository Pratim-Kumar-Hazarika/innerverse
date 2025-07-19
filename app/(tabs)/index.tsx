import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

export default function HomeScreen() {
  const { entries, getCategoryById } = useAppStore();
  const router = useRouter();

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
        <Text style={styles.title}>Your Thoughts</Text>
        <Text style={styles.subtitle}>All your journal entries</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#6B7280" />
            <Text style={styles.emptyTitle}>No thoughts yet</Text>
            <Text style={styles.emptySubtitle}>
              Start writing your first thought
            </Text>
            <TouchableOpacity
              style={styles.writeButton}
              onPress={() => router.push("/(tabs)/new")}
            >
              <Text style={styles.writeButtonText}>Write</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.entriesGrid}>
            {entries.map((entry) => {
              const category = getCategoryById(entry.categoryId);
              return (
                <TouchableOpacity
                  key={entry.id}
                  style={[
                    styles.entryCard,
                    category && {
                      borderLeftColor: category.color,
                      borderLeftWidth: 4,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleEntryPress(entry.id)}
                >
                  <View style={styles.entryContent}>
                    <Text style={styles.entryTitle} numberOfLines={1}>
                      {entry.title}
                    </Text>
                    <Text style={styles.entryDescription} numberOfLines={2}>
                      {truncateText(entry.content, 80)}
                    </Text>
                    <View style={styles.entryMeta}>
                      {category && (
                        <View style={styles.categoryTag}>
                          <Ionicons
                            name={category.icon as any}
                            size={12}
                            color={category.color}
                          />
                          <Text style={styles.categoryText}>
                            {category.name}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.entryDate}>
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  {entry.image && (
                    <Image
                      source={{ uri: entry.image }}
                      style={styles.entryImage}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
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
    borderLeftWidth: 4,
    height: 100,
    flexDirection: "row",
  },
  entryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 10,
  },
  entryContent: {
    padding: 12,
    flex: 1,
    justifyContent: "space-between",
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  entryDescription: {
    fontSize: 12,
    color: "#9CA3AF",
    lineHeight: 16,
    marginBottom: 8,
  },
  entryMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  categoryText: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "500",
  },
  entryDate: {
    fontSize: 10,
    color: "#6B7280",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    marginTop: 100,
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
