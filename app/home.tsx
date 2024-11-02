import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { Buffer } from "buffer";
import { ThemedText } from "@/components/ThemedText";

interface DimensionsType {
  width: number;
  height: number;
}

const extractDimensions = (imageStr: string): Promise<DimensionsType> => {
  return new Promise((resolve, reject) => {
    const imageHelper = Image.getSize(
      imageStr,
      (width, height) => {
        resolve({ width, height });
      },
      (error) => reject(error)
    );
  });
};

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
  const getBase64Images = async () => {
    const res = [];
    for (let i = 0; i < images.length; i++) {
      const response = await axios.get(images[i], {
        responseType: "arraybuffer",
      });

      try {
        const imageStr =
          "data:image;base64," +
          Buffer.from(response.data, "binary").toString("base64");
        res.push({
          image: imageStr,
          dimensions: await extractDimensions(imageStr),
        });
      } catch (error) {
        console.log("error occured when processing image buffer", error);
      }
    }
    console.log("done processing images");

    setImageData(res);
  };

  const [imageData, setImageData] = useState<
    { image: string; dimensions: DimensionsType }[]
  >([]);

  useEffect(() => {
    getBase64Images();
  }, []);

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
        {imageData.length > 0 ? (
          <FlatList
            data={imageData}
            renderItem={({ item }) => (
              <Box mb={4}>
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: screenWidth,
                    height:
                      (item.dimensions.height / item.dimensions.width) *
                      screenWidth,
                  }}
                  alt="random image"
                />
              </Box>
            )}
            width="100%"
          />
        ) : (
          <ThemedText>waiting to decode image. please wait..</ThemedText>
        )}
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
