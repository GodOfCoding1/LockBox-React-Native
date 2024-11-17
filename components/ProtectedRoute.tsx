// components/withAuth.js
import React, { PropsWithChildren, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter, Redirect } from "expo-router";
import { isLoggedin } from "@/api/api";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  setAuthToAuthorized,
  setAuthToUnAuthorized,
} from "@/redux/slices/authSlice";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await isLoggedin();
        if (!response) {
          router.push("/login");
          return;
        }
        dispatch(setAuthToAuthorized());
      } catch (error) {
        console.error("Error checking authentication:", error);
        dispatch(setAuthToUnAuthorized());
        alert("Please login again");
        router.push("/login");
        return;
      }
    };
    console.log("auth checker gets called");
    checkAuth();
  }, []);

  // Render the protected component if authenticated
  return isAuthenticated == null ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : isAuthenticated == true ? (
    children
  ) : (
    <Redirect href={"/login"} />
  );
};

export default ProtectedRoute;
