import { Box, Heading, Center, NativeBaseProvider, Text } from "native-base";
import LogoutButton from "@/components/LogoutButton";

const AccountSheet = () => {
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
        <Text>Hello</Text>
        <LogoutButton />
      </Box>
    </Center>
  );
};

export default () => {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <AccountSheet />
      </Center>
    </NativeBaseProvider>
  );
};
