"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Headset,
  ZoomIn,
  Scale,
  BanknoteArrowUp,
} from "lucide-react";

const acoesCards = [
  {
    text: "Atendimento",
    icon: Headset,
    cardClasses:
      "bg-blue-300 hover:bg-blue-500 dark:bg-blue-50 dark:hover:bg-slate-800 border border-white/10 shadow-inner",
    iconClasses: "text-white dark:text-black",
    textClasses: "text-white text-base text-center dark:text-black",
  },
  {
    text: "Fiscalização",
    icon: ZoomIn,
    cardClasses:
      "bg-blue-300 hover:bg-blue-500 dark:bg-blue-50 dark:hover:bg-slate-800 border border-white/10 shadow-inner",
    iconClasses: "text-white dark:text-black",
    textClasses: "text-white text-base text-center dark:text-black",
  },
  {
    text: "Jurídico",
    icon: Scale,
    cardClasses:
      "bg-blue-300 hover:bg-blue-500 dark:bg-blue-50 dark:hover:bg-slate-800 border border-white/10 shadow-inner",
    iconClasses: "text-white dark:text-black",
    textClasses: "text-white text-base text-center dark:text-black",
  },
  {
    text: "Financeiro",
    icon: BanknoteArrowUp,
    cardClasses:
      "bg-blue-300 hover:bg-blue-500 dark:bg-blue-50 dark:hover:bg-slate-800 border border-white/10 shadow-inner",
    iconClasses: "text-white dark:text-black",
    textClasses: "text-white text-base text-center dark:text-black",
  },
];

const DepartmentPage = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-start justify-end w-full max-w-7xl mx-auto px-4 py-8 bg-blue-300 dark:bg-slate-950 dark:shadow-xl shadow-card-foreground dark:border dark:border-white/10">
      {/* Título da Página */}
      <CardTitle className="mb-4 text-2xl text-white">
        Atendimento:
      </CardTitle>

      {/* Card principal */}
      <Card className="bg-blue-50  rounded-xl p-6 w-full dark:bg-slate-950 dark:shadow-lg shadow-card-foreground dark:border dark:border-white/10">
        
        {/*  botão e título */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <Button
            variant="outline"
            className="bg-blue-400 text-white dark:bg-white dark:text-black hover:bg-blue-500 dark:hover:bg-slate-800 dark:hover:text-white"
            onClick={() => router.push("../emissao-ficha")}
          >
            Voltar
          </Button>

          <CardTitle className="flex-1 mr-21 text-center text-2xl text-blue-950 dark:text-white">
            Departamento
          </CardTitle>
        </div>

        {/* Ícones de Departamento */}
        <CardContent className="flex flex-wrap justify-center gap-6">
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
          onClick={() => router.push("../emissao-ficha/servicee")}
        >
          Próxima Etapa
        </Button>
      </div>
    </div>
  );
};

export default DepartmentPage;
