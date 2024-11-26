import Navbar from "@/frontend/components/Navbar";
import { UserProvider } from "@/frontend/contexts/UserContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState } from "react";
import { NotificationProvider } from "@/frontend/contexts/NotificationContext";

export default function App({ Component, pageProps }: AppProps) {
    const [navbarHeight, setNavbarHeight] = useState(0);

    return (
        <NextThemesProvider attribute="class" defaultTheme="light">
            <UserProvider>
                <NotificationProvider>
                    <Navbar
                        onHeightChange={(height) => setNavbarHeight(height)}
                    />
                    <div style={{ height: `calc(100vh - ${navbarHeight}px)` }}>
                        <Component {...pageProps} />
                    </div>
                </NotificationProvider>
            </UserProvider>
        </NextThemesProvider>
    );
}
