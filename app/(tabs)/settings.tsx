import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../../stores/useAppStore";

export default function SettingsScreen() {
  const { settings, updateSettings } = useAppStore();

  const settingsSections = [
    {
      title: "Appearance",
      items: [
        {
          id: 1,
          title: "Dark Mode",
          subtitle: "Use dark theme",
          icon: "moon-outline",
          type: "switch",
          value: settings.isDarkMode,
          onValueChange: (value: boolean) =>
            updateSettings({ isDarkMode: value }),
        },
        {
          id: 2,
          title: "Font Size",
          subtitle:
            settings.fontSize.charAt(0).toUpperCase() +
            settings.fontSize.slice(1),
          icon: "text-outline",
          type: "chevron",
        },
      ],
    },
    {
      title: "Privacy & Security",
      items: [
        {
          id: 3,
          title: "Biometric Lock",
          subtitle: "Use Face ID or Touch ID",
          icon: "finger-print-outline",
          type: "switch",
          value: settings.biometric,
          onValueChange: (value: boolean) =>
            updateSettings({ biometric: value }),
        },
        {
          id: 4,
          title: "Auto Lock",
          subtitle: "Lock after 5 minutes",
          icon: "lock-closed-outline",
          type: "switch",
          value: settings.autoLock,
          onValueChange: (value: boolean) =>
            updateSettings({ autoLock: value }),
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          id: 5,
          title: "Push Notifications",
          subtitle: "Daily reminders",
          icon: "notifications-outline",
          type: "switch",
          value: settings.notifications,
          onValueChange: (value: boolean) =>
            updateSettings({ notifications: value }),
        },
        {
          id: 6,
          title: "Reminder Time",
          subtitle: settings.reminderTime,
          icon: "time-outline",
          type: "chevron",
        },
      ],
    },
    {
      title: "Data & Storage",
      items: [
        {
          id: 7,
          title: "Export Data",
          subtitle: "Backup your entries",
          icon: "download-outline",
          type: "chevron",
        },
        {
          id: 8,
          title: "Clear All Data",
          subtitle: "Delete everything",
          icon: "trash-outline",
          type: "chevron",
          destructive: true,
        },
      ],
    },
    {
      title: "About",
      items: [
        {
          id: 9,
          title: "Version",
          subtitle: "1.0.0",
          icon: "information-circle-outline",
          type: "none",
        },
        {
          id: 10,
          title: "Privacy Policy",
          subtitle: "Read our privacy policy",
          icon: "shield-checkmark-outline",
          type: "chevron",
        },
        {
          id: 11,
          title: "Terms of Service",
          subtitle: "Read our terms",
          icon: "document-text-outline",
          type: "chevron",
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        activeOpacity={0.7}
        disabled={item.type === "switch" || item.type === "none"}
      >
        <View style={styles.settingContent}>
          <Ionicons
            name={item.icon as any}
            size={24}
            color={item.destructive ? "#EF4444" : "#9CA3AF"}
            style={styles.settingIcon}
          />
          <View style={styles.settingInfo}>
            <Text
              style={[
                styles.settingTitle,
                item.destructive && styles.destructiveText,
              ]}
            >
              {item.title}
            </Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
        </View>

        {item.type === "switch" && (
          <Switch
            value={item.value}
            onValueChange={item.onValueChange}
            trackColor={{ false: "#374151", true: "#3B82F6" }}
            thumbColor={item.value ? "#FFFFFF" : "#9CA3AF"}
          />
        )}

        {item.type === "chevron" && (
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your experience</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "ArianaVioleta",
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 12,
    paddingHorizontal: 20,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: "#111827",
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  destructiveText: {
    color: "#EF4444",
  },
});
