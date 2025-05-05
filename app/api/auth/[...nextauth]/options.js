import dayjs from "dayjs";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await fetch(`${process.env.API_BASE_URL}/iam/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          }).then((res) => res.json());

          if (user) {
            return user;
          }
        } catch (error) {
          // console.log(error);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If user just signed in, set the expiration time
      if (user) {
        token.user = user.data;
        token.accessToken = user.access_token;
        token.refreshToken = user.refresh_token;
        token.accessTokenExpires = dayjs().add(15, "minute").toDate().getTime();
      }

      // If the token hasn't expired yet, just return it
      if (dayjs().isBefore(dayjs(token.accessTokenExpires))) {
        return token;
      }

      // If the token expired, refresh it
      return await refreshAccessToken(token);
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
  pages: {
    signIn: "/login",
  },
};

async function refreshAccessToken(token) {
  try {
    const refreshedTokens = await fetch(
      `${process.env.API_BASE_URL}/iam/refresh`,
      {
        method: "POST",
        body: JSON.stringify({ refresh_token: token.refreshToken }),
        headers: { "Content-Type": "application/json" },
      }
    ).then((res) => res.json());

    if (!refreshedTokens.error) {
      return {
        ...token,
        accessToken: refreshedTokens.access_token,
        refreshToken: refreshedTokens.refresh_token,
        accessTokenExpires: dayjs().add(1, "day").toDate().getTime(),
      };
    }

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  } catch (error) {
    console.error("Error refreshing access token: ", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default authOptions;
