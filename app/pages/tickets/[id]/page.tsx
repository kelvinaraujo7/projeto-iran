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
import { useAppData } from "@/context/AppDataContextType ";

const formSchema = z.object({
  name: z
    .string()
    .min(6, {
      message: "O nome deve ter pelo menos 6 caracteres.",
    })
    .max(16, {
      message: "O nome deve ter no máximo 16 caracteres.",
    }),
  active: z.boolean(),
});

const TableForm = () => {
  const { tickets, adicionarTicket, editarTicket } = useAppData();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const ticket = tickets.find((t) => String(t.id) === id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ticket?.name || "",
      active: ticket ? ticket.status === "Ativo" : true,
    },
  });

  React.useEffect(() => {
    if (ticket) {
      form.reset({
        name: ticket.name,
        active: ticket.status === "Ativo",
      });
    }
  }, [ticket]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (ticket) {
      editarTicket(ticket.id, {
        name: values.name,
        status: values.active ? "Ativo" : "Desativado",
      });
    } else {
      adicionarTicket({
        id: Date.now(),
        name: values.name,
        status: values.active ? "Ativo" : "Desativado",
      });
    }
    router.push("/pages/tickets");
  }

  return (
    <Card className="bg-slate-100 dark:bg-slate-950 mb-4 ml-10 mr-2 rounded-sm shadow-2xl shadow-card-foreground">
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle className="font-bold text-2xl w-1/2 dark:text-white">
            Bilhetes
          </CardTitle>
          <CardDescription>Cadastro bilhete de atendimento</CardDescription>
        </div>
        <div>
          <Button
            asChild
            className="bg-slate-500 hover:bg-slate-700 hover:text-white"
          >
            <Link href="/pages/tickets">
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
            className="grid grid-flow-row-dense grid-cols-6 gap--8 gap-y-4"
          >
            <div className="col-start-1 col-end-7">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do bilhete, exemplo: Bilhete 01"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-start-1 col-end-4" >
                  <FormLabel >Data inicial</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-start-1 col-end-2" >
                  <FormLabel>Data final</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="col-start-1 col-end-3" >
                  <FormLabel>Ativo?</FormLabel>
                  <RadioGroup
                    value={field.value ? "T" : "F"}
                    onValueChange={(val) => field.onChange(val === "T")}
                    className="flex items-center space-x-2"
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
            <Button
              type="submit"
              className="mt-10 w-2/6 bg-blue-600 hover:bg-blue-800 dark:bg-slate-500 dark:hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
            >
              Salvar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TableForm;
