import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const GUILD_ID = "1384979421231976658";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      discordId?: string;
      avatar?: string;
      discriminator?: string;
      roles?: string[];
      inGuild?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordId?: string;
    avatar?: string;
    discriminator?: string;
    roles?: string[];
    inGuild?: boolean;
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify guilds guilds.members.read",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.discordId = (profile as { id: string }).id;
        token.avatar = (profile as { avatar: string }).avatar;
        token.discriminator = (profile as { discriminator: string }).discriminator;

        // Fetch guild member data to get roles
        try {
          const res = await fetch(
            `https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`,
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          );
          if (res.ok) {
            const member = await res.json();
            token.roles = member.roles || [];
            token.inGuild = true;
          } else {
            token.roles = [];
            token.inGuild = false;
          }
        } catch {
          token.roles = [];
          token.inGuild = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.discordId = token.discordId;
      session.user.avatar = token.avatar;
      session.user.discriminator = token.discriminator;
      session.user.roles = token.roles;
      session.user.inGuild = token.inGuild;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
