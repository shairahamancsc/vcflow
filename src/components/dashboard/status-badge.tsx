'use client';

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ServiceRequest } from "@/lib/data";

type Status = ServiceRequest['status'];

const statusStyles: Record<Status, string> = {
  "Request Received": "bg-blue-100 text-blue-800 border-blue-300",
  "Technician Assigned": "bg-cyan-100 text-cyan-800 border-cyan-300",
  "Picked Up": "bg-purple-100 text-purple-800 border-purple-300",
  "In Repair": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Ready to Deliver": "bg-green-100 text-green-800 border-green-300",
  "Delivered": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "Case Closed": "bg-gray-100 text-gray-800 border-gray-300",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", statusStyles[status])}
    >
      {status}
    </Badge>
  );
}