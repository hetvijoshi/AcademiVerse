import NextAuth from "next-auth";
import jwt from "jsonwebtoken"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { fetchUserByEmail, postUserDetails } from "../app/services/userService";

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        MicrosoftEntraID({
            clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
            tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
        }),
    ],
    callbacks: {
        async signIn({ user, profile, account }) {
            console.log(account)
            if (user && account) {
                return true;
                let existingUser = await fetchUserByEmail(user.email, account.id_token)
                console.log(existingUser)
                if (existingUser.data == null) {
                    const tokenParams = jwt.decode(account.id_token);
                    const userData = {}
                    userData["name"] = tokenParams?.name
                    userData["userEmail"] = tokenParams?.email
                    let deptDeg = tokenParams?.roles[0]
                    userData["role"] = deptDeg.split(";")[0]
                    userData["departmentCode"] = deptDeg.split(";")[1]
                    userData["createdBy"] = -1
                    userData["updatedBy"] = -1
                    existingUser = await postUserDetails(userData,account.id_token);
                    return !existingUser.isError;
                }else{
                    return true;
                }
            }
            else {
                return false
            }
        },
        async jwt({ token, account }) {
            if (account) {
                token.id_token = account.id_token;
                token.access_token = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            session["id_token"] = token.id_token;
            session["access_token"] = token.access_token;
            session["userDetails"] = {role: "student"};
            if(session["userDetails"] == null){
                const userDetails = await fetchUserByEmail(session.user["email"], token.id_token);
                session["userDetails"] = userDetails.data;    
            }
            return session;
        },
    },
})