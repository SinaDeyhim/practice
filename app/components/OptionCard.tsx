import React from "react";
import { Asset, Instrument } from "./OptionContainer";
import { Card, CardBody, Text } from "@chakra-ui/react";
import { convertEpochToMonthDay } from "./OptionsDetail";

interface OptionCardProps {
  asset: Asset;
  instrument: Instrument;
}

export function OptionCard({ asset, instrument }: OptionCardProps) {
  const { option_details } = instrument;
  return (
    <Card width="240px" marginTop="24px">
      <CardBody>
        <Text as="b" fontSize="sm">
          Buy {asset.currency} ${option_details.strike}{" "}
          {option_details.option_type === "C" ? "Call" : "Put"}
        </Text>
        <Text fontSize="xs">
          Expires {convertEpochToMonthDay(option_details.expiry)}
        </Text>
      </CardBody>
    </Card>
  );
}
