import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  BarChart3,
  CalendarDays,
  Percent,
  Megaphone,
  Building2,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Dashboard Financeiro",
    description: "Faturamento, métricas em tempo real, gráficos de receita e controle total de caixa.",
    color: "gold",
  },
  {
    icon: CalendarDays,
    title: "Agenda Inteligente",
    description: "Visualização por dia, semana ou mês. Filtro por profissional e gestão de horários.",
    color: "orange-neon",
  },
  {
    icon: Percent,
    title: "Comissões Automáticas",
    description: "Cálculo automático de comissões por profissional com relatórios detalhados.",
    color: "gold",
  },
  {
    icon: Megaphone,
    title: "Marketing Inteligente",
    description: "Campanhas personalizadas, automações de aniversário e resgate de clientes inativos.",
    color: "orange-neon",
  },
  {
    icon: Building2,
    title: "Multi-Unidades",
    description: "Gerencie todas as suas filiais num só lugar com relatórios comparativos.",
    color: "gold",
  },
  {
    icon: MessageCircle,
    title: "Integração WhatsApp",
    description: "Sem app para baixar! Seu cliente agenda direto no WhatsApp que ele já usa. Zero fricção.",
    color: "orange-neon",
  },
];

export function FeaturesGrid() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="funcionalidades" className="py-16 sm:py-20 bg-background relative scroll-mt-20">
      <div className="container mx-auto px-6 sm:px-4">
        <div
          ref={ref}
          className={`text-center mb-10 sm:mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">
            Funcionalidades
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Tudo que sua barbearia precisa
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Sistema completo de gestão desenvolvido especificamente para barbearias modernas.
          </p>
        </div>

        {/* Grid - 1 coluna em mobile, 2 em tablet, 3 em desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-5 sm:p-6 rounded-2xl bg-charcoal/50 border border-border/30 hover:border-gold/50 transition-all duration-500 hover:transform hover:scale-[1.02] overflow-hidden ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <div className="relative z-10">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${
                    feature.color === "gold" ? "bg-gold/10" : "bg-orange-neon/10"
                  } flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon
                    className={`h-6 w-6 sm:h-7 sm:w-7 ${
                      feature.color === "gold" ? "text-gold" : "text-orange-neon"
                    }`}
                  />
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
