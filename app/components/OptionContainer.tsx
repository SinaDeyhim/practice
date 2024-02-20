"use client";

import React, { useCallback, useEffect, useState } from "react";

import OptionsDetail from "./OptionsDetail";
import { Flex, Text } from "@chakra-ui/react";
import { options, supported_assets } from "./payload";
import { DropDown } from "./DropDown";

export interface Asset {
  currency: string;
  spot_price: string;
  spot_price_24h: string;
}

export interface OptionDetails {
  index: string;
  expiry: number;
  strike: string;
  option_type: string;
  settlement_price: null | number;
}

export interface Instrument {
  instrument_type: string;
  instrument_name: string;
  scheduled_activation: number;
  scheduled_deactivation: number;
  is_active: boolean;
  tick_size: string;
  minimum_amount: string;
  maximum_amount: string;
  amount_step: string;
  mark_price_fee_rate_cap: string;
  maker_fee_rate: string;
  taker_fee_rate: string;
  base_fee: string;
  base_currency: string;
  quote_currency: string;
  option_details: OptionDetails;
  perp_details: null;
  base_asset_address: string;
  base_asset_sub_id: string;
}

const OptionContainer = () => {
  const [assets, setAssets] = useState<Asset[]>(supported_assets);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(assets[0]);
  const [instruments, setInstruments] = useState<Instrument[]>(options);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(
    options[0]
  );

  const handleAssetChange = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
  }, []);

  const handleInstrumentChange = useCallback((instrumentName: string) => {
    const instrument = instruments.find(
      (ins) => ins.instrument_name === instrumentName
    );
    if (instrument) {
      setSelectedInstrument(instrument);
    }
  }, []);

  return (
    <>
      <Flex alignItems="center" height="100%">
        <DropDown<Asset, "currency">
          items={assets}
          keyProp="currency"
          onSelect={handleAssetChange}
          selectedItem={selectedAsset}
        />
        <Text fontSize="md" marginStart="8px" align="center">
          is currently worth ${parseFloat(selectedAsset.spot_price).toFixed(2)}
        </Text>
      </Flex>
      <OptionsDetail
        selectedAsset={selectedAsset}
        instruments={instruments}
        selectedInstrument={selectedInstrument}
        onInsturmentChange={handleInstrumentChange}
      />
    </>
  );
};

export default OptionContainer;
