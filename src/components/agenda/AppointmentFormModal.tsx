import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Barber } from "@/hooks/useBarbers";
import type { Service } from "@/hooks/useServices";
import type { Appointment, AppointmentFormData } from "@/hooks/useAppointments";

const formSchema = z.object({
  client_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  client_phone: z.string().optional(),
  client_birth_date: z.string().optional(),
  barber_id: z.string().min(1, "Selecione um barbeiro"),
  service_id: z.string().min(1, "Selecione um serviço"),
  date: z.string().min(1, "Selecione uma data"),
  time: z.string().min(1, "Selecione um horário"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AppointmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barbers: Barber[];
  services: Service[];
  initialDate?: Date;
  initialBarberId?: string;
  appointment?: Appointment | null;
  onSubmit: (data: AppointmentFormData) => void;
  isLoading?: boolean;
}

export function AppointmentFormModal({
  open,
  onOpenChange,
  barbers,
  services,
  initialDate,
  initialBarberId,
  appointment,
  onSubmit,
  isLoading,
}: AppointmentFormModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_name: "",
      client_phone: "",
      client_birth_date: "",
      barber_id: "",
      service_id: "",
      date: "",
      time: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (appointment) {
        const startDate = new Date(appointment.start_time);
        form.reset({
          client_name: appointment.client_name,
          client_phone: appointment.client_phone || "",
          client_birth_date: appointment.client_birth_date || "",
          barber_id: appointment.barber_id || "",
          service_id: appointment.service_id || "",
          date: format(startDate, "yyyy-MM-dd"),
          time: format(startDate, "HH:mm"),
          notes: appointment.notes || "",
        });
      } else {
        form.reset({
          client_name: "",
          client_phone: "",
          client_birth_date: "",
          barber_id: initialBarberId || "",
          service_id: "",
          date: initialDate ? format(initialDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
          time: initialDate ? format(initialDate, "HH:mm") : "09:00",
          notes: "",
        });
      }
    }
  }, [open, appointment, initialDate, initialBarberId, form]);

  const handleSubmit = (values: FormValues) => {
    const [year, month, day] = values.date.split("-").map(Number);
    const [hours, minutes] = values.time.split(":").map(Number);
    const startTime = new Date(year, month - 1, day, hours, minutes);

    onSubmit({
      client_name: values.client_name,
      client_phone: values.client_phone,
      client_birth_date: values.client_birth_date,
      barber_id: values.barber_id,
      service_id: values.service_id,
      start_time: startTime,
      notes: values.notes,
    });
  };

  const selectedService = services.find(s => s.id === form.watch("service_id"));
  const activeBarbers = barbers.filter(b => b.is_active);
  const activeServices = services.filter(s => s.is_active);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente *</FormLabel>
                  <FormControl>
                    <Input placeholder="João Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="barber_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barbeiro *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeBarbers.map(barber => (
                          <SelectItem key={barber.id} value={barber.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: barber.calendar_color || "#FF6B00" }}
                              />
                              {barber.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="service_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serviço *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeServices.map(service => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - R$ {Number(service.price).toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedService && (
              <p className="text-sm text-muted-foreground">
                Duração: {selectedService.duration_minutes} min | Valor: R$ {Number(selectedService.price).toFixed(2)}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observações adicionais..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : appointment ? "Atualizar" : "Criar Agendamento"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
