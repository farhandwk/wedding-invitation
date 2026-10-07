"use client";

import React, { createContext, useContext, useState } from "react";

// Buat Context
const EnvelopeContext = createContext({
  isOpened: false,
  setIsOpened: (value: boolean) => {},
});

// Custom hook untuk memudahkan pemanggilan
export const useEnvelope = () => useContext(EnvelopeContext);

// Provider komponen
export const EnvelopeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <EnvelopeContext.Provider value={{ isOpened, setIsOpened }}>
      {children}
    </EnvelopeContext.Provider>
  );
};