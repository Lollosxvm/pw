import { createContext, useContext, useState } from "react";

const AssetContext = createContext();

export const useAsset = () => useContext(AssetContext);

export const AssetProvider = ({ children }) => {
  const [selectedAsset, setSelectedAsset] = useState("bitcoin");
  const [currentPrice, setCurrentPrice] = useState(null);

  return (
    <AssetContext.Provider
      value={{ selectedAsset, setSelectedAsset, currentPrice, setCurrentPrice }}
    >
      {children}
    </AssetContext.Provider>
  );
};
