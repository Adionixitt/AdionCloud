import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Dashboard() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<h1 className="text-3xl font-bold">Dashboard page</h1>
			<SignOutButton />
			<a href="/">Go to Home</a>
		</main>
	);
}
