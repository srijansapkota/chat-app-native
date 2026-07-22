import { KeyboardAvoidingView, Platform, View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react-native";
import { apiClient } from "@/src/lib/apiClient";
import { saveToken } from "@/src/lib/authStorage";
import { connectSocket } from "@/src/lib/socket";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const toggleShowPassword = () => {
    setShowPassword((showState) => !showState);
  };

  const clientSideValidation = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Enter a valid email address");
      return false;
    }
    if (!password) {
      setErrorMessage("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setErrorMessage("");
    if (!clientSideValidation()) return;
    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      await saveToken(response.data.token);
      connectSocket(response.data._id);
      router.replace("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Login failed");
      } else {
        setErrorMessage("Login failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, marginTop: 100 }}
    >
      <Text className="text-4xl text-blue-500 p-4">
        MyChat
      </Text>
        <View className="gap-4 rounded-lg border border-neutral-200 p-4">
          <Text className="text-2xl font-semibold text-neutral-900">Login</Text>

          <View className="gap-1">
            <Text className="text-sm text-neutral-500">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className="rounded-md border border-neutral-300 px-3 py-2.5 text-base text-neutral-900"
            />
          </View>

          <View className="gap-1">
            <Text className="text-sm text-neutral-500">Password</Text>
            <View className="flex-row items-center rounded-md border border-neutral-300 pr-3">
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="flex-1 px-3 py-2.5 text-base text-neutral-900"
              />
              <Pressable onPress={toggleShowPassword} hitSlop={8}>
                {showPassword ? (
                  <EyeOff size={20} color="#737373" />
                ) : (
                  <Eye size={20} color="#737373" />
                )}
              </Pressable>
            </View>
          </View>

          {errorMessage ? (
            <Text className="text-sm text-red-500">{errorMessage}</Text>
          ) : null}

          <Pressable
            onPress={handleLogin}
            disabled={isSubmitting}
            className="ml-auto rounded-md bg-neutral-900 px-5 py-2.5 active:opacity-80 disabled:opacity-50"
          >
            <Text className="font-medium text-white">
              {isSubmitting ? "Logging in..." : "Login"}
            </Text>
          </Pressable>
      </View>

      <View>
        <Text className="text-sm text-neutral-500">
          Don't have an account? <Link href="/signup" className="text-neutral-900">Sign up</Link>
        </Text>
      </View>
      </KeyboardAvoidingView>

  );
}