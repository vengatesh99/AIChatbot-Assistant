// import {handlers} from "../../../../auth"
// export const {GET,POST} = handlers
// import GoogleProvider from "next-auth/providers/google";

import NextAuth from "next-auth";
import {authOptions} from "../../../../auth";


const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}