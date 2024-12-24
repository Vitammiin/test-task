import {Providers} from "./providers";
import {Inter} from "next/font/google";

import {Tabs} from "../components/tabs";
import "./globals.css";
import React from "react";

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
        <body className={inter.className}>
        <Providers>
            <Tabs/>
            {children}
        </Providers>
        </body>
        </html>
    );
}
