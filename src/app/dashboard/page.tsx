"use client"

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { useUser } from "@clerk/nextjs";
import { UploadButton } from "@/components/upload-button";
import { FileCard } from "@/components/file-card";
import Image from "next/image";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Dashboard() {
	const user = useUser();
	let userId: string | undefined = undefined;
	if(user.isLoaded){
		userId = user.user?.id;
	}
	const files = useQuery(api.files.getFiles, user.user?.id ? {userId: user.user.id } : "skip");
	const isLoading = files === undefined;
	
	return (
		<main className="flex flex-col min-h-screen w-full p-24 pt-12 pb-12">
			{isLoading && (
				<div>
					<div className="flex w-full justify-between items-center">
						<h1 className="text-4xl text-slate-700 font-extrabold">Хранилище</h1>
					</div>
					<div className="bg-slate-50 p-10 mt-5 rounded-md border border-slate-200 flex flex-col justify-center items-center">
						<ReloadIcon className="mr-2 h-7 w-7 animate-spin mb-5 text-slate-500" />
						<p className="text-bold text-slate-500">Загружаем данные</p>
					</div>
				</div>
			)}
			{files && files.length === 0 && (
				<div>
					<div className="flex w-full justify-between items-center">
						<h1 className="text-4xl text-slate-700 font-extrabold">Хранилище</h1>
					</div>
					<div className="bg-slate-50 p-10 mt-5 rounded-md border border-slate-200">
						<div className="flex flex-col w-full h-full justify-center items-center p-10">
							<Image className="mb-5" alt="An image of two aliens while one of them is getting sucked in the UFO" width="200" height="200" src="/empty.svg" />
							<p className="text-bold text-slate-500 mb-5">Пока что здесь пусто, скорее загрузите свой первый файл!</p>
							<UploadButton/>
						</div>
					</div>
				</div>
			)}
			{files && files.length > 0 && (
				<div>
					<div className="flex w-full justify-between items-center">
						<h1 className="text-4xl text-slate-700 font-extrabold">Хранилище</h1>
						<UploadButton/>
					</div>
					<div className="bg-slate-50 p-10 mt-5 rounded-md border border-slate-200">
						<div className="grid grid-cols-5 justify-evenly gap-4 w-full">
							{files?.map((file)=>{
								return <FileCard key={file.id} file={file}/>
							})}
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
