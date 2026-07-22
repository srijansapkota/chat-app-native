import { useState } from "react";

import { router } from "expo-router";
import { clearToken } from "../../../lib/authStorage"
import { disconnectSocket } from "../../../lib/socket"

export const useLogout =  () => {
const [showModal, setShowModal] = useState(false);
  const handleLogout = async () => {
    setShowModal(false);
    disconnectSocket();
    await clearToken();
    router.replace("/(auth)/login");
  };
  return { showModal, setShowModal, handleLogout };
}