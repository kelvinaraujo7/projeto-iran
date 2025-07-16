"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MoveLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// TanStack Query hooks
import { 
  useDepartmentById, 
  useCreateDepartment, 
  useUpdateDepartment
} from "@/hooks/api/useDepartments";
import { api } from "@/lib/api";

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "O nome deve ter pelo menos 4 caracteres." })
    .max(50, { message: "O nome deve ter no máximo 50 caracteres." }),
  active: z.boolean(),
  onlineScheduling: z.boolean().optional(),
  startServiceMorning: z.string().optional(),
  endServiceMorning: z.string().optional(),
  startServiceAfternoon: z.string().optional(),
  endServiceAfternoon: z.string().optional(),
  exceptionDay: z.string().optional(),
  serviceTime: z.string().optional(),
});

const DepartmentForm = () => {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const isEditing = id && id !== 'new';

  const { 
    data: department, 
    isLoading: isLoadingDepartment,
    error: departmentError 
  } = useDepartmentById(isEditing ? id : undefined);
  
  const createDepartmentMutation = useCreateDepartment();
  const updateDepartmentMutation = useUpdateDepartment();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      active: true,
      onlineScheduling: false,
      startServiceMorning: "",
      endServiceMorning: "",
      startServiceAfternoon: "",
      endServiceAfternoon: "",
      exceptionDay: "",
      serviceTime: "",
    },
  });


  React.useEffect(() => {
    if (department && isEditing) {
      
      const getValue = (camelCase: string, snakeCase: string) => {
        return department[camelCase] || department[snakeCase] || "";
      };
      
      const formatTime = (time: any) => {
        if (!time) return "";
        if (typeof time === 'string') {
          if (time.includes(':')) {
            return time.substring(0, 5); // Get only HH:MM
          }
          return time;
        }
        if (time instanceof Date) {
          return time.toTimeString().slice(0, 5); // HH:MM
        }
        return String(time);
      };

      const formatDate = (date: any) => {
        if (!date) return "";
        if (typeof date === 'string') {
          if (date.includes('T')) {
            return date.split('T')[0];
          }
          return date;
        }
        if (date instanceof Date) {
          return date.toISOString().split('T')[0];
        }
        return String(date);
      };
      
      const formData = {
        name: department.name || "",
        active: department.active ?? true,
        onlineScheduling: department.onlineScheduling ?? false,
        startServiceMorning: formatTime(department.startServiceMorning),
        endServiceMorning: formatTime(department.endServiceMorning),
        startServiceAfternoon: formatTime(department.startServiceAfternoon),
        endServiceAfternoon: formatTime(department.endServiceAfternoon),
        exceptionDay: formatDate(department.exceptionDay),
        serviceTime: formatTime(department.serviceTime),
      };

      form.reset(formData);
    }
  }, [department, isEditing, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
  
    const formatTimeForBackend = (time: string) => {
      if (!time) {
        return "00:00:00";
      }
      if (time.includes(':')) {
        if (time.length === 5) {
          const result = `${time}:00`;
          return result;
        }

        return time;
      }
      return "00:00:00";
    };
    
    try {
      if (isEditing && (department?.id || department?.departmentId?.value)) {
       
        const departmentId = department.id || department.departmentId?.value;
        
        const updateData = {
          name: values.name,
          onlineScheduling: values.onlineScheduling || false,
          serviceTime: formatTimeForBackend(values.serviceTime || "00:30"),
          startServiceMorning: formatTimeForBackend(values.startServiceMorning || "08:00"),
          endServiceMorning: formatTimeForBackend(values.endServiceMorning || "12:00"),
          startServiceAfternoon: formatTimeForBackend(values.startServiceAfternoon || "14:00"),
          endServiceAfternoon: formatTimeForBackend(values.endServiceAfternoon || "18:00"),
          exceptionDay: values.exceptionDay || null,
          active: values.active,
        };
        
        const result = await updateDepartmentMutation.mutateAsync({
          id: departmentId,
          data: updateData
        });
        
        toast.success('Departamento atualizado com sucesso!');
        
        setTimeout(async () => {
          try {

            const verificationResponse = await api.get(`/departments/${departmentId}`);
            
          } catch (error) {
            console.error('Verification check failed:', error);
          }
        }, 2000);
        
        router.push("/departments");
        
      } else {
        
        const createData = {
          name: values.name,
          onlineScheduling: values.onlineScheduling || false,
          serviceTime: formatTimeForBackend(values.serviceTime || "00:30"),
          startServiceMorning: formatTimeForBackend(values.startServiceMorning || "08:00"),
          endServiceMorning: formatTimeForBackend(values.endServiceMorning || "12:00"),
          startServiceAfternoon: formatTimeForBackend(values.startServiceAfternoon || "14:00"),
          endServiceAfternoon: formatTimeForBackend(values.endServiceAfternoon || "18:00"),
          exceptionDay: values.exceptionDay ? new Date(values.exceptionDay) : null,
          active: values.active,
        };
        
        
        const result = await createDepartmentMutation.mutateAsync(createData);
        
        toast.success('Departamento criado com sucesso!');
      
        router.push("/departments");
      }
      
    } catch (error: any) {      
      toast.error(isEditing ? 'Erro ao atualizar departamento' : 'Erro ao criar departamento');
    }
    
  }

  if (isLoadingDepartment && isEditing) {
    return (
      <div className="w-full min-h-screen p-4">
        <Card className="bg-slate-100 dark:bg-slate-950 shadow-lg w-full">
          <CardContent className="p-6 flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Carregando departamento...
          </CardContent>
        </Card>
      </div>
    );
  }


  if (departmentError && isEditing) {
    return (
      <div className="w-full min-h-screen p-4">
        <Card className="bg-slate-100 dark:bg-slate-950 shadow-lg w-full">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                Erro ao carregar departamento
              </p>
              <Button 
                onClick={() => router.push("/departments")} 
                variant="outline"
              >
                <MoveLeft className="h-4 w-4 mr-2" />
                Voltar para lista
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-start px-4 py-8">
      <Card className="bg-slate-100 dark:bg-slate-950 shadow-lg shadow-muted-foreground w-full">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl sm:text-2xl font-bold dark:text-white">
              {isEditing ? 'Editar Departamento' : 'Novo Departamento'}
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              {isEditing 
                ? 'Editar as informações do departamento' 
                : 'Cadastro de novo departamento para atendimento'
              }
            </CardDescription>
          </div>
          <Button
            asChild
            className="bg-slate-600 hover:bg-slate-800 text-white whitespace-nowrap"
          >
            <Link href="/departments" className="flex items-center gap-2">
              <MoveLeft className="w-4 h-4" />
              Voltar
            </Link>
          </Button>
        </CardHeader>

        <Separator className="bg-slate-300 dark:bg-slate-700" />

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              {/* Nome */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-1 sm:col-span-2 md:col-span-4">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do departamento, ex: Atendimento"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hours */}
              {[
                ["startServiceMorning", "Hora Inicial manhã"],
                ["endServiceMorning", "Hora Final manhã"],
                ["startServiceAfternoon", "Hora Inicial tarde"],
                ["endServiceAfternoon", "Hora Final tarde"],
              ].map(([name, label]) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field} 
                          value={typeof field.value === 'string' ? field.value : ''}
                          className="text-center text-sm" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {/* Exception day */}
              <FormField
                control={form.control}
                name="exceptionDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia De Exceção</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="text-center text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Service time */}
              <FormField
                control={form.control}
                name="serviceTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo de Serviço</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                        value={typeof field.value === 'string' ? field.value : ''}
                        className="text-center text-sm" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Online scheduling */}
              <FormField
                control={form.control}
                name="onlineScheduling"
                render={({ field }) => (
                  <FormItem className="col-span-1 mt-2">
                    <FormLabel>Agendamento Online?</FormLabel>
                    <RadioGroup
                      value={field.value ? "T" : "F"}
                      onValueChange={(val) => field.onChange(val === "T")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="T" id="online-t" />
                        <Label htmlFor="online-t">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="F" id="online-f" />
                        <Label htmlFor="online-f">Não</Label>
                      </div>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Button */}
              <div className="col-span-full mt-4">
                <Button
                  type="submit"
                  disabled={createDepartmentMutation.isPending || updateDepartmentMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-800 dark:bg-slate-500 dark:hover:bg-slate-700 text-white font-bold px-6 py-2"
                >
                  {(createDepartmentMutation.isPending || updateDepartmentMutation.isPending) && (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {isEditing ? 'Atualizar' : 'Salvar'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentForm;
