import { deleteFromLocal } from "@/utlis/secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { IconButton, NativeBaseProvider, Text } from "native-base";
import { useColorScheme } from "react-native";

const LogOutButton = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await deleteFromLocal("token");
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
  return (
    <NativeBaseProvider>
      <LogOutButton />
    </NativeBaseProvider>
  );
};
