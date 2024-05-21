"use client"
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { useUser } from "@clerk/nextjs";
import { UploadButton } from "@/components/upload-button";
import { FileCard } from "@/components/file-card";
import Image from "next/image";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { SearchBar } from "../search-bar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "../../../node_modules/next/link";

export default function FileBrowser({title}: {title:string}){
    const user = useUser();
	let userId: string | undefined = undefined;
	if(user.isLoaded){
		userId = user.user?.id;
	}

	const [query, setQuery] = useState("");

	const files = useQuery(api.files.getFiles, user.user?.id ? {userId: user.user.id, query: query } : "skip");
	const isLoading = files === undefined;

	if(isLoading){
		return (
			<div>
				<div className="flex w-full justify-between items-center">
					<h1 className="text-4xl text-slate-700 font-extrabold">{title}</h1>
					<SearchBar query={query} setQuery={setQuery}/>
					<UploadButton/>
				</div>
				<div className="bg-slate-50 p-10 mt-5 rounded-md border border-slate-200 flex flex-col justify-center items-center">
					<ReloadIcon className="mr-2 h-7 w-7 animate-spin mb-5 text-slate-500" />
					<p className="text-bold text-slate-500">Загружаем данные</p>
				</div>
			</div>
		);
	} else if (files && !query && files.length === 0 ) {
		return(
			<div>
					<div className="flex w-full justify-between items-center">
						<h1 className="text-4xl text-slate-700 font-extrabold">{title}</h1>
					</div>
					<div className="bg-slate-50 p-10 mt-5 rounded-md border border-slate-200">
						<div className="flex flex-col w-full h-full justify-center items-center p-10">
							<Image className="mb-5" alt="An image of two aliens while one of them is getting sucked in the UFO" width="200" height="200" src="/empty.svg" />
							<p className="text-bold text-slate-500 mb-5">Пока что здесь пусто, скорее загрузите свой первый файл!</p>
							<UploadButton/>
						</div>
					</div>
				</div>
		);
	} else { // {files && ()}
		return (
		<div>
			<div className="flex w-full justify-between items-center">
				<h1 className="text-4xl text-slate-700 font-extrabold">{title}</h1>
				<SearchBar query={query} setQuery={setQuery}/>
				<UploadButton/>
			</div>
			<div className="bg-slate-50 p-10 mt-5 rounded-md border border-slate-200">
				<div className={"justify-evenly gap-4 w-full "+(files.length > 0?"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4":"")}>
					{files?.map((file)=>{
						return <FileCard key={file.id} file={file}/>
					})}
					{files.length === 0 && (
						<div className="flex flex-col w-full h-full justify-center items-center align-center p-10">
							<Image className="mb-5" alt="An image of two aliens while one of them is getting sucked in the UFO" width="200" height="200" src="/empty.svg" />
							<p className="text-bold text-slate-500 mb-5">Не удалось найти файлы с названием "{query}"!</p>
						</div>
					)}
				</div>
			</div>
		</div>
		);
	}
}