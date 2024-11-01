import React from "react";
import { Poppins } from "next/font/google";
import { Box } from "@mui/material";
import MainNavBar from "./MainNavBar";
import { signIn, useSession } from "next-auth/react";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"]
});

const LayoutWrapper = ({ children }) => {
    const { status } = useSession();

    if (status === "loading") {
        return (<div>Loading...</div>)
    } else if (status === "unauthenticated") {
        signIn("azure-ad");
    } else {
        return (
            <Box className={poppins.className} sx={{ 
                display: 'flex',
                backgroundColor: 'background.default',
                minHeight: '100vh'
            }}>
                <MainNavBar />
                <Box sx={{ 
                    flexGrow: 1, 
                    marginLeft: '8px',
                    padding: '24px',
                    backgroundColor: 'background.default'
                }}>
                    {children}
                </Box>
            </Box>
        )
    }
}

export default LayoutWrapper;