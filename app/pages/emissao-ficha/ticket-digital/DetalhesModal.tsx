"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Banknote  } from "lucide-react";
import Image from "next/image";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const DetalhesModal = ({ isOpen, onClose }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/40 z-50" />
      <DialogContent className="bg-transparent shadow-none text-white p-0 m-auto max-w-[600px]">
       
        <div className="absolute z-50 left-1/2 -translate-x-1/2 -top-10 w-20 h-20 bg-[#f5ffecdd] rounded-full flex items-center justify-center">
          <div className="w-14 h-14 bg-[#A1DD70] rounded-full flex items-center justify-center">
            <Check color="white" size={30} />
          </div>
        </div>

        {/* Topo */}
        <div className="bg-blue-300 rounded-lg border-b border-dashed border-blue-500 p-6 space-y-10">
          <div className="flex justify-between">
            <div className="text-left">
              <p className="text-blue-500">Estado</p>
              <p className="font-bold text-lg">Rio Grande do Norte</p>
            </div>
            <div className="text-right">
              <p className="text-blue-500">Unidade</p>
              <p className="font-bold text-lg">Natal</p>
            </div>
          </div>

          <div className="relative flex justify-between gap-10">
            <div className="flex flex-col text-left">
              <p className="text-blue-500">Departamento</p>
              <p className="font-bold text-xl">Financeiro</p>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 h-12 w-12 bg-blue-900 rounded-full flex items-center justify-center">
              <Banknote  size={30} color="white" />
            </div>

            <div className="flex flex-col items-end text-right">
              <p className="text-blue-500">Serviço</p>
              <p className="font-bold text-xl">Ressarcimento</p>
            </div>
          </div>
        </div>

        {/* Meio */}
        <div className="bg-blue-300 border-b border-dashed border-blue-500 p-6">
          <div className="flex justify-between">
            <div className="text-left">
              <p className="text-blue-500">Nome</p>
              <p className="font-bold text-lg">Iran Vital</p>
            </div>
            <div className="text-right">
              <p className="text-blue-500">CPF</p>
              <p className="font-bold text-lg">xxx.123.xxx-xx</p>
            </div>
          </div>
        </div>

        {/* Parte debaixo */}
        <div className="bg-blue-300 p-6">
          <div className="flex justify-between gap-4">
            <div className="flex flex-col text-left w-1/2 gap-3">
              <div>
                <p className="text-blue-500">Tipo</p>
                <p className="font-bold text-lg">Normal</p>
              </div>
              <div>
                <p className="text-blue-500">Data</p>
                <p className="font-bold text-lg">21/08/2024</p>
              </div>
              <div>
                <p className="text-blue-500">Hora</p>
                <p className="bg-blue-900 px-3 py-1 text-lg font-bold rounded-xl w-fit">
                  09:00
                </p>
              </div>
            </div>
            <div className="w-1/2 text-right">
              
              <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                QRCode
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-gradient-to-t from-blue-900 to-blue-400 rounded-b-lg p-4">
          {/* <Button
            variant="outline"
            className="w-15 h-8 text-white bg-blue-400 dark:bg-white dark:text-black dark:hover:bg-slate-800 dark:hover:text-white"
                      size="icon"
                      onClick={() => router.push('../emissao-ficha/department')}
                    >
                      Voltar
                    </Button> */}


          <Button variant="default" className="bg-blue-400 hover:bg-blue-300 text-white" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
