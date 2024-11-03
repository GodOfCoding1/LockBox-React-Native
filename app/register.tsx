// app/Register.js
import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Center,
  NativeBaseProvider,
  Text,
} from "native-base";
import { registerUser } from "@/api/api";
import { useRouter } from "expo-router";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      // Create the request body
      const requestBody = {
        username,
        email,
        password,
        master_password: masterPassword,
      };

      // Replace this URL with your backend's endpoint
      const response = await registerUser(requestBody);
      if (!response.success) {
        setError(response.message);
      }
      // Handle successful registration
      console.log("User registered:", response.data);
      router.push("/login");
    } catch (err) {
      // Handle registration error
      setError("Failed to register. Please try again.");
      console.error(err);
    }
  };

  return (
    <Center w="100%">
      <Box safeArea p="2" w="90%" maxW="290" py="8">
        <Heading
          size="lg"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
          fontWeight="semibold"
        >
          Welcome
        </Heading>
        <Heading
          mt="1"
          color="coolGray.600"
          _dark={{
            color: "warmGray.200",
          }}
          fontWeight="medium"
          size="xs"
        >
          Sign up to continue!
        </Heading>
        <VStack space={3} mt="5">
          <FormControl isRequired>
            <FormControl.Label>Username</FormControl.Label>
            <Input
              placeholder="Username"
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label>Master Password</FormControl.Label>
            <Input
              placeholder="Master Password"
              type="password"
              value={masterPassword}
              onChangeText={(text) => setMasterPassword(text)}
            />
          </FormControl>
          {error && <Text color="red.500">{error}</Text>}

          <Button mt="2" colorScheme="indigo" onPress={handleRegister}>
            Sign up
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <Register />
      </Center>
    </NativeBaseProvider>
  );
};
