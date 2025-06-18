"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
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
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
import { MoveLeft } from "lucide-react";
import React from "react";
import { useAppData } from "../../../../context/AppDataContextType ";

const formSchema = z.object({
  name: z
    .string()
    .min(6, { message: "O nome deve ter pelo menos 6 caracteres." })
    .max(16, { message: "O nome deve ter no máximo 16 caracteres." }),
  active: z.boolean(),
  startServiceMorning: z.string().optional(),
  endServiceMorning: z.string().optional(),
  startServiceAfternoon: z.string().optional(),
  endServiceAfternoon: z.string().optional(),
  exceptionDay: z.string().optional(),
});

const TableForm = () => {
  const { departments, adicionarDepartment, editarDepartment } = useAppData();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const department = departments.find((d) => String(d.id) === id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: department?.name || "",
      active: department ? department.status === "Ativo" : true,
      startServiceMorning: department?.startServiceMorning ?? "",
      endServiceMorning: department?.endServiceMorning ?? "",
      startServiceAfternoon: department?.startServiceAfternoon ?? "",
      endServiceAfternoon: department?.endServiceAfternoon ?? "",
      exceptionDay: department?.exceptionDay ?? "",
    },
  });

  React.useEffect(() => {
    if (department) {
      form.reset({
        name: department.name,
        active: department.status === "Ativo",
      });
    }
  }, [department]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newDepartment = {
      id: department?.id ?? Date.now(),
      name: values.name,
      status: values.active ? "Ativo" : "Desativado",
      startServiceMorning: values.startServiceMorning,
      endServiceMorning: values.endServiceMorning,
      startServiceAfternoon: values.startServiceAfternoon,
      endServiceAfternoon: values.endServiceAfternoon,
      exceptionDay: values.exceptionDay,
    };

    if (department) {
      editarDepartment(department.id, newDepartment);
    } else {
      adicionarDepartment(newDepartment);
    }

    router.push("/pages/departments");
  }

  return (
    <Card className="bg-slate-100 dark:bg-slate-950 mb-4 ml-10 mr-2 rounded-sm shadow-2xl shadow-card-foreground">
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle className="font-bold text-2xl w-1/2 dark:text-white">
            Departamentos
          </CardTitle>
          <CardDescription className="mt-5">
            Cadastro de departamentos para atendimento:
          </CardDescription>
        </div>
        <div>
          <Button
            asChild
            className="bg-slate-500 hover:bg-slate-700 hover:text-white"
          >
            <Link href="/pages/departments">
              <MoveLeft className="mr-2" />
              Voltar
            </Link>
          </Button>
        </div>
      </CardHeader>

      <Separator className="bg-slate-300" />

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-4  gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome do departamento, exemplo: Departamento (x)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startServiceMorning"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Hora Inicial manhã</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      style={{
                        textAlign: "center",
                        fontSize: "14px",
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endServiceMorning"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Hora Final manhã</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      style={{
                        textAlign: "center",
                        fontSize: "14px",
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startServiceAfternoon"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Hora Inicial tarde</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      style={{
                        textAlign: "center",
                        fontSize: "14px",
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endServiceAfternoon"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Hora Final tarde</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      style={{
                        textAlign: "center",
                        fontSize: "14px",
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="exceptionDay"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Dia De Exceção</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      style={{
                        textAlign: "center",
                        fontSize: "14px",
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="col-start-1 col-span-1 mt-3">
                  <FormLabel>Ativo?</FormLabel>
                  <RadioGroup
                    value={field.value ? "T" : "F"}
                    onValueChange={(val) => field.onChange(val === "T")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="T" id="option-t" />
                      <Label htmlFor="option-t">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="F" id="option-f" />
                      <Label htmlFor="option-f">Não</Label>
                    </div>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-start-1 col-span-1 mt-3">
              <Button
                type="submit"
                className="mt-1 w-4/6 bg-blue-600 hover:bg-blue-800 dark:bg-slate-500 dark:hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
              >
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TableForm;
