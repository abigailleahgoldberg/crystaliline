import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 mt-20 relative z-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-lg font-bold gradient-text">Crystaliline</span>
            <p className="text-sm text-white/40 mt-1">
              The Modern Modding Tool for OG Fortnite
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link href="/" className="hover:text-orange-light transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-orange-light transition-colors">
              About
            </Link>
            <Link href="/community" className="hover:text-orange-light transition-colors">
              Community
            </Link>
            <a
              href="https://github.com/skids-zj71"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-light transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-white/20">
          &copy; {new Date().getFullYear()} Crystaliline. Built by ZJ.
        </div>
      </div>
    </footer>
  );
}
