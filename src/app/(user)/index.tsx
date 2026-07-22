import "../../../global.css";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
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
import { useLogout } from "./hooks/useLogout";
import { Modal } from "react-native";

export default function ChatListScreen() {
  const { chats, loading, handleNewMessage } = useChatList();
  useNewChatSocket(handleNewMessage);
  const { showModal, setShowModal, handleLogout } = useLogout();

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
          <View>
            <View
              className="flex-row justify-between items-center mb-4"
              style={{ zIndex: 10 }}
            >
              <Text className="text-3xl font-bold text-gray-900 tracking-tight">
                Chats
              </Text>
              <View>
                <Pressable
                  onPress={() => setShowModal(true)}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <UserIcon size={22} color="#374151" />
                </Pressable>

                <Modal
                  visible={showModal}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setShowModal(false)}
                >
                  <Pressable
                    style={{ flex: 1 }}
                    onPress={() => setShowModal(false)}
                  >
                    <View
                      className="absolute bg-white rounded-xl border border-gray-200 shadow-lg"
                      style={{ minWidth: 140, elevation: 6, top: 90, right: 16 }}
                    >
                      <Pressable
                        onPress={handleLogout}
                        className="px-4 py-3 active:bg-gray-50"
                      >
                        <Text className="text-sm text-red-600 font-medium">
                          Logout
                        </Text>
                      </Pressable>
                    </View>
                  </Pressable>
                </Modal>
              </View>
            </View>
          </View>
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