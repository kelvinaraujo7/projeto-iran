"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";
import { EditIcon, Power, Trash2Icon, Plus } from "lucide-react";
import { useAppData } from "@/context/AppDataContextType ";

const Units = () => {
  const { units, editarUnit, excluirUnit } = useAppData();

  function alternarStatus(unit: { id: number; status: string }) {
    editarUnit(unit.id, {
      status: unit.status === "Ativo" ? "Desativado" : "Ativo",
    });
  }

  return (
    <Card className="bg-slate-100 dark:bg-slate-950 mb-4 ml-4 mr-2 rounded-sm dark:shadow-lg dark:shadow-card-foreground">
      <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <CardTitle className="font-bold text-2xl dark:text-white">
            Unidades
          </CardTitle>
          <CardDescription className="mt-3">
            Lista de unidades de atendimento:
          </CardDescription>
        </div>
        <div>
          <Button
            asChild
            className="bg-slate-500 hover:bg-slate-700 hover:text-white dark:bg-white dark:text-black dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <Link href="/units/new">
              <Plus className="mr-2" />
              Nova unidade
            </Link>
          </Button>
        </div>
      </CardHeader>

      <Separator className="bg-slate-300" />

      <CardContent className="overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Nome</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center w-[180px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell className="font-medium">{unit.name}</TableCell>
                <TableCell
                  className={`text-center ${
                    unit.status === "Ativo"
                      ? "text-green-700 dark:text-slate-50"
                      : "text-red-700 dark:text-slate-500"
                  }`}
                >
                  {unit.status}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      className={`px-2 py-2 rounded-md ${
                        unit.status === "Ativo"
                          ? "bg-red-700 text-white"
                          : "bg-green-600 text-white"
                      }`}
                      title="Alternar status"
                      onClick={() => alternarStatus(unit)}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <Button
                      asChild
                      className="bg-blue-500 dark:bg-slate-400 text-white px-2 py-2 rounded-md"
                    >
                      <Link href={`/units/${unit.id}`}>
                        <EditIcon className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      className="bg-red-500 dark:bg-slate-500 text-white px-2 py-2 rounded-md"
                      onClick={() => excluirUnit(unit.id)}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter></CardFooter>
    </Card>
  );
};

export default Units;
