import { useMemo } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarEvent } from "./CalendarEvent";
import type { Appointment } from "@/hooks/useAppointments";

interface CalendarWeekViewProps {
  currentDate: Date;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onSlotClick: (date: Date) => void;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 to 20:00

export function CalendarWeekView({ currentDate, appointments, onAppointmentClick, onSlotClick }: CalendarWeekViewProps) {
  const weekStart = startOfWeek(currentDate, { locale: ptBR });
  const weekEnd = endOfWeek(currentDate, { locale: ptBR });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const appointmentsByDayAndHour = useMemo(() => {
    const map: Record<string, Record<number, Appointment[]>> = {};
    
    days.forEach(day => {
      const dayKey = format(day, "yyyy-MM-dd");
      map[dayKey] = {};
      HOURS.forEach(hour => {
        map[dayKey][hour] = [];
      });
    });

    appointments.forEach(apt => {
      const aptDate = new Date(apt.start_time);
      const dayKey = format(aptDate, "yyyy-MM-dd");
      const hour = aptDate.getHours();
      
      if (map[dayKey] && map[dayKey][hour]) {
        map[dayKey][hour].push(apt);
      }
    });

    return map;
  }, [appointments, days]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[800px]">
        {/* Header with days */}
        <div className="grid grid-cols-8 border-b border-border sticky top-0 bg-card z-10">
          <div className="p-2 text-center text-xs text-muted-foreground border-r border-border">
            Horário
          </div>
          {days.map(day => (
            <div
              key={day.toISOString()}
              className={`p-2 text-center border-r border-border last:border-r-0 ${
                isToday(day) ? "bg-primary/10" : ""
              }`}
            >
              <p className="text-xs text-muted-foreground capitalize">
                {format(day, "EEE", { locale: ptBR })}
              </p>
              <p className={`text-lg font-semibold ${isToday(day) ? "text-primary" : ""}`}>
                {format(day, "d")}
              </p>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="grid grid-cols-8">
          {/* Time column */}
          <div className="border-r border-border">
            {HOURS.map(hour => (
              <div
                key={hour}
                className="h-20 border-b border-border p-1 text-xs text-muted-foreground text-right pr-2"
              >
                {String(hour).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map(day => {
            const dayKey = format(day, "yyyy-MM-dd");
            return (
              <div key={day.toISOString()} className="border-r border-border last:border-r-0">
                {HOURS.map(hour => {
                  const slotAppointments = appointmentsByDayAndHour[dayKey]?.[hour] || [];
                  const slotDate = setMinutes(setHours(day, hour), 0);

                  return (
                    <div
                      key={hour}
                      className={`h-20 border-b border-border p-0.5 cursor-pointer hover:bg-muted/30 transition-colors ${
                        isToday(day) ? "bg-primary/5" : ""
                      }`}
                      onClick={() => onSlotClick(slotDate)}
                    >
                      <div className="space-y-0.5 overflow-hidden h-full">
                        {slotAppointments.map(apt => (
                          <CalendarEvent
                            key={apt.id}
                            appointment={apt}
                            onClick={() => onAppointmentClick(apt)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
