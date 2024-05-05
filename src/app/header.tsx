import { SignedIn, UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/logo";

export function Header(){
    return (
        <nav className="flex justify-between justify-items-start items-center w-full p-3 pl-5 pr-5 shadow-md shadow-slate-100 min-h-16">
            <Logo/>
            <SignedIn>
                    <UserButton/>
            </SignedIn>
		</nav>
    );
}