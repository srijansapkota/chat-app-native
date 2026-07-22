import { apiClient } from "@/src/lib/apiClient";
import { socket } from "@/src/lib/socket";
import { Message } from "@/types/type.res";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";

export function useConversation(otherUserId: string, myId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiClient
      .get<Message[]>(`/messages/${otherUserId}`)
      .then(({ data }) => {
        if (!cancelled) setMessages(data);
      })
      .catch((error) => {
        const msg = axios.isAxiosError(error)
          ? error.message
          : "Failed to load messages";
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [otherUserId]);

 
  useEffect(() => {
    const onNewMessage = (message: Message) => {
      const belongsHere =
        (message.senderId === otherUserId && message.receiverId === myId) ||
        (message.senderId === myId && message.receiverId === otherUserId);
      if (!belongsHere) return;
      setMessages((prev) =>
        prev.some((m) => m._id === message._id) ? prev : [...prev, message]
      );
    };
    socket.on("newMessage", onNewMessage);
    return () => {
      socket.off("newMessage", onNewMessage);
    };
  }, [otherUserId, myId]);

  const sendMessage = useCallback(
    async (text: string, image: string | null) => {
      const trimmed = text.trim();
      if (!trimmed && !image || sending) return;
      setSending(true);
      try {
        const { data } = await apiClient.post<Message>(
          `/messages/send/${otherUserId}`,
          { text: trimmed , image}
        ); 
      console.log("sent message", data)
        setMessages((prev) =>
          prev.some((m) => m._id === data._id) ? prev : [...prev, data]
        );
      } catch (error) {
        const msg = axios.isAxiosError(error)
          ? error.message
          : "Failed to send message";
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      } finally {
        setSending(false);
      }
    },
    [otherUserId, sending]
  );

  return { messages, loading, sending, sendMessage };
}