// app/Register.js
import React, { useState } from "react";
import { Box, Input, Button, VStack, Text } from "native-base";
import axios from "axios";
import { registerUser } from "@/api/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [error, setError] = useState("");

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

      // Handle successful registration
      console.log("User registered:", response.data);
    } catch (err) {
      // Handle registration error
      setError("Failed to register. Please try again.");
      console.error(err);
    }
  };

  return (
    <Box flex={1} justifyContent="center" alignItems="center" safeArea p="5">
      <VStack space={4} width="90%" maxW="300px">
        <Text fontSize="lg" fontWeight="bold" textAlign="center">
          Register
        </Text>

        <Input
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <Input
          placeholder="Email (optional)"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Input
          placeholder="Master Password"
          type="password"
          value={masterPassword}
          onChangeText={(text) => setMasterPassword(text)}
        />

        {error && <Text color="red.500">{error}</Text>}

        <Button onPress={handleRegister} colorScheme="primary">
          Register
        </Button>
      </VStack>
    </Box>
  );
}
