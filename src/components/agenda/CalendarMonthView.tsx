import { useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarEvent } from "./CalendarEvent";
import type { Appointment } from "@/hooks/useAppointments";

interface CalendarMonthViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onDayClick: (date: Date) => void;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function CalendarMonthView({ currentDate, appointments, onAppointmentClick, onDayClick }: CalendarMonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { locale: ptBR });
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const appointmentsByDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    
    appointments.forEach(apt => {
      const dayKey = format(new Date(apt.start_time), "yyyy-MM-dd");
      if (!map[dayKey]) map[dayKey] = [];
      map[dayKey].push(apt);
    });

    // Sort appointments by start time
    Object.keys(map).forEach(key => {
      map[key].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    });

    return map;
  }, [appointments]);

  return (
    <div className="flex-1 overflow-auto p-4">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const dayKey = format(day, "yyyy-MM-dd");
          const dayAppointments = appointmentsByDay[dayKey] || [];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] border border-border rounded-lg p-1 cursor-pointer transition-colors hover:bg-muted/30 ${
                !isCurrentMonth ? "opacity-40 bg-muted/10" : "bg-card"
              } ${isCurrentDay ? "ring-2 ring-primary" : ""}`}
              onClick={() => onDayClick(day)}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                    isCurrentDay ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  {format(day, "d")}
                </span>
                {dayAppointments.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{dayAppointments.length - 3}
                  </span>
                )}
              </div>
              <div className="space-y-0.5">
                {dayAppointments.slice(0, 3).map(apt => (
                  <CalendarEvent
                    key={apt.id}
                    appointment={apt}
                    onClick={() => onAppointmentClick(apt)}
                    compact
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
