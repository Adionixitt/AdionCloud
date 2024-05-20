import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { currentUser } from '@clerk/nextjs/server';
import Link from "next/link";

export default async function Home() {
	const user = await currentUser();
	if(!user){
	return (
		<main className="flex w-full min-h-screen flex-row justify-between">
			<div className="flex w-1/2 h-screen justify-center items-center">
				<div className="w-full max-w-md min-sm flex flex-col justify-center p-7 rounded-lg shadow-xl shadow-slate950">
					<span className="material-symbols-rounded text-blue-600 w-full text-center text-xl mb-3">waving_hand</span>
					<h1 className="text-xl font-bold w-full text-center mb-3">Добро пожаловать!</h1>
					<p className="w-full text-md text-slate-500 mb-5">AdionCloud - это удобное облачное хранилище для всех ваших файлов.</p>
					<SignInButton><Button className="p-7 font-bold">Войти в аккаунт</Button></SignInButton>
					<p className="mb-3 mt-3 w-full text-center text-sm text-slate-400">или</p>
					<SignUpButton><Button variant="secondary">Создать новый аккаунт</Button></SignUpButton>
				</div>
			</div>
			<div className="flex w-1/2 h-screen justify-center align-center flex-col">
				<div className="w-full h-1/2">
					<img className="w-full h-full object-cover" src="https://media.architecturaldigest.com/photos/5c9e699c1aeb991ed9e6da2b/16:9/w_2560%2Cc_limit/GettyImages-183996236.jpg"></img>
				</div>
				<div className="w-full h-1/2">
					<img className="w-full h-full object-cover" src="https://www.insidehook.com/wp-content/uploads/2023/07/Helsinki.jpg?fit=1200%2C800"></img>
				</div>
			</div>
		</main>
	);} else {
		return (
			<main className="flex w-full min-h-screen flex-row justify-between">
			<div className="flex w-1/2 h-screen justify-center items-center">
				<div className="w-full max-w-md min-sm flex flex-col justify-center p-7 rounded-lg shadow-xl shadow-slate950">
					<span className="material-symbols-rounded text-blue-600 w-full text-center text-xl mb-3">waving_hand</span>
					<h1 className="text-xl font-bold w-full text-center mb-3">Рады вас видеть, {user.firstName}!</h1>
					<p className="w-full text-md text-slate-500 mb-5">Вы уже авторизованы, вы можете сделать следующее:</p>
					<Button className="p-7 font-bold"><Link href="/dashboard/files">Перейти к моему хранилищу</Link></Button>
					<p className="mb-3 mt-3 w-full text-center text-sm text-slate-400">или</p>
					<SignOutButton><Button variant="secondary">Выйти из аккаунта</Button></SignOutButton>
				</div>
			</div>
			<div className="flex w-1/2 h-screen justify-center align-center flex-col">
				<div className="w-full h-1/2">
					<img className="w-full h-full object-cover" src="https://media.architecturaldigest.com/photos/5c9e699c1aeb991ed9e6da2b/16:9/w_2560%2Cc_limit/GettyImages-183996236.jpg"></img>
				</div>
				<div className="w-full h-1/2">
					<img className="w-full h-full object-cover" src="https://www.insidehook.com/wp-content/uploads/2023/07/Helsinki.jpg?fit=1200%2C800"></img>
				</div>
			</div>
		</main>
		);
	}
}