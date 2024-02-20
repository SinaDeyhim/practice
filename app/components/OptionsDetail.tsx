import React, { memo, useMemo } from "react";
import { Asset, Instrument } from "./OptionContainer";
import { DropDown } from "./DropDown";
import { Flex, Text } from "@chakra-ui/react";

function convertEpochToMonthDay(epochTimestamp: string): string {
  const date = new Date(Number(epochTimestamp) * 1000); // Convert seconds to milliseconds
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();

  return `${month} ${day}`;
}

interface OptionsDetailProps {
  selectedAsset: Asset;
  instruments: Instrument[];
  selectedInstrument: Instrument;
  onInsturmentChange: (instrumentName: string) => void;
}

const OptionsDetail = ({
  selectedAsset,
  instruments,
  selectedInstrument,
  onInsturmentChange,
}: OptionsDetailProps) => {
  const priceDirection = useMemo(() => {
    return selectedInstrument.option_details.option_type === "P"
      ? " up"
      : " down";
  }, [selectedInstrument]);

  return (
    <Flex direction="column">
      <Flex alignItems="center" height="100%">
        <Text fontSize="md" marginRight="8px" align="center">
          I think {selectedAsset.currency} is going
          {priceDirection} to
        </Text>
        <DropDown<Instrument>
          items={instruments}
          keyProp="option_details.strike"
          onSelect={onInsturmentChange}
          selectedItem={selectedInstrument}
        />
        <Text fontSize="md" margin="8px" align="center">
          by
        </Text>
        <DropDown<Instrument>
          items={instruments}
          keyProp="option_details.expiry"
          onSelect={onInsturmentChange}
          selectedItem={selectedInstrument}
          formatter={convertEpochToMonthDay}
        />
      </Flex>
    </Flex>
  );
};

export default memo(OptionsDetail);
