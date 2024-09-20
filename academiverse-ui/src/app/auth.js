import NextAuth from "next-auth";
import jwt from "jsonwebtoken"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

export const {auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        MicrosoftEntraID({
            clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
            tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
        }),
    ],
    callbacks: {
        async signIn({ user, profile, account }) {
            
            if (user && account) {
                return true;
            }
            else {
                return false
            }
        },
        async jwt({ token, account }) {
            //console.log(token,account)
            if (account) {
                const user = jwt.decode(account.id_token);
                token.id_token = account.id_token;
                token.access_token = account.access_token;
                // token.name = user.name;
                // token.email = user.family_name;
            }

            return token;
        },
        async session({ session, token }) {
            //const userDetails = await fetchUser(session.user["email"], token.id_token);
            // session["id_token"] = token.id_token;
            // session["access_token"] = token.access_token;
            // session.user["firstName"] = token.firstName;
            // session.user["lastName"] = token.lastName;
            //session.user["userId"] = userDetails.data.data._id
            return session;
        },
    },
})