import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  items: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    imageUrl: v.string(),
    sellerName: v.string(),
    contact: v.string(),
    createdAt: v.number(),
  }).index("by_created_at", ["createdAt"]),
});
