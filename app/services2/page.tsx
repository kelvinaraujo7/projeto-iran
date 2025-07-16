"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  User,
  MessagesSquare,
  PhoneCall,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const acoesCards = [
  {
    text: "Iniciar atendimento",
    icon: MessagesSquare,
    cardClasses:
      "bg-green-200 hover:bg-green-300 dark:hover:bg-slate-800 dark:bg-slate-950 dark:border dark:border-white/10 dark:shadow-sm dark:shadow-card-foreground",
    iconClasses: "text-green-600",
    textClasses: "text-green-800",
  },
  {
    text: "Chamar novamente",
    icon: PhoneCall,
    cardClasses:
      "bg-yellow-100 hover:bg-yellow-200 dark:hover:bg-slate-800 dark:bg-slate-950 dark:border dark:border-white/10 dark:shadow-sm dark:shadow-card-foreground",
    iconClasses: "text-yellow-600",
    textClasses: "text-yellow-800",
  },
  {
    text: "Não compareceu",
    icon: User,
    cardClasses:
      "bg-red-200 hover:bg-red-300 dark:hover:bg-slate-800 dark:bg-slate-950 dark:border dark:border-white/10 dark:shadow-sm dark:shadow-card-foreground",
    iconClasses: "text-red-600",
    textClasses: "text-red-800",
  },
  {
    text: "Encerrar o atendimento",
    icon: CheckCircle,
    cardClasses:
      "bg-blue-200 hover:bg-blue-300 dark:hover:bg-slate-800 dark:bg-slate-950 dark:border dark:border-white/10 dark:shadow-sm dark:shadow-card-foreground",
    iconClasses: "text-blue-600",
    textClasses: "text-blue-800 text-lg",
  },
  {
    text: "Encerrar e redirecionar",
    icon: ArrowRight,
    cardClasses:
      "bg-violet-200 hover:bg-violet-300 dark:bg-slate-950 dark:border dark:border-white/10 dark:shadow-sm dark:shadow-card-foreground dark:hover:bg-slate-800",
    iconClasses: "text-violet-600",
    textClasses: "text-violet-800",
  },
];

const Services = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
      <div className="flex flex-col gap-5 w-full max-w-[80rem] mx-auto">
        {/* Linha com Atendimento e Ações */}
        <div className="flex flex-col lg:flex-row gap-5 w-full">
          {/* Atendimento */}
          <Card className="w-[300px] bg-white rounded-lg shadow-md min-h-[250px] flex flex-col bg-slate-100   dark:bg-slate-950 dark:border dark:border-white/10 dark:shadow-lg dark:shadow-card-foreground">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">
                Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center">
              <button
                type="button"
                className="hover:bg-blue-100 w-72 h-72 flex flex-col items-center justify-center gap-4  dark:hover:bg-slate-800 dark:bg-slate-950 dark:border dark:border-white/10 dark:shadow-lg dark:shadow-card-foreground rounded-lg"
              >
                <div className="relative flex items-center justify-center h-24 w-full">
                  <MessagesSquare className="absolute size-14 text-blue-400 z-0 -top-8" />
                  <User className="absolute size-14 left-6 text-blue-400 z-10 -translate-x-3 top-8" />
                  <User className="absolute size-14 right-6 text-blue-700 z-20 translate-x-3 top-8" />
                </div>
                <span className="text-blue-700 font-medium text-lg">
                  Chamar Próximo
                </span>
              </button>
            </CardContent>
          </Card>

          {/* Ações */}
          <Card className="flex-1 bg-white rounded-lg shadow-md min-h-[250px] flex flex-col dark:bg-slate-950 dark:border dark:border-white/10 dark:shadow-lg dark:shadow-card-foreground">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">
                Ações
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
              {acoesCards.map(
                ({ text, icon: Icon, cardClasses, iconClasses, textClasses }, index) => (
                  <div
                    key={index}
                    className={`${cardClasses} w-full h-[170px] p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-md transition`}
                  >
                    <Icon
                      className={`${iconClasses} bg-white rounded-full p-2 w-14 h-14 mb-3`}
                    />
                    <span
                      className={`${textClasses} font-semibold text-sm leading-snug text-center break-words max-w-[8rem]`}
                    >
                      {text}
                    </span>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>

        {/* Minha fila */}
        <Card className="bg-white rounded-lg shadow-md min-h-[250px] flex flex-col dark:bg-slate-950 dark:border dark:border-white/10 dark:shadow-lg dark:shadow-card-foreground">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 dark:text-white">
              Minha fila
            </CardTitle>
          </CardHeader>
          <CardFooter className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
            {[1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className="bg-blue-400 hover:bg-blue-500 text-white dark:bg-slate-950 dark:hover:bg-slate-800 rounded-xl px-8 py-5 w-full dark:border dark:border-white/10 dark:shadow-sm dark:shadow-card-foreground"
              >
                <div className="flex gap-4">
                  <User className="w-7 h-7 text-orange-300" />
                  <div className="flex flex-col">
                    <div className="flex gap-3">
                      <span className="text-xl font-bold">4</span>
                      <span className="text-base font-semibold">
                        {index % 2 === 0
                          ? "Atendimento preferencial"
                          : "Atendimento Normal"}
                      </span>
                    </div>
                    <span className="text-base opacity-90">Renovação</span>
                  </div>
                </div>
              </div>
            ))}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Services;
