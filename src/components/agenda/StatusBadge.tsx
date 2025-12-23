import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppointmentStatus = Database["public"]["Enums"]["appointment_status"];

interface StatusBadgeProps {
  status: AppointmentStatus;
  size?: "sm" | "default";
}

const statusConfig: Record<AppointmentStatus, { label: string; icon: React.ElementType; className: string }> = {
  pending: {
    label: "Pendente",
    icon: Clock,
    className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  confirmed: {
    label: "Confirmado",
    icon: AlertCircle,
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  completed: {
    label: "Finalizado",
    icon: CheckCircle,
    className: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  cancelled: {
    label: "Cancelado",
    icon: XCircle,
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
};

export function StatusBadge({ status, size = "default" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} ${size === "sm" ? "text-xs px-1.5 py-0.5" : ""}`}>
      <Icon className={`mr-1 ${size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
      {config.label}
    </Badge>
  );
}

export function getNextStatus(currentStatus: AppointmentStatus): AppointmentStatus | null {
  switch (currentStatus) {
    case "pending":
      return "confirmed";
    case "confirmed":
      return "completed";
    default:
      return null;
  }
}

export function getStatusLabel(status: AppointmentStatus): string {
  return statusConfig[status].label;
}
