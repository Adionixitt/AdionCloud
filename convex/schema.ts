import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileTypes = v.union(
  v.literal("image"),
  v.literal("csv"),
  v.literal("pdf")
  );

export default defineSchema({
  files: defineTable({
    name: v.string(),
    type: fileTypes,
    fileId: v.id("_storage"),
    userId: v.string(),
  }).index("by_userId", ['userId']),
  favourites: defineTable({
    fileId: v.id("files"),
    userId: v.id("users")
  }).index("by_userId_fileId", ['userId', 'fileId']),
});
