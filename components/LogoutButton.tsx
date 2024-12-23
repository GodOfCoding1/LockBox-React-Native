import { deleteFromLocal } from "@/utlis/secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { IconButton, NativeBaseProvider, Text } from "native-base";
import { useColorScheme } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setAuthToUnAuthorized } from "@/redux/slices/authSlice";

const LogOutButton = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const handleLogout = async () => {
    await deleteFromLocal("token");
    dispatch(setAuthToUnAuthorized());
    alert("You have loged out");
    router.push("/login");
  };

  const colorScheme = useColorScheme();
  return (
    <IconButton
      icon={
        <Ionicons
          name="log-out-outline"
          size={24}
          color={colorScheme == "dark" ? "white" : "black"}
        />
      }
      onPress={handleLogout}
    />
  );
};

export default () => {
  return <LogOutButton />;
};
