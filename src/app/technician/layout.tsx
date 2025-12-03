import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Wrench, LayoutDashboard } from "lucide-react";

const navItems = [
  { href: '/technician/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout navItems={navItems}>{children}</DashboardLayout>;
}
