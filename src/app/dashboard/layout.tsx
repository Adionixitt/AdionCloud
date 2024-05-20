import { Button } from "@/components/ui/button";
import Link from "../../../node_modules/next/link";
import { SideNav } from "../side-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
		<div className="flex flex-row justify-between mx-auto w-full gap-8 pt-24 p-6">
			<SideNav/>
			<div className="w-full">
				<main className="flex flex-col min-h-screen w-full">
                    {children}
			    </main>
			</div>
		</div>
	);
}