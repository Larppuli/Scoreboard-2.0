"use client";
import React from "react";
import { AppShell, Container } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import BottomNavigation from "./BottomNavigation";
import Header from "./Header";
import DesktopNavigation from "./DesktopNavigation";
import { useAppContext } from "@/app/lib/AppContext";

function AppShellWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAppContext();
  const isAuthenticated = user !== null;

  const isMobile = useMediaQuery("(max-width: 900px)");

  const showMobileNav = isAuthenticated && isMobile;
  const showDesktopNav = isAuthenticated && !isMobile;

  return (
    <AppShell
      header={{ height: showMobileNav ? 55 : showDesktopNav ? 60 : 0 }}
      footer={{ height: showMobileNav ? 90 : 0 }}
      padding="md"
    >
      {showMobileNav && <Header />}
      {showDesktopNav && <DesktopNavigation />}
      <AppShell.Main bg="#080c0c">
      <Container
          style={{
            width: isMobile ? "100%" : "100%",
            maxWidth: isMobile ? "100%" : "900px",
          }}
        >
          {children}
        </Container>
      </AppShell.Main>
      {showMobileNav && <BottomNavigation />}
    </AppShell>
  );
}

export default AppShellWrapper;
