"use client";

import { useRouter } from "next/navigation";
import { Card, CardTitle, CardContent,} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Accessibility, ArrowLeft } from "lucide-react";
import React from 'react';

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
      "bg-blue-300 hover:bg-blue-500 dark:bg-blue-50 dark:hover:bg-slate-800 border border-white/10 shadow-inner dark:hover:bg-slate-800 ",
    iconClasses: "text-white dark:text-black ",
    textClasses: "text-white text-base text-center dark:text-black  ",
  },

   
];

const Services = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-end items-start w-320 bg-blue-300 p-6
    dark:bg-slate-950  inset-shadow-sm inset-shadow-white  border border-white/10  shadow-white/10 "> 
      <CardTitle className="mb-4 text-2xl text-white ">Atendimento:</CardTitle>

      <Card className="p-6   border border-white/10 shadow-xl rounded-xl w-300  bg-blue-50 h-80 
      dark:bg-slate-950  inset-shadow-sm inset-shadow-white  border border-white/10 shadow-inner shadow-white/10 ">
        {/* Botão Voltar */}
        <div className="flex justify-start mb-4 ">
          {/* <Button
            variant="outline"
            className="w-15 h-8 text-white bg-blue-400 dark:bg-white dark:text-black dark:hover:bg-slate-800 dark:hover:text-white "
            size="icon"
            onClick={() => router.push('./emissao-ficha')}
          >
            Voltar
          </Button> */}

           <CardTitle className="text-center fs-50 mb-2 ml-115 itemns-center justify-center text-2xl text-blue-950 dark:text-white ">
         Tipo de Atendimento
        </CardTitle>
        </div>

       

        <CardContent className="flex justify-center gap-8 mn-10 bg--200 ">
          {acoesCards.map(
            (
              {
                text,
                icon: Icon,
                cardClasses,
                iconClasses,
                textClasses,
              },
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

     <Button
      className="mt-5 bg-blue-500 ml-270 text-white hover:bg-white hover:text-black bg-blue-400
       dark:bg-white dark:text-black dark:hover:bg-slate-800 dark:hover:text-white"
       color={'white'} mt={'25px'} type='button' onClick={() => router.push('./emissao-ficha/department')}>Próxima Etapa</Button>    
    </div>
    
   
  );
};


export default Services;

