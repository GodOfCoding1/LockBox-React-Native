import { useState } from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  NativeBaseProvider,
} from "native-base";
import { loginUser } from "@/api/api";
import { saveToLocal } from "@/utlis/secure-store";
import { useRouter } from "expo-router";

const LoginSheet = () => {
  const [username, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  // State for response message
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle form submission
  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("username and password are required.");
      return;
    }

    setIsLoading(true);
    const loginData = { username, password };

    try {
      const response = await loginUser(loginData);
      setMessage(response.message);

      if (response.success) {
        saveToLocal("token", response.token);
        alert("done!");
        // Handle successful login, e.g., navigate to the main screen
        console.log("Login successful:", response.message);
      } else {
        console.log(response);

        console.warn("Login failed:", response.message);
      }
    } catch (error) {
      setMessage("An error occurred during login. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading
          size="lg"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
        >
          Welcome
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: "warmGray.200",
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs"
        >
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl isRequired>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              placeholder="Username"
              keyboardType="default"
              autoCapitalize="none"
              value={username}
              onChangeText={setEmail}
            />
          </FormControl>

          <FormControl isRequired>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
          </FormControl>
          <Button mt="2" colorScheme="indigo" onPress={handleLogin}>
            Sign in
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: "warmGray.200",
              }}
            >
              I'm a new user.{" "}
            </Text>
            <Link
              _text={{
                color: "indigo.500",
                fontWeight: "medium",
                fontSize: "sm",
              }}
              onPress={() => router.push("/register")}
            >
              Sign Up
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
};

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <LoginSheet />
      </Center>
    </NativeBaseProvider>
  );
};
