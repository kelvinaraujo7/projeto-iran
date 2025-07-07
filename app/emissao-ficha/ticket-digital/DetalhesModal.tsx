"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Banknote } from "lucide-react";
import Image from "next/image";
import QRCode from "../../../public/imagens/qr-code.avif";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const DetalhesModal = ({ isOpen, onClose }: Props) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 20000000); 

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/40 z-50" />

      <DialogContent
        className="
          bg-transparent shadow-none p-0 m-auto rounded-lg overflow-hidden
          border-none outline-none focus:ring-0 ring-0 w-110 h-200 transition-opacity duration-500  ">
        
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="default"
            className="bg-white text-blue-900 hover:bg-blue-300 hover:text-white rounded-md px-4 text-sm py-2 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>

        {/* Ícone - Check */}
        <div className="absolute z-50 left-1/2 -translate-x-1/2 mt-2  w-18 h-18 bg-white rounded-full flex items-center justify-center">
          <div className="w-14 h-14 bg-[#A1DD70] rounded-full flex items-center justify-center">
            <Check color="white" size={30} />
          </div>
        </div>

        {/* Card Principal */}
        <div className="bg-blue-400 text-white rounded-lg pt-10 relative dark:bg-slate-950 dark:shadow-lg shadow-card-foreground dark:border dark:border-white/10 ">

          {/* Bordas - ticket */}
          <div className="absolute -left-4 top-1/4 w-8 h-8 mt-6 bg-black/90 dark:bg-blue-100 rounded-full z-50"></div>
          <div className="absolute -left-4 bottom-1/4 w-8 h-8 mb-58 bg-black/90 dark:bg-blue-100 rounded-full z-50"></div>
          <div className="absolute -right-4 top-1/4 w-8 h-8 mt-6 bg-black/90 rounded-full z-50 dark:bg-blue-100 "></div>
          <div className="absolute -right-4 bottom-1/4 w-8 h-8 mb-58 bg-black/90 rounded-full z-50 dark:bg-blue-100 "></div>

          {/* Seção Topo */}
          <div className="pt-8 pb-4 px-6 border-b border-dashed border-white dark:border-white">
            <div className="flex justify-between items-center mb-4">
              <div className="text-left">
                <p className="text-blue-200 text-sm">Estado</p>
                <p className="font-bold text-xl">Rio Grande do Norte</p>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-sm">Unidade</p>
                <p className="font-bold text-xl">Natal</p>
              </div>
            </div>

            <div className="relative flex justify-between items-center pt-4 pb-2">
              <div className="flex flex-col text-left">
                <p className="text-blue-200 text-sm">Departamento</p>
                <p className="font-bold text-xl">Financeiro</p>
              </div>

              {/* Ícone - Dinheiro */}
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-12 w-12 bg-blue-900 rounded-full flex items-center justify-center dark:bg-slate-900 dark:text-black">
                <Banknote size={30} color="white " />
              </div>

              <div className="flex flex-col items-end text-right">
                <p className="text-blue-200 text-sm">Serviço</p>
                <p className="font-bold text-xl">Ressarcimento</p>
              </div>
            </div>
          </div>

          {/* Seção Meio */}
          <div className="px-6 py-4 border-b border-dashed border-white dark:border-white">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <p className="text-blue-200 text-sm">Nome</p>
                <p className="font-bold text-lg">Iran Vital</p>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-sm">CPF</p>
                <p className="font-bold text-lg">xxx.123.xxx-xx</p>
              </div>
            </div>
          </div>

          {/* Seção Inferior */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-y-4">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-blue-200 text-sm">Tipo</p>
                  <p className="font-bold text-lg">Normal</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Data</p>
                  <p className="font-bold text-lg">21/08/2024</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Hora</p>
                  <p className="bg-blue-900 px-3 py-1 text-lg font-bold rounded-xl w-fit mt-2 dark:bg-white dark:text-black">
                    09:00
                  </p>
                </div>
              </div>
              <div className="flex justify-end items-center mt-1">
                <Image
                  src={QRCode}
                  alt="QR Code"
                  width={190}
                  height={120}
                  className="rounded-md"
                />
              </div>
              <div>
                <p  className="mt-1 ">- Faça a leitura do QRCode com a câmera do seu celular para saber quantos estão aguardando atendimento.</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};
