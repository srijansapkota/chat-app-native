import { socket } from "@/src/lib/socket";
import { Message } from "@/src/types/type.res";
import { useEffect } from "react";

export function useNewChatSocket(onNewMessage: (message: Message) => void) {
  useEffect(() => {
    socket.on("newMessage", onNewMessage);
    return () => {
      socket.off("newMessage", onNewMessage);
    };
  }, [onNewMessage]);
}