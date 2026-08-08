import DashboardShell from "@/components/dashboard/DashboardShell";

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="DEVELOPER">{children}</DashboardShell>;
}
