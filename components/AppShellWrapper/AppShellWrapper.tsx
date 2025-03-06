"use client";
import React from "react";
import { AppShell } from "@mantine/core";
import BottomNavigation from "./BottomNavigation";
import Header from "./Header";
import { useAppContext } from "@/app/lib/AppContext";

function AppShellWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAppContext();
  const isAuthenticated = user !== null;

  return (
    <AppShell
      header={{ height: isAuthenticated ? 55 : 0 }}
      footer={{ height: isAuthenticated ? 90 : 0 }}
      padding="md"
    >
      {isAuthenticated && <Header />}
      <AppShell.Main bg="#080c0c">{children}</AppShell.Main>
      {isAuthenticated && <BottomNavigation />}
    </AppShell>
  );
}

export default AppShellWrapper;