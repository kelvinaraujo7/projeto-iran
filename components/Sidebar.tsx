import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  UserCheck,
  LayoutDashboard,
  BriefcaseBusiness,
  Speech,
  Users,
  Sofa,
  Video,
  Ticket,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logoCofen from "../public/img/250x250.png";
import { ModeToggle } from "./ui/toggle";
import {CalendarDays, ReceiptText, SquaresUnite   } from "lucide-react";
import { Button } from "./ui/button";
// import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  // const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      // await logout()
    } catch (error) {
      console.error('Erro ao fazer logout: ', error)
    }
  };

  return (
    <Command
      className="bg-blue-200 dark:bg-slate-900 mt-5 ml-4 rounded-sm shadow-2xl 
        shadow-card-foreground w-sm h-auto min-h-screen  "
    >
      <div className="flex items-center justify-between p-4">
        <Image
          className="content-center w-1/2 mx-auto mt-4 mb-2"
          src={logoCofen}
          alt="Cofen"
          width={150}
        />
        <ModeToggle />
      </div>

      <CommandList
        className="h-full max-h-auto  rounded-2xl bg-blue-300 dark:bg-slate-950
                inset-shadow-sm inset-shadow-white p-2   "
      >
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Usuário">
          <CommandItem className="flex items-center space-x-2 p-2">
            <User className="h-4 w-4" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {/* {user?.name || user?.preferred_username || 'Usuário'} */}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {/* {user?.email} */}
              </span>
            </div>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />

        <CommandGroup heading="Gestão de Fila">
          
          <CommandItem>
            <UserCheck className="mr-2 h-4 w-4" />
            <Link href="/emissao-ficha">Atendimento</Link>
          </CommandItem>
            <CommandItem>
            <UserCheck className="mr-2 h-4 w-4" />
            <Link href="/emissao-ficha/scheduling">Agendamento</Link>
          </CommandItem>
         
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Gestão de Usuários">
          <CommandItem>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <Link href="/">Dashboard</Link>
          </CommandItem>
          
          <CommandItem>
            <Ticket className="mr-2 h-4 w-4" />
            <Link href="/services2">Fila de atendimento </Link>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Configurações">
          <CommandItem>
            <Speech className="mr-2 h-4 w-4" />
            <Link href="/">Assunto</Link>
          </CommandItem>

          <CommandItem>
            <BriefcaseBusiness className="mr-2 h-4 w-4" />
            <Link href="/departments">Departamentos</Link>
          </CommandItem>

          <CommandItem>
            <BriefcaseBusiness className="mr-2 h-4 w-4" />
            <Link href="/units">Unidades</Link>
          </CommandItem>

          <CommandItem>
            <ReceiptText   className="mr-2 h-4 w-4" />
            <Link href="/tables">Guichês</Link>
          </CommandItem>

          <CommandItem>
            <CalendarDays  className="mr-2 h-4 w-4" />
            <Link href="/holidays">Feriados</Link>
          </CommandItem>

        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Comunicação">

          <CommandItem>
            <Ticket className="mr-2 h-4 w-4" />
            <Link href="/tickets">Informativos</Link>
          </CommandItem>

          <CommandItem>
            <Video className="mr-2 h-4 w-4" />
            <Link href="/videos">Vídeos</Link>
          </CommandItem>

        </CommandGroup>

        <CommandSeparator />

        <CommandItem className="p-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start p-2 h-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair do Sistema
          </Button>
        </CommandItem>

      </CommandList>

    </Command>
  );
};

export default Sidebar;
