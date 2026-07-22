import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowDownWideNarrowIcon, Send } from "lucide-react-native";
import { useAuthUser } from "../hooks/useAuthUser";
import { useConversation } from "../hooks/useConversation";
import { MessageBackground } from "../components/MessageBackground";
import {  Image } from 'react-native';
import { withDateLabels } from "../hooks/useMessageGroups";
import { useImagePicker } from "../hooks/useImagePicker";

export default function ChatScreen() {
  const { id, fullName } = useLocalSearchParams<{ id: string; fullName: string }>();
  const { user: me } = useAuthUser();
  const { messages, loading, sendMessage } = useConversation(id, me?._id);
  const [text, setText] = useState("");
  const { image, handleImagePicker, setImage } = useImagePicker();
  const rows = useMemo(() => withDateLabels(messages), [messages]);
  const handleSend = () => {
    sendMessage(text, image);
    setText("");
    setImage(null);
  };


  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <View className="p-4 border-b border-gray-100">
        <Text className="text-xl font-bold">{fullName}</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior='padding'
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        {loading ? (
          <View style={{ flex: 1 }} className="items-center justify-center">
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={rows}
            keyExtractor={(row) => row.id}
            contentContainerStyle={{ flexGrow: 1, padding: 16 }}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-900">
                  No messages yet.{"\n"}
                  Start the conversation!
                </Text>
              </View>
            }
            renderItem={({ item }) =>
              item.type === "label" ? (
                <View className="items-center py-1">
                  <Text className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full overflow-hidden">
                    {item.label}
                  </Text>
                </View>
              ) : (
                <MessageBackground message={item.message} isMine={item.message.senderId === me?._id} />
              )
            }
          />
        )}

        <View className="border-t border-gray-100">
          {image && (
            <View className="items-center pt-4 pb-2">
              <View className="relative w-24 h-24">
                <Image source={{ uri: image }} className="w-24 h-24 rounded-2xl" />
                <Pressable
                  onPress={() => setImage(null)}
                  className="absolute -top-2 -right-2 bg-black rounded-full w-6 h-6 items-center justify-center"
                >
                  <Text className="text-white text-xs">×</Text>
                </Pressable>
              </View>
            </View>
          )}
          <View className="flex-row items-center p-3">
            <Pressable onPress={() => handleImagePicker()} className="p-2">
              <ArrowDownWideNarrowIcon size={16} />
            </Pressable>
            <TextInput
              className="flex-1 text-gray-700 border border-gray-900 rounded-full p-4 mr-2"
              placeholderTextColor="#374151"
              placeholder="Type a message"
              value={text}
              onChangeText={setText}
              multiline
            />
            <Pressable
              onPress={handleSend}
              disabled={!text.trim() && !image}
              className="bg-black rounded-full p-3"
              style={{ opacity: text.trim() ? 1 : 0.4 }}
            >
              <Send size={18} color="white" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}