"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Power, Trash2Icon, EditIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { 
  useDepartments, 
  useUpdateDepartment, 
  useDeleteDepartment,
  type Department
} from "@/hooks/api/useDepartments";
import { useState } from "react";
import { toast } from "sonner";

const DepartmentsWithQuery = () => {
  const [filter] = useState<{ page?: number }>({});
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    department: Department | null;
  }>({
    isOpen: false,
    department: null,
  });

  const formatDateFromDB = (dateValue: string | Date | null | undefined): string => {
    if (!dateValue) return '-';
  
    try {
      if (typeof dateValue === 'string' && dateValue.includes('T')) {
        const dateOnly = dateValue.split('T')[0]; // "2025-08-11"
        const [year, month, day] = dateOnly.split('-');
        const formatted = `${day}/${month}/${year}`; // "11/08/2025"
        return formatted;
      }
      
      if (typeof dateValue === 'string' && dateValue.includes('-')) {
        const [year, month, day] = dateValue.split('-');
        const formatted = `${day}/${month}/${year}`;
        return formatted;
      }
      
      if (dateValue instanceof Date) {
        const formatted = dateValue.toLocaleDateString('pt-BR');

        return formatted;
      }
      

      return String(dateValue);
    } catch (error) {
      console.error('❌ Erro ao formatar data:', error, 'Valor:', dateValue);
      return String(dateValue);
    }
  };

  const { 
    data: departmentsResponse, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useDepartments(filter);

  const departments = departmentsResponse?.departments || [];
  const totalCount = departmentsResponse?.totalCount || 0;

  const updateDepartmentMutation = useUpdateDepartment();
  const deleteDepartmentMutation = useDeleteDepartment();

  const handleToggleStatus = async (department: Department) => {
    if (!department.id) return;
    try {
      // O backend exige TODOS os campos obrigatórios no PUT
      const updateData = {
        name: department.name,
        onlineScheduling: department.onlineScheduling || false,
        serviceTime: department.serviceTime || "00:30:00",
        startServiceMorning: department.startServiceMorning || "08:00:00",
        endServiceMorning: department.endServiceMorning || "12:00:00",
        startServiceAfternoon: department.startServiceAfternoon || "14:00:00",
        endServiceAfternoon: department.endServiceAfternoon || "18:00:00",
        exceptionDay: department.exceptionDay || null,
        active: !department.active, // Inverter o valor
      };
      
      await updateDepartmentMutation.mutateAsync({
        id: department.id,
        data: updateData
      });
      toast.success('Status do departamento atualizado com sucesso!');
    } catch {
      toast.error('Erro ao atualizar status do departamento');
    }
  };

  const handleToggleOnlineScheduling = async (department: Department) => {
    
    if (!department.id) {
      console.error('No department ID found!');
      return;
    }
    
    try {

      const updateData = {
        name: department.name,
        onlineScheduling: !department.onlineScheduling,
        serviceTime: department.serviceTime || "00:30:00",
        startServiceMorning: department.startServiceMorning || "08:00:00",
        endServiceMorning: department.endServiceMorning || "12:00:00",
        startServiceAfternoon: department.startServiceAfternoon || "14:00:00",
        endServiceAfternoon: department.endServiceAfternoon || "18:00:00",
        exceptionDay: department.exceptionDay || null,
        active: department.active,
      };
      
      await updateDepartmentMutation.mutateAsync({
        id: department.id,
        data: updateData
      });
      toast.success('Agendamento online atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar agendamento online');
    }
  };

  const handleDelete = async (department: Department) => {
    setDeleteDialog({
      isOpen: true,
      department: department,
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.department?.id) return;
    
    try {
      await deleteDepartmentMutation.mutateAsync(deleteDialog.department.id);
      toast.success('Departamento excluído com sucesso!');
      setDeleteDialog({ isOpen: false, department: null });
    } catch {
      toast.error('Erro ao excluir departamento');
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, department: null });
  };

  if (isLoading) {
    return (
      <div className="p-4 w-full">
        <Card className="bg-slate-100 dark:bg-slate-950 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Carregando departamentos...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 w-full">
        <Card className="bg-slate-100 dark:bg-slate-950 shadow-md">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                Erro ao carregar departamentos: {error?.message}
              </p>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 w-full overflow-x-auto">
      <Card className="bg-slate-100 dark:bg-slate-950 shadow-md w-full">
        <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl dark:text-white flex items-center gap-2">
              Departamentos
              <Button
                onClick={() => refetch()}
                variant="ghost"
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-2">
              Lista dos departamentos de atendimento ({totalCount} departamentos):
            </CardDescription>
          </div>
          <Button
            asChild
            className="bg-slate-600 hover:bg-slate-800 text-white whitespace-nowrap"
          >
            <Link href="/departments/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Departamento
            </Link>
          </Button>
        </CardHeader>

        <Separator />

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-200 dark:bg-slate-800">
                  <TableHead className="text-left p-3 text-xs sm:text-sm font-medium">
                    Nome
                  </TableHead>
                  <TableHead className="text-center p-3 text-xs sm:text-sm font-medium">
                    Agendamento Online
                  </TableHead>
                  <TableHead className="text-center p-3 text-xs sm:text-sm font-medium">
                    Horário Atendimento
                  </TableHead>
                  <TableHead className="text-center p-3 text-xs sm:text-sm font-medium">
                    Tempo de serviço
                  </TableHead>
                  <TableHead className="text-center p-3 text-xs sm:text-sm font-medium">
                    Dia exceção
                  </TableHead>
                  <TableHead className="text-center p-3 text-xs sm:text-sm font-medium">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments?.map((department: Department) => (
                  <TableRow key={department.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                    <TableCell className="p-3 text-xs sm:text-sm font-medium">
                      {department.name}
                    </TableCell>
                    <TableCell className="p-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          department.onlineScheduling
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {department.onlineScheduling ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell className="p-3 text-xs sm:text-sm text-center">
                      <p>Manhã: {department.startServiceMorning} - {department.endServiceMorning}</p>
                      <p>Tarde: {department.startServiceAfternoon} - {department.endServiceAfternoon}</p>
                    </TableCell>
                    <TableCell className="p-3 text-xs sm:text-sm text-center">
                      {department.serviceTime}
                    </TableCell>
                    <TableCell className="p-3 text-xs sm:text-sm text-center">
                      {formatDateFromDB(department.exceptionDay)}
                    </TableCell>
                    <TableCell className="p-3">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleOnlineScheduling(department)}
                          disabled={updateDepartmentMutation.isPending}
                          className="h-8 w-8 p-0"
                          title={department.onlineScheduling ? 'Desativar agendamento online' : 'Ativar agendamento online'}
                        >
                          <Power className={`h-3 w-3 sm:h-4 sm:w-4 ${
                            department.onlineScheduling ? 'text-red-600' : 'text-green-600'
                          }`} />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <Link href={`/departments/${department.id}`}>
                            <EditIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                          </Link>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(department)}
                          disabled={deleteDepartmentMutation.isPending}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2Icon className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {(!departments || departments.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center p-8 text-gray-500">
                      Nenhum departamento encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o departamento{" "}
              <strong>"{deleteDialog.department?.name}"</strong>?
              <br />
              <br />
              Esta ação não pode ser desfeita e todos os dados relacionados serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteDepartmentMutation.isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteDepartmentMutation.isPending && (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              )}
              Sim, Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DepartmentsWithQuery;
