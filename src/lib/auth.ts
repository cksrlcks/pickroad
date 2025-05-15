import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "login",
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "kakao",
          clientId: process.env.KAKAO_CLIENT_ID!,
          clientSecret: process.env.KAKAO_CLIENT_SECRET!,
          authorizationUrl: "https://kauth.kakao.com/oauth/authorize",
          tokenUrl: "https://kauth.kakao.com/oauth/token",
          scopes: ["account_email,profile_image,profile_image"],
          userInfoUrl: "https://kapi.kakao.com/v2/user/me",
          prompt: "login",
          mapProfileToUser: async (profile) => {
            return {
              ...profile,
              email: profile.kakao_account.email,
              emailVerified: profile.kakao_account.is_email_verified,
              name: profile.kakao_account.profile.nickname,
              image: profile.kakao_account.profile.profile_image_url,
            };
          },
        },
      ],
    }),
  ],
});
