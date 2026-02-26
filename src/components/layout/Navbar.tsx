"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createSupabaseBrowser } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(10,10,10,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,169,110,0.12)" : "1px solid transparent",
      }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #C9A96E, #8B6635)", color: "#0A0A0A" }}>
            F
          </div>
          <span className="font-display text-xl" style={{ fontWeight: 500, color: "#E8E0D5", letterSpacing: "0.05em" }}>
            FitYourCV
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {[["Tính năng", "#features"], ["Bảng giá", "/pricing"], ["Blog", "#"]].map(([label, href]) => (
            <Link key={label} href={href}
              className="text-xs tracking-[0.2em] uppercase transition-colors duration-300"
              style={{ color: "rgba(232,224,213,0.45)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#C9A96E")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(232,224,213,0.45)")}>
              {label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard"
                className="text-xs tracking-[0.2em] uppercase transition-colors duration-300"
                style={{ color: "rgba(232,224,213,0.5)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A96E")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(232,224,213,0.5)")}>
                Dashboard
              </Link>
              <div className="flex items-center gap-2">
                {user.user_metadata?.avatar_url ? (
                  <Image src={user.user_metadata.avatar_url} alt="avatar"
                    width={32} height={32} className="rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ background: "linear-gradient(135deg, #C9A96E, #8B6635)", color: "#0A0A0A" }}>
                    {(user.user_metadata?.full_name ?? user.email ?? "U")[0].toUpperCase()}
                  </div>
                )}
                <button onClick={handleSignOut}
                  className="text-xs tracking-widest uppercase transition-colors duration-300"
                  style={{ color: "rgba(232,224,213,0.3)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#C9A96E")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(232,224,213,0.3)")}>
                  Đăng xuất
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth"
                className="text-xs tracking-[0.2em] uppercase transition-colors duration-300"
                style={{ color: "rgba(232,224,213,0.5)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E8E0D5")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(232,224,213,0.5)")}>
                Đăng nhập
              </Link>
              <Link href="/analyze" className="btn-gold" style={{ padding: "0.6rem 1.5rem" }}>
                <span>Bắt đầu miễn phí</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden p-2 flex flex-col gap-1.5" onClick={() => setMenuOpen(!menuOpen)}>
          {[0, 1, 2].map(i => (
            <span key={i} className="block h-px transition-all duration-300"
              style={{
                width: i === 1 ? (menuOpen ? "24px" : "16px") : "24px",
                background: "#C9A96E",
                transform: menuOpen && i === 0 ? "rotate(45deg) translateY(6px)" :
                            menuOpen && i === 2 ? "rotate(-45deg) translateY(-6px)" : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4"
          style={{ background: "rgba(10,10,10,0.98)", borderTop: "1px solid rgba(201,169,110,0.1)" }}>
          {[["Tính năng", "#features"], ["Bảng giá", "/pricing"]].map(([label, href]) => (
            <Link key={label} href={href} className="text-sm tracking-widest uppercase py-2"
              style={{ color: "rgba(232,224,213,0.5)" }} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm tracking-widest uppercase py-2"
                style={{ color: "rgba(232,224,213,0.5)" }} onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <button onClick={handleSignOut} className="text-sm tracking-widest uppercase py-2 text-left"
                style={{ color: "rgba(232,224,213,0.3)" }}>
                Đăng xuất
              </button>
            </>
          ) : (
            <Link href="/auth" className="btn-gold mt-2" onClick={() => setMenuOpen(false)}>
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
