import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
export const navigationOptions = {
  headerShown: false,
};

export default function Index() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "space-around",
        paddingVertical: 30,
      }}
    >
      {/* Icon + App Name */}
      <View className="flex-row items-center justify-center  py-3">
        {" "}
        <Text
          style={{
            color: "#3B82F6",
            fontSize: 38,
            fontWeight: "bold",
            fontFamily: "ArianaVioleta",
          }}
        >
          Inner~
        </Text>
        <Text
          style={{
            color: "#EC4899",
            fontSize: 38,
            fontWeight: "bold",
            fontFamily: "ArianaVioleta",
          }}
        >
          verse
        </Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <Image
          source={require("../assets/images/logo1.png")}
          style={{ width: 388, height: 388, borderRadius: 16 }}
        />
      </View>

      {/* Welcome & Description */}
      <View style={{ paddingHorizontal: 30, alignItems: "center" }}>
        <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center" }}>
          Capture your thoughts and feelings in a safe, offline space.
        </Text>
      </View>

      {/* Button */}
      <Pressable
        style={{
          backgroundColor: "#1D4ED8",
          paddingVertical: 14,
          paddingHorizontal: 60,
          borderRadius: 30,
        }}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
          Get Started
        </Text>
      </Pressable>
    </View>
  );
}
