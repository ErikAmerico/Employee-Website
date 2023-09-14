import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  return (
    <UserContext.Provider value={{ triggerRefetch, setTriggerRefetch }}>
      {children}
    </UserContext.Provider>
  );
}
