import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const hasSecret = !!process.env.DISCORD_CLIENT_SECRET;
  const hasBot = !!process.env.DISCORD_BOT_TOKEN;
  const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const vercelUrl = process.env.VERCEL_URL;

  return NextResponse.json({
    clientId: clientId ? `${clientId.slice(0, 6)}...` : "MISSING",
    hasSecret,
    hasBot,
    hasNextAuthSecret,
    nextAuthUrl: nextAuthUrl || "NOT SET",
    vercelUrl: vercelUrl || "NOT SET",
  });
}
