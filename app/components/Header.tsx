import { Box, Text } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box borderBottom="1px" borderColor="#CBD5E0" marginBottom="12px">
      <Flex direction="column">
        <Text fontSize="3xl" as="b">
          Hypertext
        </Text>
        <Text fontSize="md" marginBottom="24px">
          A text forward Lyra interface
        </Text>
      </Flex>
    </Box>
  );
}
