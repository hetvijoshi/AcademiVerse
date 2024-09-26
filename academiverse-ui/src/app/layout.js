"use client";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper/LayoutWrapper";
import Providers from "./lib/utility/Providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
