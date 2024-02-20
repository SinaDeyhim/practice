import { Text } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";

export default function Header() {
  return (
    <Flex direction="column">
      <Text fontSize="3xl" as="b">
        Hypertext
      </Text>
      <Text fontSize="md" marginBottom="24px">
        A text forward Lyra interface
      </Text>
    </Flex>
  );
}
