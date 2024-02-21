import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React, { useCallback } from "react";

interface DropDownProps {
  items: React.ReactNode[];
  selectedItemLabel: string;
}

export function DropDown({ items, selectedItemLabel }: DropDownProps) {
  return (
    <Menu>
      <MenuButton as={Button}>{selectedItemLabel}</MenuButton>
      <MenuList>{items}</MenuList>
    </Menu>
  );
}
