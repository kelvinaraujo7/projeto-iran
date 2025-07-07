"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { CircleDot, XCircle, Clock } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

function MyDatePicker() {
  const [selected, setSelected] = React.useState<Date | undefined>();

  const modifiers = {
    scheduled: new Date(2025, 6, 13),
    cancelled: new Date(2025, 6, 17),
    passed: { before: new Date() },
  };

  const modifiersStyles = {
    scheduled: { color: "green", backgroundColor: "#22c55e" },
    cancelled: { color: "white", backgroundColor: "rgb(239, 68, 68)" },
    passed: { color: "white", backgroundColor: "rgb(107, 114, 128)" },
    selected: {},
  };

  const modifiersClassNames = {
    scheduled: "bg-green-500 text-white",
    cancelled: "bg-red-500 text-white",
    passed: "bg-gray-500 text-white",
    selected: "ring-2 ring-yellow-400 ring-offset-2",
  };

  return (
    <div className="bg-[#3c4349] dark:bg-black rounded-2xl p-4 w-full mx-auto shadow-md dark:border dark:border-white/10 dark:bg-slate-950 shadow-card-foreground">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        modifiersClassNames={modifiersClassNames}
        className="text-white [&_.rdp-caption]:text-white [&_.rdp-head_abbr]:text-white [&_.rdp-day]:text-white [&_.rdp-nav_button]:text-white [&_.rdp-nav_button_svg]:stroke-[#fcd32a] 
        [&_.rdp-nav_button_svg]:stroke-[2]"
      />
      <p className="mt-3 text-sm text-center text-white">
        {selected
          ? `Data selecionada: ${selected.toLocaleDateString("pt-BR")}`
          : "Escolha um dia disponível:"}
      </p>
    </div>
  );
}

const DepartmentPage = () => {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-[#eeeeee] dark:bg-slate-950 text-white px-4 py-6 md:px-10 lg:px-20">
      <div className="w-full max-w-screen-2xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
          <CardTitle className="text-3xl font-bold text-[#2d485a] dark:text-white">
            Meus agendamentos
          </CardTitle>
          <Button
            className="bg-[#597183] text-white hover:bg-[#6b8ca1] font-semibold py-2 px-4 rounded-md dark:bg-white dark:text-black dark:hover:bg-slate-800 dark:hover:text-white"
            onClick={() => router.push("../emissao-ficha")}
          >
            Realizar agendamento
          </Button>
        </div>

        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        {/* Card de fundo */}
        <div className="bg-[#f5f5f5] rounded-3xl shadow-md p-6 sm:p-10 border border-[#e0e8ee] dark:bg-slate-950 dark:shadow-2xl dark:shadow-card-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Calendário e legenda */}
            <div className="flex flex-col items-center sm:items-start gap-6 w-full">
              <div className="w-full max-w-full sm:max-w-[420px] mx-auto">
                <MyDatePicker />
              </div>

              <div className="flex flex-col space-y-2 text-[#2e404e] text-sm w-full sm:max-w-[420px]">
                <h4 className="text-lg font-semibold dark:text-white">
                  Sumário de cores:
                </h4>
                <div className="flex items-center space-x-2 dark:text-white text-lg">
                  <CircleDot className="text-green-500" size={14} />
                  <span>Agendado</span>
                </div>
                <div className="flex items-center space-x-2 dark:text-white text-lg">
                  <XCircle className="text-red-500" size={14} />
                  <span>Cancelado</span>
                </div>
                <div className="flex items-center space-x-2 dark:text-white text-lg">
                  <Clock className="text-gray-500" size={14} />
                  <span>Passado</span>
                </div>
              </div>
            </div>

            {/* Lista de agendamentos */}
            <Card className="md:col-span-1 xl:col-span-2 bg-[#d7d7d7] p-6 text-[#2e404e] shadow-sm dark:bg-slate-950 dark:shadow-lg dark:border-white/10 dark:shadow-card-foreground dark:border">
              <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                Lista de agendamentos:
              </h3>
              <div className="space-y-4 ">
                {[13, 17].map((dia, i) => (
                  <div
                    key={i}
                    className="bg-[#3c4349] p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3 dark:bg-slate-950 dark:shadow-sm dark:shadow-2xl shadow-card-foreground dark:border dark:border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`text-4xl font-bold ${
                          dia === 13
                            ? "text-green-500"
                            : dia === 17
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        {dia}
                      </div>
                      <div className="text-white/90 text-xl">
                        <p>Estado: Rio Grande do Norte</p>
                        <p>Unidade: Natal</p>
                        <p>Departamento: Financeiro</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="bg-[#597183] hover:bg-[#6b8ca1] hover:text-white text-white font-semibold px-3 py-2 rounded-md dark:bg-white dark:text-black dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                      Ver mais
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentPage;
