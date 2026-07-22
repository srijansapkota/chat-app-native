import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { apiClient } from "@/src/lib/apiClient";
import { connectSocket } from "@/src/lib/socket";
import '@/global.css';

const TOKEN_KEY = "jwt";

function useProtectedRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const segments = useSegments();
  const router = useRouter();

 
  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get("/auth/check");
        connectSocket(response.data._id);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);


  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuthGroup) {  
      router.replace("/(auth)/login");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace("/");
    }
  }, [isLoading, isLoggedIn, segments]);

  return isLoading;
}

export default function RootLayout() {
  const isLoading = useProtectedRoute();

  if (isLoading) {
    return null; 
  }

  return (
      <Stack screenOptions={{ headerShown: false }} />
  );
}