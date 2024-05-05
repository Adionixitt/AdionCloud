import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";


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
        fileId: v.id("_storage"),
    },
    async handler(ctx, args){
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError('You must be logged in to work with files.');
        }
        await ctx.db.insert('files', {
            name: args.name,
            fileId: args.fileId,
        });
    },
});

export const getFiles = query({
    args: {},
    async handler(ctx, args){
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) { return []; }
        return ctx.db.query('files').collect()
    }
});