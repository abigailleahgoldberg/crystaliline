"use client";

export default function ChatView() {
  return (
    <main className="dashboard-main view-chat-main">
      <div className="view-header">
        <h2 className="view-title">Community Chat</h2>
        <p className="view-subtitle">Chat with the Crystaliline community on Discord</p>
      </div>
      <div className="view-chat-embed">
        <iframe
          src="https://discord.com/widget?id=1384979421231976658&theme=dark"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          title="Crystaliline Discord"
        />
      </div>
    </main>
  );
}
