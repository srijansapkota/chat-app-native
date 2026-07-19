import { apiClient } from "@/src/lib/apiClient";
import { ChatListItem, Message, User } from "@/types/type.res";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";

function mergeNewMessage(chats: ChatListItem[], message: Message): ChatListItem[] {
  const otherUserId = chats.find(
    (c) => c.user._id === message.senderId || c.user._id === message.receiverId
  )?.user._id;
  if (!otherUserId) return chats;

  const index = chats.findIndex((c) => c.user._id === otherUserId);
  if (index === -1) return chats;

  const updated = [...chats];
  const [chat] = updated.splice(index, 1);
  updated.unshift({ ...chat, lastMessage: message });
  return updated;
}

export function useChatList() {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<ChatListItem[]>([]);

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);

      const { data: users } = await apiClient.get<User[]>("/messages/users");

      const chatsWithHistory = await Promise.all(
        users.map(async (user) => {
          const { data: messages } = await apiClient.get<Message[]>(
            `/messages/${user._id}`
          );
          const lastMessage = messages.length
            ? messages[messages.length - 1]
            : null;
          return { user, lastMessage };
        })
      );

      const sorted = [...chatsWithHistory].sort((a, b) => {
        const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
        const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
        return bTime - aTime;
      });

      setChats(sorted);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("An unexpected error occurred", ToastAndroid.SHORT);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleNewMessage = useCallback((message: Message) => {
    setChats((prev) => mergeNewMessage(prev, message));
  }, []);

  return { chats, loading, refetch: fetchChats, handleNewMessage };
}