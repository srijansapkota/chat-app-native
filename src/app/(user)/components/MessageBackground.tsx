import { Message } from "@/types/type.res";
import { Image, Text, View } from "react-native";

export function MessageBackground({ message, isMine }: { message: Message; isMine: boolean }) {
  const now = new Date().getDate()
  return (
    
    <View className={isMine ? "items-end" : "items-start"}>
      <View
        className={
          isMine
            ? "bg-black rounded-2xl px-4 py-2.5 max-w-[80%]"
            : "bg-gray-100 rounded-2xl px-4 py-2.5 max-w-[80%]"
        }
      >
        {message.image && (
          <Image
            source={{ uri: message.image }}
            style={{ width: 200, height: 200, borderRadius: 12, marginBottom: message.text ? 6 : 0 }}
            resizeMode="cover"
          />
        )}
        {!!message.text && (
          <Text className={isMine ? "text-white" : "text-gray-900"}>
            {message.text}
          </Text>
        )}
      </View>
    </View>
  );
}