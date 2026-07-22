import { apiClient } from "@/src/lib/apiClient";
import { User } from "@/types/type.res";
import { useEffect, useState } from "react";


export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<User>("/auth/check")
      .then(({ data }) => setUser(data))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}