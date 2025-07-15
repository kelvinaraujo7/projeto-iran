"use client";

import { useRouter } from "next/navigation";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Accessibility } from "lucide-react";
import React from "react";

const acoesCards = [
  {
    text: "Normal",
    icon: User,
    cardClasses:
      "bg-blue-300 hover:bg-blue-500 dark:bg-blue-50 dark:hover:bg-slate-800 border border-white/10 shadow-inner",
    iconClasses: "text-white dark:text-black",
    textClasses: "text-white text-base text-center dark:text-black",
  },
  {
    text: "Preferencial",
    icon: Accessibility,
    cardClasses:
      "bg-blue-300 hover:bg-blue-500 dark:bg-blue-50 dark:hover:bg-slate-800 border border-white/10 shadow-inner",
    iconClasses: "text-white dark:text-black",
    textClasses: "text-white text-base text-center dark:text-black",
  },
];

const Services = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-start justify-end w-full max-w-7xl mx-auto px-4 py-8 bg-blue-300 dark:bg-slate-950 dark:shadow-xl shadow-card-foreground dark:border dark:border-white/10">
      <CardTitle className="mb-4 text-2xl text-white">Atendimento:</CardTitle>

      <Card className="p-6 rounded-xl w-full bg-blue-50 dark:bg-slate-950 dark:shadow-lg dark:shadow-card-foreground dark:border dark:border-white/10">
        <div className="flex justify-center mb-4">
          <CardTitle className="text-center text-2xl text-blue-950 dark:text-white">
            Tipo de Atendimento
          </CardTitle>
        </div>

        <CardContent className="flex flex-wrap justify-center gap-6">
          {acoesCards.map(({ text, icon: Icon, cardClasses, iconClasses, textClasses }, index) => (
            <div
              key={index}
              className={`${cardClasses} w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center transition`}
            >
              <Icon className={`${iconClasses} w-8 h-8 sm:w-10 sm:h-10 mb-1`} />
              <span className={`${textClasses} font-medium text-center text-xs sm:text-sm`}>
                {text}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="w-full flex justify-end mt-6">
        <Button
          className="bg-blue-500 text-white hover:bg-white hover:text-black dark:bg-white dark:text-black dark:hover:bg-slate-800 dark:hover:text-white"
          onClick={() => router.push("./emissao-ficha/department")}
        >
          Próxima Etapa
        </Button>
      </div>
    </div>
  );
};

export default Services;
