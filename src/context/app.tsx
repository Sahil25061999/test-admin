'use client'
import { createContext, type Dispatch, type SetStateAction, useContext, useState } from "react";

export type AppContextType = {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  sidebarTitle: string | null;
  setSidebarTitle: Dispatch<SetStateAction<string | null>>;
  sidebarContent: React.ReactNode | null;
  setSidebarContent: Dispatch<SetStateAction<React.ReactNode | null>>;
}

const AppContext = createContext<AppContextType | null>(null);


const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTitle, setSidebarTitle] = useState<string | null>(null)
  const [sidebarContent, setSidebarContent] = useState<React.ReactNode | null>(null)


  return (
    <AppContext.Provider value={{ sidebarOpen, setSidebarOpen, sidebarTitle, setSidebarTitle, sidebarContent, setSidebarContent }}>
      {children}
    </AppContext.Provider>
  );
}


export default AppContextProvider;


export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};