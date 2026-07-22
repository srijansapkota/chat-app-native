import { io, Socket } from "socket.io-client";
import { API_URL } from "@/src/config/api";

const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, 
  query: {},
});

export function connectSocket(userId: string) {
  if (socket.connected) return;


  socket.io.opts.query = { userId };
  socket.connect();
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}