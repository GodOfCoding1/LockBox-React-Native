// Home.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, Text, Image, Alert, Dimensions } from "react-native";
import {
  Box,
  Button,
  Input,
  Stack,
  VStack,
  Skeleton,
  useToast,
  NativeBaseProvider,
  Center,
} from "native-base";
import { Buffer } from "buffer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "expo-router";
import { getValueFromLocal } from "@/utlis/secure-store";
import { deleteImage, getImageIds } from "@/api/api";
interface DimensionsType {
  width: number;
  height: number;
}

const extractDimensions = (imageStr: string): Promise<DimensionsType> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      imageStr,
      (width, height) => {
        resolve({ width, height });
      },
      (error) => reject(error)
    );
  });
};

const Decode: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [cardData, setCardData] = useState<{
    [key: string]: {
      buffer: string;
      type: string;
      dimensions: DimensionsType | undefined;
    };
  }>({});
  const toast = useToast();
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

  const fetchIDs = async () => {
    try {
      const res = await getImageIds();
      if (!res.data.success) {
        return Alert.alert(
          "Error",
          "An error occurred while fetching image IDs."
        );
      }
      setImageIds(res.data.data.ids);
    } catch (error: any) {
      toast.show({
        description: `${error.message}: ${error?.response?.data?.message}`,
        colorScheme: "error",
      });
    }
  };

  const onDelete = async (id: string) => {
    Alert.alert("Confirm", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteImage(id);
            setImageIds((prev) => prev.filter((i) => i !== id));
          } catch (error: any) {
            toast.show({
              description: `${error.message}: ${error?.response?.data?.message}`,
              colorScheme: "error",
            });
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchIDs();
  }, []);

  const connectSocket = () => {
    const token = getValueFromLocal("token"); // Retrieve token from local storage or secure storage
    if (!token) router.push("/login");

    const client = new WebSocket(
      `wss://lockbox.onrender.com/websocket?token=${token}`
    );

    client.onopen = () => {
      client.send(JSON.stringify({ event: "DECODE_IMAGES", password }));
    };

    client.onmessage = async (message) => {
      const data = JSON.parse(message.data);
      if (data.event === "DECODE_STARTED") {
        toast.show({ description: data.data.message, colorScheme: "info" });
      }
      if (data.event === "DECODE_IMAGES") {
        const imageStr =
          "data:image;base64," +
          Buffer.from(data.data.buffer).toString("base64");
        const dimension = await extractDimensions(imageStr);
        setCardData((prev) => ({
          ...prev,
          [data.data.id]: {
            buffer: imageStr,
            type: "image",
            dimensions: dimension,
          },
        }));
      }
      if (data.event === "ERROR") {
        toast.show({ description: data.message, colorScheme: "error" });
      }
    };

    client.onerror = (ev) => {
      Alert.alert("Connection Error", "An error occurred.");
      console.error("Connection Error", ev);
    };
  };

  return (
    <ScrollView>
      <Box safeAreaTop width={"full"} padding={0}>
        <VStack minWidth="100%" space={3} padding={5}>
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChangeText={setPassword}
          />
          <Button onPress={connectSocket}>Connect</Button>
        </VStack>

        {/* Image grid */}
        <Box>
          {imageIds.length > 0 ? (
            <VStack space={4}>
              {imageIds.map((id) => (
                <Box padding={0} key={id} shadow={2} flex={1}>
                  {cardData[id] ? (
                    <Image
                      source={{
                        uri: cardData[id].buffer,
                      }}
                      style={{
                        width: "100%",
                        height: cardData[id].dimensions
                          ? (cardData[id].dimensions.height /
                              cardData[id].dimensions.width) *
                            (screenWidth - 10) //TODO:fix the -10 and find a way to fill the screen
                          : 200,
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Skeleton.Text lines={6} />
                  )}
                  <Stack direction="row" justifyContent="space-between" mt={2}>
                    <Button
                      colorScheme="warning"
                      size="sm"
                      variant="subtle"
                      onPress={() => onDelete(id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text style={{ textAlign: "center", padding: 20 }}>
              Start Uploading Data, and it will show up here
            </Text>
          )}
        </Box>
      </Box>
    </ScrollView>
  );
};

export default () => {
  return (
    <ProtectedRoute>
      <NativeBaseProvider>
        <Center flex={1} px="3">
          <Decode />
        </Center>
      </NativeBaseProvider>
    </ProtectedRoute>
  );
};
