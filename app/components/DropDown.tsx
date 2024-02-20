import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React, { useCallback } from "react";

interface DropDownProps<T, K> {
  items: T[];
  keyProp: K;
  onSelect: (selectedItem: T) => void;
  selectedItem: T;
}

export function DropDown<T extends object, K extends keyof T>({
  items,
  keyProp,
  onSelect,
  selectedItem,
}: DropDownProps<T, K>) {
  const handleClick = useCallback(
    (item: T) => () => {
      onSelect(item);
    },
    [onSelect]
  );

  return (
    <Menu>
      <MenuButton as={Button}>{String(selectedItem[keyProp])}</MenuButton>
      <MenuList>
        {items.map((item) => (
          <MenuItem key={String(item[keyProp])} onClick={handleClick(item)}>
            {String(item[keyProp])}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
