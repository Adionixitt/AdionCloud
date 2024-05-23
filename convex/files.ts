import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { fileTypes } from "./schema";
import { FileEntity } from '@/types/files';
import { Id } from "./_generated/dataModel";

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
        favourites: v.optional(v.boolean()),
    },
    async handler(ctx, args){
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) { return []; }

        let filesTable = await ctx.db.query('files').withIndex('by_userId', q =>
            q.eq('userId', args.userId)
        ).collect();

        
        let filesEntities: FileEntity[] = [];
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
        if(query) {
            return filesEntities.filter(file => file.name.toLowerCase().includes(query.toLowerCase()));
        }

        if(args.favourites){
            const user = await ctx.db
                .query('users')
                .withIndex("by_tokenIdentifier", (q) => 
                    q.eq("tokenIdentifier", identity.tokenIdentifier)
                ).first();
            if(!user){
                return filesEntities;
            }
            const favourites = await ctx.db.query("favourites").withIndex("by_userId_fileId", q =>
                q.eq("userId", user._id)
            ).collect();
            filesEntities = filesEntities.filter((file) => favourites.some((favourite) => favourite.fileId === file._id))
        }

        return filesEntities;
    }
});

export const deleteFile = mutation({
    args: {fileId: v.id("files")},
    async handler(ctx, args){
        // const access = await hasAccessToFile(ctx, args.fileId);
        // if(!access){
        //     throw new ConvexError('No access to file');
        // }

        await ctx.db.delete(args.fileId);
    }
});

export const toggleFavourite = mutation({
    args: {fileId: v.id("files")},
    async handler(ctx, args){
        const access = await hasAccessToFile(ctx, args.fileId);
        if(!access){
            throw new ConvexError('No access to file');
        }
        
        const favourite = await ctx.db
        .query("favourites")
        .withIndex("by_userId_fileId", (q) =>
        q
            .eq('userId', access.user._id)
            .eq('fileId', access.file._id)
        )
        .first();

        if(!favourite){
            await ctx.db.insert('favourites', {
                fileId: access.file._id,
                userId: access.user._id,
            });
        } else {
            await ctx.db.delete('favourites', favourite._id);
        }
    }
});

async function hasAccessToFile(ctx: QueryCtx | MutationCtx, fileId: Id<"files">){
    const identity = await ctx.auth.getUserIdentity();
    console.log(identity.tokenIdentifier);
    if(!identity){
        return null;
    }
    const file = await ctx.db.get(fileId);
    if(!file){
        return null;
    }

    await ctx.db.delete(fileId);

    const user = await ctx.db
    .query('users')
    .withIndex("by_tokenIdentifier", (q) => 
        q.eq("tokenIdentifier", identity.tokenIdentifier)
    ).first();

    if(!user) {
        return null;
    }

    return {user, file};
}