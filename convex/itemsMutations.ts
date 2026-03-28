import { mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  requireNonEmptyString,
  requirePositivePrice,
} from "./lib/validation";

export const addItem = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    imageUrl: v.string(),
    sellerName: v.string(),
    contact: v.string(),
  },
  handler: async (ctx, args) => {
    requirePositivePrice(args.price);

    const title = requireNonEmptyString("title", args.title, 200);
    const description = requireNonEmptyString(
      "description",
      args.description,
      5000
    );
    const category = requireNonEmptyString("category", args.category, 100);
    const imageUrl = requireNonEmptyString("imageUrl", args.imageUrl, 2000);
    const sellerName = requireNonEmptyString("sellerName", args.sellerName, 200);
    const contact = requireNonEmptyString("contact", args.contact, 500);

    const createdAt = Date.now();

    const id = await ctx.db.insert("items", {
      title,
      description,
      price: args.price,
      category,
      imageUrl,
      sellerName,
      contact,
      createdAt,
    });

    return id;
  },
});
