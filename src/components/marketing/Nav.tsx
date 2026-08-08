"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiCode } from "react-icons/fi";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/indicators", label: "Indicators" },
  { href: "/#process", label: "Process" },
  { href: "/#faq", label: "FAQ" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-bg/90 backdrop-blur border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg text-text">
          <FiCode className="text-violet-bright" />
          Northbeam
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="font-mono text-sm text-text-dim hover:text-text transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="font-mono text-sm text-text-dim hover:text-text transition-colors">
            Log in
          </Link>
          <Link
            href="/#contact"
            className="font-mono text-sm px-4 py-2 bg-violet text-white hover:bg-violet-bright transition-colors rounded-lg"
          >
            Start your project
          </Link>
        </div>

        <button className="md:hidden text-text text-2xl" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-bg-2 border-t border-b border-border px-5 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-mono text-sm text-text-dim hover:text-text">
              {l.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="font-mono text-sm text-text-dim hover:text-text">
            Log in
          </Link>
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="font-mono text-sm px-4 py-2 bg-violet text-white text-center rounded-lg"
          >
            Start your project
          </Link>
        </div>
      )}
    </header>
  );
}
