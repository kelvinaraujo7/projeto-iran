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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { EditIcon, Power, Trash2Icon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useAppData } from "@/context/AppDataContextType ";

const Departments = () => {
  const { departments, editarDepartment, excluirDepartment } = useAppData();

  function alternarStatus(department: { id: number; status: string }) {
    editarDepartment(department.id, {
      status: department.status === "Ativo" ? "Desativado" : "Ativo",
    });
  }

  return (
    <>
      <Card className="bg-slate-100 dark:bg-slate-950 mb-4 ml-4 mr-2 rounded-sm shadow-2xl shadow-card-foreground">
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle className="font-bold text-2xl w-1/2 dark:text-white">
              Departamentos
            </CardTitle>
            <CardDescription className="mt-3" >
              Lista dos departamentos de atendimento:
            </CardDescription>
          </div>
          <div>
            <Button
              asChild
              className="bg-slate-500 hover:bg-slate-700 hover:text-white"
            >
              <Link href="/pages/departments/new">
                <Plus className="mr-2" />
                Novo departamento
              </Link>
            </Button>
          </div>
        </CardHeader>
        <Separator className="bg-slate-300" />
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Nome</TableHead>
                <TableHead className="text-center">
                  Hora Inicial manhã
                </TableHead>
                <TableHead className="text-center">
                  Hora Final manhã
                </TableHead>
                 <TableHead className="text-center">Hora Inicial  tarde</TableHead>
                <TableHead className="text-center">Hora Final  tarde</TableHead>
                <TableHead className="text-center">Dia De Exceção</TableHead>    
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(departments) &&
                departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">
                      {department.name}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {department.startServiceMorning}
                    </TableCell>

                    <TableCell className="font-medium text-center">
                      {department.endServiceMorning}
                    </TableCell>

                     <TableCell className="font-medium text-center">
                      {department.startServiceAfternoon}
                    </TableCell>

                    <TableCell className="font-medium text-center">
                      {department.endServiceAfternoon}
                    </TableCell>

                     <TableCell className="font-medium text-center">
                      {department.exceptionDay}
                    </TableCell>

                    <TableCell
                      className={`text-center ${
                        department.status === "Ativo"
                          ? "text-green-700 dark:text-slate-50"
                          : "text-red-700 dark:text-slate-500"
                      }`}
                    >
                      {department.status}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 ml-auto w-fit">
                        <button
                          className={`px-2 py-2 rounded-md mr-2 ${
                            department.status === "Ativo"
                              ? "bg-red-700 text-white"
                              : "bg-green-600 text-white"
                          }`}
                          title="Alternar status"
                          onClick={() => alternarStatus(department)}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <Button
                          asChild
                          className="bg-blue-500 dark:bg-slate-400 text-white px-2 py-2 rounded-md mr-2"
                        >
                          <Link href={`/pages/departments/${department.id}`}>
                            <EditIcon className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          className="bg-red-500 dark:bg-slate-500 text-white px-2 py-2 rounded-md mr-2"
                          onClick={() => excluirDepartment(department.id)}
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
        <CardFooter>{/* Paginação, se necessário */}</CardFooter>
      </Card>
    </>
  );
};

export default Departments;
