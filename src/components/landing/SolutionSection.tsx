import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ChatSimulation } from "./ChatSimulation";
import { Bot, Clock, MessageCircle, Calendar, Bell, UserCheck, Gift, RefreshCcw, Smartphone } from "lucide-react";

const features = [
  { icon: Clock, text: "Responde 24 horas por dia" },
  { icon: Calendar, text: "Agenda automaticamente" },
  { icon: Bell, text: "Confirma presença dos clientes" },
  { icon: Gift, text: "Identifica aniversariantes do dia" },
  { icon: RefreshCcw, text: "Campanhas para clientes inativos" },
  { icon: UserCheck, text: "Ferramentas de marketing" },
];

export function SolutionSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-16 sm:py-20 bg-charcoal/30 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-neon/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 sm:px-4 relative z-10">
        <div
          ref={ref}
          className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
              <Bot className="h-4 w-4 text-gold" />
              <span className="text-xs sm:text-sm text-gold">Automação Inteligente</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Conheça o <span className="text-gold">Jackson</span>: Seu Gerente Virtual
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
              Ele responde 24h, agenda e confirma presença automaticamente.{" "}
              <span className="text-foreground font-medium">
                Organize campanhas de aniversário e reative clientes inativos com facilidade.
              </span>
            </p>

            {/* Features Grid - 1 coluna em mobile, 2 em tablet+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-gold" />
                  </div>
                  <span className="text-sm text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp Badge - Sem App para Baixar */}
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-left">
                  <p className="text-foreground font-semibold text-sm sm:text-base">Seu cliente já tem WhatsApp!</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Zero fricção. Sem baixar app. Sem criar conta.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                <span className="text-foreground font-semibold">Redução de 80%</span> nas faltas com confirmação de presença
              </p>
            </div>
          </div>

          {/* Chat Simulation */}
          <div className="relative mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-radial from-gold/20 to-transparent opacity-50 blur-3xl" />
            <div className="relative z-10 lg:translate-x-8 w-full max-w-sm mx-auto lg:max-w-none">
              <ChatSimulation />
            </div>
            
            {/* Floating Stats - Esconder em mobile pequeno */}
            <div className="hidden sm:block absolute -top-4 left-0 lg:-left-4 bg-charcoal border border-border/30 rounded-lg p-3 sm:p-4 shadow-xl animate-fade-in">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">98%</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Taxa de resposta</p>
                </div>
              </div>
            </div>

            <div className="hidden sm:block absolute -bottom-4 right-0 lg:-right-4 bg-charcoal border border-border/30 rounded-lg p-3 sm:p-4 shadow-xl animate-fade-in">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">~30s</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Resposta natural</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
