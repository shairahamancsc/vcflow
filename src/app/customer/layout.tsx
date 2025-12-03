'use client';

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LayoutDashboard, PlusCircle } from "lucide-react";

const navItems = [
  { href: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/customer/new-request', label: 'New Request', icon: PlusCircle },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout navItems={navItems}>{children}</DashboardLayout>;
}
