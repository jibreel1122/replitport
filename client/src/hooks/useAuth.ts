import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function useAuth() {
  const [checkedOnce, setCheckedOnce] = useState(false);
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !checkedOnce, // Only run once
  });

  useEffect(() => {
    if (!isLoading) {
      setCheckedOnce(true);
    }
  }, [isLoading]);

  return {
    user,
    isLoading: !checkedOnce && isLoading,
    isAuthenticated: !!user,
    error,
  };
}
