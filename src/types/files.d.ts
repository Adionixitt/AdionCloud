import { Id } from '../../convex/_generated/dataModel';

export type FileEntity = {
    id: Id<"files">,
    name: string,
    type: "image" | "csv" | "pdf",
    url: string | null
}