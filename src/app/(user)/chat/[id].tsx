import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { id, fullName } = useLocalSearchParams<{ id: string; fullName: string }>();

  return (
    <SafeAreaView className="flex-1">
      <View className="p-4">
        <Text className="text-xl font-bold">{fullName}</Text>
        <Text className="text-neutral-500">Chat with user id: {id}</Text>
      </View>
    </SafeAreaView>
  );
}