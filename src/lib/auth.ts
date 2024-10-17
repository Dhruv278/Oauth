import SlackProvider from "next-auth/providers/slack";
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
export const authConfig: NextAuthOptions = {
    providers: [
        GithubProvider({
          clientId: process.env.GITHUB_CLIENT_ID || "",
          clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
          // Specify scopes here (repo for repo access, issues for creating issues)
          authorization: {
            params: {
              scope: "repo user", // request repo and user scope
            },
          },
        })
      ],
      callbacks: {
        async jwt({ token, account }) {
          if (account) {
            token.accessToken = account.access_token;
          }
          return token;
        },
        async session({ session, token }:{session:any,token:any}) {
          session.accessToken = token.accessToken; // Add accessToken to session
          return session;
        },
      },
  };
  

  export const verifyJWT=()=>{}