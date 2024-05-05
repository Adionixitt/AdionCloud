"use client"

import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

const formSchema = z.object({
	title: z.string().min(1).max(200),
	file: z.custom<File | null>((val)=> val instanceof File, "Required"),
})

export function UploadButton() {
	const { toast } = useToast();
	const user = useUser();
	let userId: string | undefined = undefined;
	if(user.isLoaded){
		userId = user.user?.id;
	}
	const createFile = useMutation(api.files.createFile);
	const generateUploadUrl = useMutation(api.files.generateUploadUrl);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
		  title: "",
		  file: null,
		},
	  })
    
      
      async function onSubmit(values: z.infer<typeof formSchema>) {
        const fileType = values.file.type;
		console.log(values)
		const postUrl = await generateUploadUrl();
		const result = await fetch(postUrl, {
			method: "POST",
			headers: { "Content-Type": fileType},
			body: values.file,
		  });
		const { storageId } = await result.json();
        const types = {
            "image/png": "image",
            "image/jpeg": "image",
            "image/jpg": "image",
            "application/pdf": "pdf",
            "text/csv": "csv",
        } as Record<string, Doc<'files'>["type"]>;
		try{
			if(!user.user) return;
			await createFile({
				name: values.title,
                type: types[fileType],
				fileId: storageId,
				userId: user.user.id,
			});
			form.reset();
			setIsFileDialogueOpen(false);
			toast({
				variant: "default",
				title: "Успешно",
				  description: "Ваш файл был успешно загружен.",
			});
		} catch (err) {
			toast({
				variant: "destructive",
				title: "Произошла ошибка",
				  description: "При попытке загрузить ваш файл произошла ошибка.",
			});
		}
		
	}

	const [isFileDialogueOpen, setIsFileDialogueOpen] = useState(false);

	return (
        <Dialog open={isFileDialogueOpen} onOpenChange={(isOpen)=>{
            setIsFileDialogueOpen(isOpen);
            form.reset();
        }}>
            <DialogTrigger asChild>
                <Button><span className="material-symbols-rounded mr-2">cloud_upload</span>Загрузить</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle className="mb-6">Загрузка файлов</DialogTitle>
                <DialogDescription>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Введите название файла</FormLabel>
                                <FormControl>
                                    <Input placeholder="Название файла" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="file"
                            render={({ field: {onChange}, ...field }) => (
                                <FormItem>
                                <FormLabel>Выберите файл</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        {...field}
                                        onChange={(e)=>{
                                            if(!e.target.files) return;
                                            onChange(e.target.files[0]);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button
                                disabled={form.formState.isSubmitting}
                                type="submit">
                                    {
                                        form.formState.isSubmitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    }
                                    Загрузить
                            </Button>
                        </form>
                        </Form>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
	);
}
