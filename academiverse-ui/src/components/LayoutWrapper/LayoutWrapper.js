import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import { Box } from "@mui/material";
import MainNavBar from "./MainNavBar";
import { signIn, useSession } from "next-auth/react";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "700", "500"]
})

const LayoutWrapper = ({ children }) => {
    const { status } = useSession();
    const [selectedItem, setSelectedItem] = useState('courses');
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    useEffect(() => {
        console.log("Selected Item:", selectedItem);
        console.log("Selected Course ID:", selectedCourseId);
    }, [selectedCourseId]);

    if (status === "loading") {
        return (<div>Loading...</div>)
    } else if (status === "unauthenticated") {
        signIn("azure-ad");
    } else {
        return (
            <Box className={poppins.className}>
                <MainNavBar setSelectedItem={setSelectedItem} />
                <Box sx={{ flexGrow: 1, marginLeft: '56px', marginTop: '-10px' }}>
                    {children}
                </Box>
            </Box>
        )
    }
}

export default LayoutWrapper