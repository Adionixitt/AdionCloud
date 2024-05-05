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

function FileCardActions({file}: {file: Doc<"files">}){
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
                        fileId: file._id
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
                <DropdownMenuItem onClick={()=>setIsConfirmOpen(true)} className="cursor-pointer text-red-600"><span className="material-symbols-rounded gap-2 text-sm">delete</span>Стереть</DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className="cursor-pointer"><span className="material-symbols-rounded gap-2 text-sm">cloud_download</span>Скачать</DropdownMenuItem>
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

export function FileCard({file}: {file: Doc<"files">}){
    const typeIcons = {
        "image": "planner_banner_ad_pt",
        "pdf": "draft",
        "csv": "table",
    } as Record<string, string>;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between">
                    <div className="flex flex-row items-center gap-1">
                        <span className="material-symbols-rounded w-full text-center text-slate-400">{typeIcons[file.type]}</span>
                        {file.name}
                    </div>
                    <FileCardActions file={file}/>
                </CardTitle>
            </CardHeader>
            {
                file.type === "image" && GetImage({storageId: file.fileId})
            }
            <CardFooter>
                <Button variant={"secondary"} className="w-full">Скачать</Button>
            </CardFooter>
        </Card>
    );
}