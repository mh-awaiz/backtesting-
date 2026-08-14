"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import { FiMenu, FiCode } from "react-icons/fi";

export default function DashboardShell({
  role,
  children,
}: {
  role: "ADMIN" | "DEVELOPER" | "CLIENT";
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar role={role} open={open} onClose={() => setOpen(false)} />

      <div className="flex-1 min-w-0">
        <div className="lg:hidden h-16 border-b border-border flex items-center gap-3 px-5 sticky top-0 bg-bg/90 backdrop-blur z-30">
          <button onClick={() => setOpen(true)} className="text-text-dim">
            <FiMenu size={20} />
          </button>
          <Link href="/" className="flex items-center gap-2 font-display text-text">
            <FiCode className="text-violet-bright" />
            Pinex
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
