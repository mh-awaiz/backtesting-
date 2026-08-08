"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FiGrid, FiInbox, FiFolder, FiUsers, FiUserCheck, FiTrendingUp,
  FiMessageSquare, FiLogOut, FiX, FiCode, FiUserPlus,
} from "react-icons/fi";

type NavItem = { href: string; label: string; icon: React.ReactNode };

const navByRole: Record<string, NavItem[]> = {
  ADMIN: [
    { href: "/admin/dashboard", label: "Dashboard", icon: <FiGrid /> },
    { href: "/admin/leads", label: "Leads", icon: <FiUserPlus /> },
    { href: "/admin/inquiries", label: "Inquiries", icon: <FiInbox /> },
    { href: "/admin/projects", label: "Projects", icon: <FiFolder /> },
    { href: "/admin/developers", label: "Developers", icon: <FiUserCheck /> },
    { href: "/admin/clients", label: "Clients", icon: <FiUsers /> },
    { href: "/admin/indicators", label: "Indicators", icon: <FiTrendingUp /> },
    { href: "/admin/messages", label: "Moderation log", icon: <FiMessageSquare /> },
  ],
  DEVELOPER: [
    { href: "/developer/dashboard", label: "Dashboard", icon: <FiGrid /> },
    { href: "/developer/projects", label: "My projects", icon: <FiFolder /> },
  ],
  CLIENT: [
    { href: "/client/dashboard", label: "Dashboard", icon: <FiGrid /> },
    { href: "/client/projects", label: "My projects", icon: <FiFolder /> },
  ],
};

export default function Sidebar({
  role,
  open,
  onClose,
}: {
  role: "ADMIN" | "DEVELOPER" | "CLIENT";
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const items = navByRole[role] ?? [];

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-bg-2 border-r border-border flex flex-col z-50 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
          <Link href="/" className="flex items-center gap-2 font-display text-lg text-text">
            <FiCode className="text-violet-bright" />
            Northbeam
          </Link>
          <button onClick={onClose} className="lg:hidden text-text-dim">
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto thin-scroll">
          {items.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-violet/15 text-violet-bright"
                    : "text-text-dim hover:text-text hover:bg-bg-3"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-dim hover:text-red hover:bg-red/10 transition-colors w-full"
          >
            <FiLogOut />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
