import { ScrollView } from "react-native";
import { Box, NativeBaseProvider, Center } from "native-base";
import ProtectedRoute from "@/components/ProtectedRoute";

import React, { useState } from "react";
import {
  VStack,
  FormControl,
  Input,
  Button,
  Select,
  CheckIcon,
  Text,
  Icon,
} from "native-base";
import * as DocumentPicker from "expo-document-picker";
import { MaterialIcons } from "@expo/vector-icons";

const InfoUploader: React.FC = () => {
  const [fileType, setFileType] = useState<string>(""); // Selected file type
  const [fileName, setFileName] = useState<string>(""); // Uploaded file name

  const handleFileTypeChange = (value: string) => {
    setFileType(value);
    setFileName(""); // Reset file name when file type changes
  };

  const handleFileUpload = async () => {
    if (!fileType) {
      alert("Please select a file type first!");
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({
      type:
        fileType === "Text"
          ? "text/*"
          : fileType === "Video"
          ? "video/*"
          : fileType === "Image"
          ? "image/*"
          : "*/*",
    });

    if (result.canceled) {
      alert("File upload canceled.");
    } else {
      setFileName(result.assets[0].name);
    }
  };

  return (
    <ScrollView>
      <Box
        safeAreaTop
        width={"full"}
        padding={0}
        flex={1}
        p={4}
        justifyContent="center"
        alignItems="center"
      >
        <VStack space={4} width="100%" maxWidth="400px">
          {/* File Type Dropdown */}
          <FormControl isRequired>
            <FormControl.Label>Select File Type</FormControl.Label>
            <Select
              selectedValue={fileType}
              minWidth="200"
              placeholder="Choose File Type"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              onValueChange={(value) => handleFileTypeChange(value)}
            >
              <Select.Item label="Text" value="Text" />
              <Select.Item label="Video" value="Video" />
              <Select.Item label="Image" value="Image" />
            </Select>
          </FormControl>

          {/* Upload Button */}
          <FormControl>
            <FormControl.Label>Upload File</FormControl.Label>
            <Button
              leftIcon={
                <Icon as={<MaterialIcons name="file-upload" />} size="sm" />
              }
              onPress={handleFileUpload}
              isDisabled={!fileType} // Disable if no file type selected
            >
              Upload {fileType || "File"}
            </Button>
          </FormControl>

          {/* Uploaded File Info */}
          {fileName ? (
            <Text mt={2} fontSize="md" color="gray.700">
              Uploaded File: {fileName}
            </Text>
          ) : null}
        </VStack>
      </Box>
    </ScrollView>
  );
};

export default () => {
  return (
    <ProtectedRoute>
      <NativeBaseProvider>
        <Center flex={1} px="3">
          <InfoUploader />
        </Center>
      </NativeBaseProvider>
    </ProtectedRoute>
  );
};
