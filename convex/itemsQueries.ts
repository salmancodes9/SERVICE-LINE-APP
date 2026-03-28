import { query } from "./_generated/server";
import { v } from "convex/values";

export const getItems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("items")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
  },
});

export const searchItems = query({
  args: { query: v.string() },
  handler: async (ctx, { query: searchQuery }) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return [];
    }

    const all = await ctx.db.query("items").collect();
    const matches = all.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );

    matches.sort((a, b) => b.createdAt - a.createdAt);
    return matches;
  },
});
