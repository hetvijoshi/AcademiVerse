"use client";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper/LayoutWrapper";
import Providers from "./lib/utility/Providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* <main className={poppins.className}>
            <Navbar />
            {children}
          </main> */}
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
