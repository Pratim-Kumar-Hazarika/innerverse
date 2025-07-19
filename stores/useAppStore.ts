import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  image?: string;
  mood?: "happy" | "sad" | "neutral" | "excited" | "anxious";
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AppSettings {
  isDarkMode: boolean;
  notifications: boolean;
  biometric: boolean;
  reminderTime: string;
  autoLock: boolean;
  fontSize: "small" | "medium" | "large";
}

interface AppState {
  // Categories
  categories: Category[];
  selectedCategory: string | null;

  // Journal Entries
  entries: JournalEntry[];

  // Settings
  settings: AppSettings;

  // Actions
  addCategory: (
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  selectCategory: (id: string | null) => void;

  addEntry: (
    entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">
  ) => string;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByCategory: (categoryId: string) => JournalEntry[];

  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;

  // Utility
  getCategoryById: (id: string) => Category | undefined;
  getEntryById: (id: string) => JournalEntry | undefined;
}

const defaultCategories: Category[] = [
  {
    id: "1",
    name: "Daily Reflections",
    icon: "book-outline",
    color: "#3B82F6",
    count: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Gratitude",
    icon: "heart-outline",
    color: "#10B981",
    count: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Goals & Dreams",
    icon: "target-outline",
    color: "#F59E0B",
    count: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Challenges",
    icon: "fitness-outline",
    color: "#EF4444",
    count: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Ideas & Creativity",
    icon: "bulb-outline",
    color: "#8B5CF6",
    count: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    name: "Health & Wellness",
    icon: "medical-outline",
    color: "#06B6D4",
    count: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    name: "Learning",
    icon: "school-outline",
    color: "#84CC16",
    count: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const defaultSettings: AppSettings = {
  isDarkMode: true,
  notifications: true,
  biometric: false,
  reminderTime: "21:00",
  autoLock: true,
  fontSize: "medium",
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      categories: defaultCategories,
      selectedCategory: null,
      entries: [],
      settings: defaultSettings,

      // Category actions
      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates, updatedAt: new Date() } : cat
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
          entries: state.entries.filter((entry) => entry.categoryId !== id),
        }));
      },

      selectCategory: (id) => {
        set({ selectedCategory: id });
      },

      // Entry actions
      addEntry: (entryData) => {
        const newEntry: JournalEntry = {
          ...entryData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => {
          const updatedCategories = state.categories.map((cat) =>
            cat.id === entryData.categoryId
              ? { ...cat, count: cat.count + 1, updatedAt: new Date() }
              : cat
          );

          return {
            entries: [...state.entries, newEntry],
            categories: updatedCategories,
          };
        });

        return newEntry.id;
      },

      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { ...entry, ...updates, updatedAt: new Date() }
              : entry
          ),
        }));
      },

      deleteEntry: (id) => {
        set((state) => {
          const entry = state.entries.find((e) => e.id === id);
          const updatedCategories = state.categories.map((cat) =>
            cat.id === entry?.categoryId
              ? {
                  ...cat,
                  count: Math.max(0, cat.count - 1),
                  updatedAt: new Date(),
                }
              : cat
          );

          return {
            entries: state.entries.filter((entry) => entry.id !== id),
            categories: updatedCategories,
          };
        });
      },

      getEntriesByCategory: (categoryId) => {
        return get().entries.filter((entry) => entry.categoryId === categoryId);
      },

      // Settings actions
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      resetSettings: () => {
        set({ settings: defaultSettings });
      },

      // Utility functions
      getCategoryById: (id) => {
        return get().categories.find((cat) => cat.id === id);
      },

      getEntryById: (id) => {
        return get().entries.find((entry) => entry.id === id);
      },
    }),
    {
      name: "innerverse-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        categories: state.categories,
        entries: state.entries,
        settings: state.settings,
      }),
    }
  )
);
