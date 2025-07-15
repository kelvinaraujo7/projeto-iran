"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import {
  Card,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ClipboardPenLine,
  RefreshCw,
  CircleX,
  ArrowLeftRight,
  HandCoins,
} from "lucide-react";

const acoesCards = [
  {
    text: "Inscrição Definitiva",
    icon: ClipboardPenLine,
    cardClasses:
      "bg-blue-300 hover:bg-blue-500 dark:bg-blue-50 dark:hover:bg-slate-800 border border-white/10 shadow-inner",
    iconClasses: "text-white dark:text-black",
    textClasses: "text-white text-base text-center dark:text-black",
  },
  {
    text: "Renovação",
    icon: RefreshCw,
    cardClasses:
      "bg-blue-300 hover:bg-blue-500 dark:bg-blue-50 dark:hover:bg-slate-800 border border-white/10 shadow-inner",
    iconClasses: "text-white dark:text-black",
    textClasses: "text-white text-base text-center dark:text-black",
  },
  {
    text: "Cancelamento",
    icon: CircleX,
    cardClasses:
      "bg-blue-300 hover:bg-blue-500 dark:bg-blue-50 dark:hover:bg-slate-800 border border-white/10 shadow-inner",
    iconClasses: "text-white dark:text-black",
    textClasses: "text-white text-base text-center dark:text-black",
  },
  {
    text: "Transferência",
    icon: ArrowLeftRight,
    cardClasses:
      "bg-blue-300 hover:bg-blue-500 dark:bg-blue-50 dark:hover:bg-slate-800 border border-white/10 shadow-inner",
    iconClasses: "text-white dark:text-black",
    textClasses: "text-white text-base text-center dark:text-black",
  },
  {
    text: "Inscrição Remida",
    icon: HandCoins,
    cardClasses:
      "bg-blue-300 hover:bg-blue-500 dark:bg-blue-50 dark:hover:bg-slate-800 border border-white/10 shadow-inner",
    iconClasses: "text-white dark:text-black",
    textClasses: "text-white text-sm text-center dark:text-black",
  },
];

const ServicePage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-start w-full max-w-7xl mx-auto px-4 py-8 bg-blue-300 dark:bg-slate-950 dark:shadow-xl dark:shadow-card-foreground dark:border dark:border-white/10">
      {/* Título superior */}
      <CardTitle className="mb-4 text-2xl text-white">Atendimento:</CardTitle>

      {/* Card principal */}
      <Card className="w-full bg-blue-50 dark:bg-slate-950 dark:shadow-lg dark:shadow-card-foreground dark:border dark:border-white/10">
        {/* Cabeçalho do card */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <Button
            variant="outline"
            className="bg-blue-400 text-white dark:bg-white dark:text-black hover:bg-blue-500 dark:hover:bg-slate-800 dark:hover:text-white ml-1"
            onClick={() => router.push("../emissao-ficha/department")}
          >
            Voltar
          </Button>

          <CardTitle className="flex-auto mr-21 text-center text-2xl text-blue-950 dark:text-white w-full sm:w-auto">
            Serviço
          </CardTitle>
        </div>

        {/* Ícones de serviço */}
        <CardContent className="flex flex-wrap justify-center gap-6 ">
          {acoesCards.map(
            (
              { text, icon: Icon, cardClasses, iconClasses, textClasses },
              index
            ) => (
              <div
                key={index}
                className={`${cardClasses} w-32 h-32 rounded-full flex flex-col items-center justify-center transition`}
              >
                <Icon className={`${iconClasses} w-10 h-10 mb-1`} />
                <span className={`${textClasses} font-medium text-center`}>
                  {text}
                </span>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Botão Final */}
      <div className="flex justify-end w-full mt-6">
        <Button
          className="bg-blue-500 text-white hover:bg-white hover:text-black dark:bg-white dark:text-black dark:hover:bg-slate-800 dark:hover:text-white"
          onClick={() => router.push("../emissao-ficha/ticket-digital")}
        >
          Próxima Etapa
        </Button>
      </div>
    </div>
  );
};

export default ServicePage;
