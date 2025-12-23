import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Appointment } from "@/hooks/useAppointments";

interface CalendarEventProps {
  appointment: Appointment;
  onClick: () => void;
  compact?: boolean;
}

export function CalendarEvent({ appointment, onClick, compact = false }: CalendarEventProps) {
  const barberColor = appointment.barber?.calendar_color || "#FF6B00";
  const startTime = format(new Date(appointment.start_time), "HH:mm");
  const endTime = format(new Date(appointment.end_time), "HH:mm");

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left px-1.5 py-0.5 rounded text-xs truncate transition-all hover:opacity-80"
        style={{
          backgroundColor: `${barberColor}20`,
          borderLeft: `3px solid ${barberColor}`,
        }}
      >
        <span className="font-medium">{startTime}</span> {appointment.client_name}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-2 rounded-md transition-all hover:scale-[1.02] hover:shadow-lg group"
      style={{
        backgroundColor: `${barberColor}15`,
        borderLeft: `4px solid ${barberColor}`,
      }}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-xs font-semibold text-foreground">
          {startTime} - {endTime}
        </span>
      </div>
      <p className="text-sm font-medium text-foreground truncate mt-0.5">
        {appointment.client_name}
      </p>
      {appointment.service && (
        <p className="text-xs text-muted-foreground truncate">
          {appointment.service.name}
        </p>
      )}
      {appointment.barber && (
        <p className="text-xs text-muted-foreground/70 truncate">
          {appointment.barber.name}
        </p>
      )}
    </button>
  );
}
