import { Global } from "@emotion/react";
import React, { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export function useGlobalContext() {
  return useContext(GlobalContext);
}

export function GlobalProvider({ children }) {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  return (
    <GlobalContext.Provider value={{ hasUnreadMessages, setHasUnreadMessages, triggerRefetch, setTriggerRefetch }}>
      {children}
    </GlobalContext.Provider>
  );
}
