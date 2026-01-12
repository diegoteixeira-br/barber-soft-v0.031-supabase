import { useEffect, useState } from "react";
import { Check, CheckCheck } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  time: string;
}

const messages: Message[] = [
  { id: 1, text: "Oi, quero agendar um corte", isBot: false, time: "14:32" },
  { id: 2, text: "Olá! 👋 Sou o Jackson, assistente virtual da Barbearia Premium. Qual horário você prefere?", isBot: true, time: "14:32" },
  { id: 3, text: "Amanhã às 15h", isBot: false, time: "14:33" },
  { id: 4, text: "Perfeito! ✅ Agendei seu corte para amanhã às 15h com o Bruno. Te envio um lembrete 1h antes!", isBot: true, time: "14:33" },
];

export function ChatSimulation() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    messages.forEach((msg, index) => {
      const timer = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, msg.id]);
      }, (index + 1) * 1200);
      timers.push(timer);
    });

    // Reset and repeat
    const resetTimer = setTimeout(() => {
      setVisibleMessages([]);
    }, messages.length * 1200 + 3000);
    timers.push(resetTimer);

    return () => timers.forEach(clearTimeout);
  }, [visibleMessages.length === 0]);

  return (
    <div className="bg-[#0b141a] rounded-2xl overflow-hidden shadow-2xl border border-border/30 w-full max-w-xs sm:max-w-sm mx-auto">
      {/* WhatsApp Header */}
      <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
          <span className="text-gold font-bold">J</span>
        </div>
        <div>
          <p className="text-foreground font-medium text-sm">Jackson - BarberSoft</p>
          <p className="text-xs text-green-500">online</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="p-4 min-h-[280px] space-y-3 bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')] bg-repeat">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isBot ? "justify-start" : "justify-end"} transition-all duration-500 ${
              visibleMessages.includes(msg.id)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                msg.isBot
                  ? "bg-[#1f2c34] text-foreground"
                  : "bg-[#005c4b] text-foreground"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                {!msg.isBot && <CheckCheck className="h-3 w-3 text-blue-400" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
