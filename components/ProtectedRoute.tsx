// components/withAuth.js
import React, { PropsWithChildren, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { isLoggedin } from "@/api/api";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await isLoggedin();
        if (!response) {
          router.push("/login");
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error checking authentication:", error);
        alert("Please login again");
        router.push("/login");
        return;
      }
    };

    checkAuth();
  }, []);

  // Render the protected component if authenticated
  return isAuthenticated === null ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    children
  );
};

export default ProtectedRoute;
