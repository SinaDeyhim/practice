import { Stack, StackDivider } from "@chakra-ui/react";
import Header from "./components/Header";
import { Container } from "@chakra-ui/react";
import OptionContainer from "./components/OptionContainer";

export default function Home() {
  return (
    <Container>
      <Header />
      <OptionContainer />
    </Container>
  );
}
