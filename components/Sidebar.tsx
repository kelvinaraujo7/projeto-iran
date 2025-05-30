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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logoCofen from "../img/250x250.png";
import { ModeToggle } from "./ui/toggle";

const Sidebar = () => {
  return (
    <Command
      className="bg-blue-200 dark:bg-slate-900 mt-5 ml-4 rounded-sm shadow-2xl 
        shadow-card-foreground w-sm h-screen"
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
                inset-shadow-sm inset-shadow-white p-2"
      >
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Gestão de Fila">
          <CommandItem>
            <UserCheck className="mr-2 h-4 w-4" />
            <Link href="/">Atendimento</Link>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Gestão de Usuários">
          <CommandItem>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <Link href="/">Dashboard</Link>
          </CommandItem>
          <CommandItem>
            <Users className="mr-2 h-4 w-4" />
            <Link href="/">Usuários</Link>
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
            <Link href="/">Depatamento</Link>
          </CommandItem>
          <CommandItem>
            <BriefcaseBusiness className="mr-2 h-4 w-4" />
            <Link href="/pages/states">Estados</Link>
          </CommandItem>
          <CommandItem>
            <BriefcaseBusiness className="mr-2 h-4 w-4" />
            <Link href="/pages/units">Unidades</Link>
          </CommandItem>
          <CommandItem>
            <BriefcaseBusiness className="mr-2 h-4 w-4" />
            <Link href="/pages/tickets">Bilhetes</Link>
          </CommandItem>
          <CommandItem>
            <Sofa className="mr-2 h-4 w-4" />
            <Link href="/pages/tables">Guichês</Link>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Comunicação">
          <CommandItem>
            <Ticket className="mr-2 h-4 w-4" />
            <Link href="/3">Informativos</Link>
          </CommandItem>
          <CommandItem>
            <Video className="mr-2 h-4 w-4" />
            <Link href="/2">Vídeos</Link>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default Sidebar;
