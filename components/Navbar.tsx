import Image from 'next/image';
import Link from 'next/link';
import logoCofen from '../img/250x250.png';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
    return ( 
        <div className="bg-primary dark: bg-slate-700 text-white py-2 px-5 flex justify-between">
            <Link href="/" className="flex items-center">
                <Image
                    src={logoCofen}  alt='Cofen' width={100}
                />
            </Link>

            <DropdownMenu>
                <DropdownMenuTrigger className='focus:outline-none'>
                     <Avatar>
                        <AvatarImage src="https://avat2ars.githubusercontent.com/u/11221069?v=4" alt="@shadcn" />
                        <AvatarFallback className='text-black font-bold'>IV</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link href="/profile" className="w-full">
                            Perfil
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/auth" className="w-full">
                            Sair
                        </Link>
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

        </div>
     );
}
 
export default Navbar;