import "../../../global.css";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { User as UserIcon } from "lucide-react-native";
import { formatTimestamp, getPreviewText } from "./utils/index.utils";
import { useChatList } from "./hooks/useChatList";
import { useNewChatSocket } from "./hooks/useNewChatSocket";


export default function ChatListScreen() {
  const { chats, loading, handleNewMessage } = useChatList();
  useNewChatSocket(handleNewMessage);

  if (loading && chats.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        keyExtractor={(item) => item.user._id}
        data={chats}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <Text className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
            Chats
          </Text>
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <UserIcon size={40} color="#d1d5db" />
            <Text className="text-gray-400 mt-3">No users found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.5}
            className="flex-row items-center p-4 rounded-2xl border border-gray-800"
            onPress={() =>
              router.push({
                pathname: "/chat/[id]",
                params: { id: item.user._id, fullName: item.user.fullName },
              })
            }
          >
            {item.user.profilePic ? (
              <Image
                source={{ uri: item.user.profilePic }}
                style={{ width: 52, height: 52, borderRadius: 26 }}
                contentFit="cover"
              />
            ) : (
              <View
                className="items-center justify-center bg-gray-100"
                style={{ width: 52, height: 52, borderRadius: 26 }}
              >
                <UserIcon size={24} color="#9ca3af" />
              </View>
            )}

            <View className="flex-1 ml-3.5">
              <View className="flex-row justify-between items-center">
                <Text
                  className="font-semibold text-base text-gray-900 flex-1 mr-2"
                  numberOfLines={1}
                >
                  {item.user.fullName}
                </Text>
                {item.lastMessage && (
                  <Text className="text-xs text-gray-400">
                    {formatTimestamp(item.lastMessage.createdAt)}
                  </Text>
                )}
              </View>
              <Text
                className={
                  item.lastMessage
                    ? "text-sm text-gray-500 mt-0.5"
                    : "text-sm text-gray-400 italic mt-0.5"
                }
                numberOfLines={1}
              >
                {getPreviewText(item.lastMessage)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}