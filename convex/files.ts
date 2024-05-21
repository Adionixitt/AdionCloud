import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { fileTypes } from "./schema";
import { FileEntity } from '@/types/files';

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if(!identity){
        throw new ConvexError('You must be logged in to work with files.');
    }
    return await ctx.storage.generateUploadUrl();
  });

export const createFile = mutation({
    args: {
        name: v.string(),
        type: fileTypes,
        fileId: v.id("_storage"),
        userId: v.string(),
    },
    async handler(ctx, args){
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError('You must be logged in to work with files.');
        }
        await ctx.db.insert('files', {
            name: args.name,
            type: args.type,
            fileId: args.fileId,
            userId: args.userId,
        });
    },
});

// export const getFiles = query({
//     args: {
//         userId: v.string(),
//     },
//     async handler(ctx, args){
//         const identity = await ctx.auth.getUserIdentity();
//         if(!identity) { return []; }
//         return ctx.db.query('files').withIndex('by_userId', q =>
//             q.eq('userId', args.userId)
//         ).collect();
//     }
// });

export const getFiles = query({
    args: {
        userId: v.string(),
        query: v.optional(v.string()),
    },
    async handler(ctx, args){
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) { return []; }

        const filesTable = await ctx.db.query('files').withIndex('by_userId', q =>
            q.eq('userId', args.userId)
        ).collect();

        
        const filesEntities: FileEntity[] = [];
        for (const f of filesTable) {
            const url = await ctx.storage.getUrl(f.fileId);
            
            filesEntities.push({
                id: f._id,
                name: f.name,
                type: f.type,
                url: url
            });
        }
        
        const query = args.query;
        if(!query) {
            return filesEntities;
        } else {
            return filesEntities.filter(file => file.name.toLowerCase().includes(query.toLowerCase()));
        }
    }
});

export const deleteFile = mutation({
    args: {fileId: v.id("files")},
    async handler(ctx, args){
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError('You must be logged in to work with files.');
        }
        const file = await ctx.db.get(args.fileId);
        if(!file){
            throw new ConvexError("There's no such file to delete");
        }

        await ctx.db.delete(args.fileId);
    }
});

export const toggleFavourite = mutation({
    args: {fileId: v.id("files")},
    async handler(ctx, args){
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError('You must be logged in to work with files.');
        }
        const file = await ctx.db.get(args.fileId);
        if(!file){
            throw new ConvexError("There's no such file to delete");
        }

        await ctx.db.delete(args.fileId);

        const user = await ctx.db
        .query('users')
        .withIndex("by_tokenIdentifier", (q) => 
            q.eq("tokenIdentifier", identity.tokenIdentifier)
        ).first();

        if(!user) {
            throw new ConvexError
        }
        // const favourites = await ctx.db.query("favourites").withIndex("by_userId_fileId", q => q.eq('userId', ));
    }
});