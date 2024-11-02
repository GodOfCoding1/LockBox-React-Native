import React, { useState } from "react";
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  FlatList,
  NativeBaseProvider,
  Center,
} from "native-base";
import { Image, Dimensions } from "react-native";

function Home() {
  const [masterPassword, setMasterPassword] = useState("");

  // Array of 10 image URLs
  const images = [
    "https://picsum.photos/200/300",
    "https://picsum.photos/200/300",
    "https://picsum.photos/200/300",
    "https://picsum.photos/200/300",
    "https://picsum.photos/200/300",
    "https://picsum.photos/200/300",
    "https://picsum.photos/200/300",
    "https://picsum.photos/200/300",
    "https://picsum.photos/200/300",
    "https://picsum.photos/200/300",
  ];

  // Function to shuffle the images array
  const getRandomImages = () => {
    return images.sort(() => 0.5 - Math.random());
  };

  // Get screen width for full-width image display
  const screenWidth = Dimensions.get("window").width;

  return (
    <Box flex={1} p={5} safeArea>
      <VStack space={4} alignItems="center">
        {/* Master Password Input */}
        <Input
          placeholder="Master Password"
          value={masterPassword}
          onChangeText={(text) => setMasterPassword(text)}
          type="password"
          width="90%"
          maxW="300px"
        />

        {/* Display Random Images */}
        <FlatList
          data={getRandomImages()}
          renderItem={({ item }) => (
            <Box mb={4}>
              <Image
                source={{ uri: item }}
                style={{ width: screenWidth }}
                alt="random image"
              />
            </Box>
          )}
          width="100%"
        />
      </VStack>
    </Box>
  );
}

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <Home />
      </Center>
    </NativeBaseProvider>
  );
};
