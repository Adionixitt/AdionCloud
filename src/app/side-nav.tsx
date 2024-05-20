"use client"

import { Button } from "@/components/ui/button";
import Link from "../../node_modules/next/link";
import { usePathname } from "../../node_modules/next/navigation";

export function SideNav(){
    const pathname = usePathname();
    return(
        <aside className="flex flex-col pl-6 pr-6 gap-2">
            <Link href="/dashboard/files">
                <Button variant={"link"} className={pathname.includes("/dashboard/files")?"hover:no-underline text-blue-600": "hover:no-underline text-slate-500 hover:text-slate-700"}><span className="material-symbols-rounded mr-2">inventory_2</span>Мои файлы</Button>
            </Link>
            <Link href="/dashboard/favourites">
                <Button variant={"link"} className={pathname.includes("/dashboard/favourites")?"hover:no-underline text-blue-600": "hover:no-underline text-slate-500 hover:text-slate-700"}><span className="material-symbols-rounded mr-2">favorite</span>Избранное</Button>
            </Link>
        </aside>
    );
}