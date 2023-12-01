import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import { snsLogin } from "./oauth";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_OAUTH_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_PW as string,
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_OAUTH_CLIENT_ID as string,
            clientSecret: process.env.KAKAO_OAUTH_CLIENT_PW as string,
        }),
    ],
    // callbacks: {
    //     async signIn({ user }: { user: any }) {
    //         try {
    //             const snsUser = await snsLogin(user);

    //             return true;
    //         } catch (err) {
    //             return false;
    //         }
    //     },
    // }
}
  
export default NextAuth(authOptions);