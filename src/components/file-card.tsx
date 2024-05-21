import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  
import { Doc, Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import Image from "next/image";
import { FileEntity } from '@/types/files';

function FileCardActions({file}: {file: FileEntity}){
    const [ isConfirmOpen, setIsConfirmOpen ] = useState(false);
    const { toast } = useToast();
    const deleteFile = useMutation(api.files.deleteFile);

    return(
    <>
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                <AlertDialogDescription>
                    После подтверждения данный файл будет безвозвратно удалён и не будет подлежать восстановлению.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={async ()=>{
                    await deleteFile({
                        fileId: file.id
                    });
                    toast({
                        variant: "destructive",
                        title: "Файл удалён",
                        description: "Выбранный файл был успешно удалён.",
                    })
                }}>Удалить</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <DropdownMenu>
            <DropdownMenuTrigger><span className="material-symbols-rounded">more_vert</span></DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuItem onClick={()=>{}} className="cursor-pointer gap-2"><span className="material-symbols-rounded gap-2 text-sm">star</span>В избранное</DropdownMenuItem>
                <DropdownMenuSeparator/>
            <DropdownMenuItem onClick={()=>setIsConfirmOpen(true)} className="cursor-pointer text-red-600 gap-2"><span className="material-symbols-rounded gap-2 text-sm">delete</span>Стереть</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
);
}

// function getFileUrl(fileId: Id<"_storage">): string {
//     const getImageUrl = `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
//     return getImageUrl;
// }
function GetImage({ storageId }: { storageId: string }) {
    // e.g. https://happy-animal-123.convex.site/getImage?storageId=456
    const getImageUrl = new URL(`${process.env.NEXT_PUBLIC_CONVEX_URL}/getImage?storageId=${storageId}`);
    return <img src={getImageUrl.href} height="300px" width="auto" />;
  }

export function FileCard({file}: {file: FileEntity}){
    const typeIcons = {
        "image": "planner_banner_ad_pt",
        "pdf": "draft",
        "csv": "table",
        "docx": "draft",
    } as Record<string, string>;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between">
                    <div className="flex flex-row items-center gap-1">
                        {file.name}
                    </div>
                    <FileCardActions file={file}/>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center h-64 overflow-hidden">
                {
                    (file.type === "image" && file.url !== null) && <img className="flex object-cover w-fit h-64 rounded-md" alt={file.name} src={file.url} />
                }
                {
                    (file.type !== "image" || file.url == null ) && <span className="material-symbols-rounded flex w-fit h-fit text-center text-slate-400">{typeIcons[file.type]}</span>
                }
            </CardContent>
            <CardFooter className="mt-5">
                <Button variant={"secondary"} className="w-full" onClick={()=>{file.url?window.open(file.url, "_blank") : ""}}>Скачать</Button>
            </CardFooter>
        </Card>
    );
}