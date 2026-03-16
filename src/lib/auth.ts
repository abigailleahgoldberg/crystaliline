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
          scope: "identify guilds",
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

        // Check guild membership via user's token
        try {
          const guildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
            headers: { Authorization: `Bearer ${account.access_token}` },
          });
          if (guildsRes.ok) {
            const guilds = await guildsRes.json();
            const inGuild = guilds.some((g: { id: string }) => g.id === GUILD_ID);
            token.inGuild = inGuild;
          } else {
            token.inGuild = false;
          }
        } catch {
          token.inGuild = false;
        }

        // Fetch roles via Bot token (server-side, no special OAuth scope needed)
        if (token.inGuild && process.env.DISCORD_BOT_TOKEN) {
          try {
            const memberRes = await fetch(
              `https://discord.com/api/guilds/${GUILD_ID}/members/${token.discordId}`,
              {
                headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
              }
            );
            if (memberRes.ok) {
              const member = await memberRes.json();
              token.roles = member.roles || [];
            } else {
              token.roles = [];
            }
          } catch {
            token.roles = [];
          }
        } else {
          token.roles = [];
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
