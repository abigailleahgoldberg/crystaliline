"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="auth-button-loading" />;
  }

  // Logged in: show avatar + name linking to dashboard
  if (session?.user) {
    const avatarUrl = session.user.discordId && session.user.avatar
      ? `https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.avatar}.png?size=64`
      : null;

    return (
      <Link href="/dashboard" className="auth-user-link">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="auth-avatar" />
        ) : (
          <span className="auth-avatar-fallback">
            {session.user.name?.[0] || "?"}
          </span>
        )}
        <span className="auth-username">{session.user.name}</span>
      </Link>
    );
  }

  // Not logged in: show "Login" that goes to dashboard (which has the login flow)
  return (
    <Link href="/dashboard" className="auth-login-link">
      Login
    </Link>
  );
}
