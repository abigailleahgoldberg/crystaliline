"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="auth-button-loading" />;
  }

  if (session?.user) {
    const avatarUrl = session.user.discordId && session.user.avatar
      ? `https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.avatar}.png?size=64`
      : null;

    return (
      <div className="auth-button-signed-in">
        <Link href="/dashboard" className="auth-user-link">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="auth-avatar"
            />
          ) : (
            <span className="auth-avatar-fallback">
              {session.user.name?.[0] || "?"}
            </span>
          )}
          <span className="auth-username">{session.user.name}</span>
        </Link>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("discord")} className="auth-login-link">
      Login
    </button>
  );
}
