"use client";

import type { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export function ItemCard({ item }: { item: Doc<"items"> }) {
  const [broken, setBroken] = useState(false);
  const showImg = Boolean(item.imageUrl) && !broken;

  return (
    <article className="item-card">
      <div className="item-image-wrap">
        {showImg ? (
          // URLs are user-supplied; next/image would require remotePatterns for every host.
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            onError={() => setBroken(true)}
          />
        ) : (
          <div className="item-image-placeholder">No image</div>
        )}
      </div>
      <div className="item-body">
        <div className="item-meta">
          <span className="item-price">{formatPrice(item.price)}</span>
          <span className="item-category">{item.category}</span>
        </div>
        <h3 className="item-title">{item.title}</h3>
        <p className="item-desc">{item.description}</p>
        <div className="item-footer">
          <strong>{item.sellerName}</strong>
          {" · "}
          <span>{item.contact}</span>
          {" · "}
          <time dateTime={new Date(item.createdAt).toISOString()}>
            {new Date(item.createdAt).toLocaleDateString()}
          </time>
        </div>
      </div>
    </article>
  );
}
