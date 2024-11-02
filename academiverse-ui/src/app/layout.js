"use client";
import "./globals.css";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './lib/theme';
import LayoutWrapper from "../components/LayoutWrapper/LayoutWrapper";
import Providers from "./lib/utility/Providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeProvider theme={theme}>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
