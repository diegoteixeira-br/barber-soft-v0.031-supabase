import { useMemo } from "react";
import { format, setHours, setMinutes, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarEvent } from "./CalendarEvent";
import type { Appointment } from "@/hooks/useAppointments";
import type { Barber } from "@/hooks/useBarbers";

interface CalendarDayViewProps {
  currentDate: Date;
  appointments: Appointment[];
  barbers: Barber[];
  selectedBarberId: string | null;
  onAppointmentClick: (appointment: Appointment) => void;
  onSlotClick: (date: Date, barberId?: string) => void;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 to 20:00

export function CalendarDayView({
  currentDate,
  appointments,
  barbers,
  selectedBarberId,
  onAppointmentClick,
  onSlotClick,
}: CalendarDayViewProps) {
  const activeBarbers = useMemo(
    () => barbers.filter(b => b.is_active && (!selectedBarberId || b.id === selectedBarberId)),
    [barbers, selectedBarberId]
  );

  const appointmentsByBarberAndHour = useMemo(() => {
    const map: Record<string, Record<number, Appointment[]>> = {};
    
    activeBarbers.forEach(barber => {
      map[barber.id] = {};
      HOURS.forEach(hour => {
        map[barber.id][hour] = [];
      });
    });

    appointments.forEach(apt => {
      if (!apt.barber_id) return;
      const hour = new Date(apt.start_time).getHours();
      if (map[apt.barber_id] && map[apt.barber_id][hour]) {
        map[apt.barber_id][hour].push(apt);
      }
    });

    return map;
  }, [appointments, activeBarbers]);

  const today = isToday(currentDate);

  return (
    <div className="flex-1 overflow-auto">
      <div className={`min-w-[600px] ${activeBarbers.length > 3 ? "min-w-[900px]" : ""}`}>
        {/* Header with barbers */}
        <div className={`grid border-b border-border sticky top-0 bg-card z-10`} style={{ gridTemplateColumns: `80px repeat(${activeBarbers.length}, 1fr)` }}>
          <div className="p-3 text-center border-r border-border">
            <p className="text-sm text-muted-foreground capitalize">
              {format(currentDate, "EEEE", { locale: ptBR })}
            </p>
            <p className={`text-2xl font-bold ${today ? "text-primary" : ""}`}>
              {format(currentDate, "d")}
            </p>
          </div>
          {activeBarbers.map(barber => (
            <div
              key={barber.id}
              className="p-3 text-center border-r border-border last:border-r-0"
              style={{ borderTop: `3px solid ${barber.calendar_color || "#FF6B00"}` }}
            >
              <p className="font-semibold text-foreground">{barber.name}</p>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="grid" style={{ gridTemplateColumns: `80px repeat(${activeBarbers.length}, 1fr)` }}>
          {/* Time column */}
          <div className="border-r border-border">
            {HOURS.map(hour => (
              <div
                key={hour}
                className="h-24 border-b border-border flex items-start justify-end pr-2 pt-1"
              >
                <span className="text-sm text-muted-foreground">
                  {String(hour).padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          {/* Barber columns */}
          {activeBarbers.map(barber => (
            <div key={barber.id} className="border-r border-border last:border-r-0">
              {HOURS.map(hour => {
                const slotAppointments = appointmentsByBarberAndHour[barber.id]?.[hour] || [];
                const slotDate = setMinutes(setHours(currentDate, hour), 0);

                return (
                  <div
                    key={hour}
                    className={`h-24 border-b border-border p-1 cursor-pointer hover:bg-muted/30 transition-colors ${
                      today ? "bg-primary/5" : ""
                    }`}
                    onClick={() => onSlotClick(slotDate, barber.id)}
                  >
                    <div className="space-y-1 overflow-hidden h-full">
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
          ))}
        </div>
      </div>
    </div>
  );
}
