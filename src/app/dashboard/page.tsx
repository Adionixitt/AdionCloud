import { SignOutButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Dashboard() {
	return (
		<main className="flex min-h-screen w-full">
			<nav className="flex fixed top-0 left-0 w-full p-3 shadow-md shadow-slate-300">
				<UserButton/>
			</nav>
		</main>
	);
}
