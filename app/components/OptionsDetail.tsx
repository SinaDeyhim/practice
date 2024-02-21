import React, { memo, useCallback, useMemo, useState } from "react";
import { Asset, Instrument } from "./OptionContainer";
import { DropDown } from "./DropDown";
import { Flex, MenuItem, Text } from "@chakra-ui/react";

function convertEpochToMonthDay(epochTimestamp: number): string {
  const date = new Date(epochTimestamp * 1000); // Convert seconds to milliseconds
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();

  return `${month} ${day}`;
}

interface OptionsDetailProps {
  selectedAsset: Asset;
  instruments: Instrument[];
  selectedInstrument: Instrument;
  onInsturmentChange: (instrument: Instrument) => void;
}

const OptionsDetail = ({
  selectedAsset,
  instruments,
  selectedInstrument,
  onInsturmentChange,
}: OptionsDetailProps) => {
  const [expiry, setExpiry] = useState(
    selectedInstrument.option_details.expiry
  );

  const priceDirection = useMemo(() => {
    return selectedInstrument.option_details.option_type === "C"
      ? " up"
      : " down";
  }, [selectedInstrument]);

  const optionsMap: Map<number, Instrument[]> = useMemo(() => {
    const options = new Map<number, Instrument[]>();

    instruments?.forEach((instrument) => {
      const expiry = instrument.option_details.expiry;
      const isLowerThanSpot =
        Number(selectedAsset.spot_price) <
        Number(instrument.option_details.strike);

      if (!options.has(expiry)) {
        options.set(expiry, []);
      }

      if (instrument.option_details.option_type === "C" && isLowerThanSpot) {
        options.get(expiry)?.push(instrument);
      }

      if (instrument.option_details.option_type === "P" && !isLowerThanSpot) {
        options.get(expiry)?.push(instrument);
      }
    });

    return options;
  }, [instruments, selectedAsset.currency]);

  const expiryOptions = useMemo(() => {
    const options = Array.from(optionsMap.keys()).sort();
    return options.map((expiry) => (
      <MenuItem key={expiry} onClick={() => setExpiry(expiry)}>
        {convertEpochToMonthDay(expiry)}
      </MenuItem>
    ));
  }, [optionsMap, selectedAsset.currency]);

  const strikeOptions = useMemo(() => {
    const instrumentsForExpiry = optionsMap.get(expiry) ?? [];

    const sortedInstruments = instrumentsForExpiry.sort((a, b) =>
      a.option_details.strike.localeCompare(b.option_details.strike)
    );

    return sortedInstruments.map((instrument) => (
      <MenuItem
        key={instrument.instrument_name}
        onClick={() => onInsturmentChange(instrument)}
      >
        {instrument.option_details.strike}
      </MenuItem>
    ));
  }, [expiry, optionsMap, selectedAsset.currency]);

  return (
    <Flex direction="column">
      <Flex alignItems="center" height="100%">
        <Text fontSize="md" marginRight="8px" align="center">
          I think {selectedAsset.currency} is going
          {priceDirection} to
        </Text>
        <DropDown
          items={strikeOptions}
          selectedItemLabel={selectedInstrument.option_details.strike}
        />
        <Text fontSize="md" margin="8px" align="center">
          by
        </Text>
        <DropDown
          items={expiryOptions}
          selectedItemLabel={convertEpochToMonthDay(expiry)}
        />
      </Flex>
    </Flex>
  );
};

export default memo(OptionsDetail);
