import useUserStore from "@/helpers/hooks/store/use-user-store";
import dayjs from "dayjs";
import CredentialsProvider from "next-auth/providers/credentials";

const REFRESH_TOKEN_ERROR = "RefreshAccessTokenError";
const TOKEN_EXPIRY_MINUTES = 60;

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/be/iam/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
              }),
            }
          );

          if (!res.ok) {
            throw new Error("Invalid credentials");
          }

          const user = await res.json();
          return user;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          user: user.data,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: dayjs()
            .add(TOKEN_EXPIRY_MINUTES, "minute")
            .valueOf(),
        };
      }

      if (dayjs().isBefore(token.accessTokenExpires)) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.user = token.user;

      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
};

async function refreshAccessToken(token) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/be/iam/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: token.refreshToken }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const refreshedTokens = await response.json();

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken,
      accessTokenExpires: dayjs().add(TOKEN_EXPIRY_MINUTES, "minute").valueOf(),
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return { ...token, error: REFRESH_TOKEN_ERROR };
  }
}

export default authOptions;
