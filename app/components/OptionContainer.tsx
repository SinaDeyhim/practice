"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import OptionsDetail from "./OptionsDetail";
import { Flex, MenuButton, MenuItem, Text } from "@chakra-ui/react";
import { options, supported_assets } from "./payload";
import { DropDown } from "./DropDown";
import { getAllAssets, getInstruments } from "../utils/api-utils";
import { OptionLoading } from "./OptionLoading";

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
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>();
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState<
    Instrument | undefined
  >();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllAssets();
        const filteredAssets = data.result.filter(
          (asset: Asset) => asset.currency !== "USDC"
        );

        setAssets(filteredAssets);
        setSelectedAsset(filteredAssets[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchInstrumentData = async () => {
      try {
        if (selectedAsset) {
          const data = await getInstruments(selectedAsset.currency);
          setInstruments(data.result);
          setSelectedInstrument(data.result[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInstrumentData();
  }, [selectedAsset]);

  const handleAssetChange = useCallback(
    (asset: Asset) => () => {
      setSelectedAsset(asset);
    },
    []
  );

  const handleInstrumentChange = useCallback((instrument: Instrument) => {
    setSelectedInstrument(instrument);
  }, []);

  const assetOptions = useMemo(() => {
    return assets.map((asset) => (
      <MenuItem key={asset.currency} onClick={handleAssetChange(asset)}>
        {asset.currency}
      </MenuItem>
    ));
  }, [assets, handleAssetChange]);

  return (
    <>
      {selectedAsset ? (
        <Flex alignItems="center" height="100%">
          <DropDown
            items={assetOptions}
            selectedItemLabel={selectedAsset.currency}
          />
          <Text fontSize="md" marginStart="8px" align="center">
            is currently worth $
            {parseFloat(selectedAsset.spot_price).toFixed(2)}
          </Text>
        </Flex>
      ) : (
        <OptionLoading />
      )}

      {instruments.length && selectedAsset && selectedInstrument ? (
        <OptionsDetail
          selectedAsset={selectedAsset}
          instruments={instruments}
          selectedInstrument={selectedInstrument}
          onInsturmentChange={handleInstrumentChange}
        />
      ) : (
        <OptionLoading />
      )}
    </>
  );
};

export default OptionContainer;
