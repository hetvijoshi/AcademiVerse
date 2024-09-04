import React from "react";
import { Poppins } from "next/font/google";
import { signIn, signOut, useSession } from "next-auth/react";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "700", "500"]
})
const LayoutWrapper = ({ children }) => {

    const { status } = useSession();
    if (status == "loading") {
        return (<div>Loading...</div>)
    } else if (status == "unauthenticated") {
        signIn("azure-ad");
    }
    else {
        return (
            <main className={poppins.className}>
                {children}
                <button onClick={()=> {
                    signOut()
                }}>Logout</button>
            </main>
        )
    }
}

export default LayoutWrapper