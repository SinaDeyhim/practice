"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import OptionsDetail from "./OptionsDetail";
import { Box, Flex, MenuItem, Text } from "@chakra-ui/react";
import { DropDown } from "./DropDown";
import { getAllAssets, getInstruments } from "../utils/api-utils";
import { OptionLoading } from "./OptionLoading";
import { OptionCard } from "./OptionCard";

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
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>();
  const [instrumentsMap, setInstrumentsMap] = useState<
    Record<string, Instrument[]>
  >({});
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
        console.error("Error fetching assets:", error);
      } finally {
        setIsLoadingAssets(false);
      }
    };

    fetchData();

    const poll = setInterval(() => {
      fetchData();
    }, 10000);

    return () => {
      clearTimeout(poll);
    };
  }, []);

  useEffect(() => {
    const fetchInstrumentData = async () => {
      if (!selectedAsset) return;

      if (instrumentsMap[selectedAsset.currency]) {
        // Use cached data if available
        setIsLoadingAssets(false);
        setSelectedInstrument(instrumentsMap[selectedAsset.currency][0]);
        return;
      }

      setIsLoadingAssets(true);

      try {
        const data = await getInstruments(selectedAsset.currency);
        setInstrumentsMap((prevMap) => ({
          ...prevMap,
          [selectedAsset.currency]: data.result,
        }));
        setSelectedInstrument(data.result[0]);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      } finally {
        setIsLoadingAssets(false);
      }
    };

    fetchInstrumentData();
  }, [selectedAsset, instrumentsMap]);

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
      {isLoadingAssets ? (
        <div>Loading assets...</div>
      ) : (
        selectedAsset && (
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
        )
      )}

      {!isLoadingAssets && selectedInstrument && selectedAsset ? (
        <>
          <OptionsDetail
            selectedAsset={selectedAsset}
            instruments={instrumentsMap[selectedAsset?.currency || ""] || []}
            selectedInstrument={selectedInstrument}
            onInsturmentChange={handleInstrumentChange}
          />
          <Box borderTop="1px" borderColor="#CBD5E0" marginTop="12px">
            <OptionCard asset={selectedAsset} instrument={selectedInstrument} />
          </Box>
        </>
      ) : (
        <OptionLoading />
      )}
    </>
  );
};

export default OptionContainer;
