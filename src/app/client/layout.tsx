import DashboardShell from "@/components/dashboard/DashboardShell";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="CLIENT">{children}</DashboardShell>;
}
