"use client";

import { ItemCard } from "@/components/ItemCard";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { FormEvent, useMemo, useState } from "react";

export function Marketplace() {
  const [search, setSearch] = useState("");
  const trimmed = search.trim();

  const allItems = useQuery(api.itemsQueries.getItems, {});
  const searchResults = useQuery(
    api.itemsQueries.searchItems,
    trimmed ? { query: trimmed } : "skip"
  );

  const items = useMemo(() => {
    if (trimmed) return searchResults;
    return allItems;
  }, [trimmed, allItems, searchResults]);

  const addItem = useMutation(api.itemsMutations.addItem);
  const generateDescription = useAction(api.aiActions.generateDescription);
  const priceSuggestion = useAction(api.aiActions.priceSuggestion);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [contact, setContact] = useState("");
  const [condition, setCondition] = useState("");

  const [busy, setBusy] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState<string | null>(null);

  const loading = items === undefined;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormOk(null);
    const priceNum = parseFloat(price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setFormError("Enter a valid price.");
      return;
    }

    setBusy("submit");
    try {
      await addItem({
        title,
        description,
        price: priceNum,
        category,
        imageUrl,
        sellerName,
        contact,
      });
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImageUrl("");
      setSellerName("");
      setContact("");
      setCondition("");
      setFormOk("Listing published.");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not add item.");
    } finally {
      setBusy(null);
    }
  }

  async function onSuggestDescription() {
    setFormError(null);
    if (!title.trim()) {
      setFormError("Add a title first.");
      return;
    }
    setBusy("desc");
    try {
      const text = await generateDescription({ title });
      setDescription(text);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Description suggestion failed."
      );
    } finally {
      setBusy(null);
    }
  }

  async function onSuggestPrice() {
    setFormError(null);
    if (!title.trim()) {
      setFormError("Add a title first.");
      return;
    }
    if (!condition.trim()) {
      setFormError("Add a condition (e.g. “like new”) for price suggestion.");
      return;
    }
    setBusy("price");
    try {
      const { price: suggested } = await priceSuggestion({
        title,
        condition,
      });
      setPrice(String(suggested));
      setFormOk("Price suggestion applied. Adjust if needed.");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Price suggestion failed."
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="app-title">
            Campus <span>Exchange</span>
          </h1>
          <p className="app-subtitle">
            Student marketplace — list textbooks, gear, and more.
          </p>
        </div>
        <div className="search-row">
          <input
            type="search"
            placeholder="Search title or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search items"
          />
        </div>
      </header>

      <div className="layout-main">
        <section className="items-section">
          <h2>{trimmed ? "Search results" : "All listings"}</h2>
          {loading ? (
            <p className="loading-text">Loading listings…</p>
          ) : items.length === 0 ? (
            <div className="empty-state">
              {trimmed
                ? "No matches. Try another search."
                : "No items yet. Be the first to list something."}
            </div>
          ) : (
            <div className="item-grid">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </section>

        <aside className="form-panel">
          <h2>List an item</h2>
          <form onSubmit={onSubmit}>
            <div className="form-field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={200}
              />
            </div>
            <div className="form-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={5000}
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onSuggestDescription}
                disabled={busy !== null}
              >
                {busy === "desc" ? "Generating…" : "AI description"}
              </button>
            </div>
            <div className="form-field">
              <label htmlFor="price">Price (USD)</label>
              <input
                id="price"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="condition">Condition (for AI price)</label>
              <input
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="e.g. Like new, some highlights"
                maxLength={300}
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onSuggestPrice}
                disabled={busy !== null}
              >
                {busy === "price" ? "Suggesting…" : "AI price"}
              </button>
            </div>
            <div className="form-field">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                maxLength={100}
              />
            </div>
            <div className="form-field">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                maxLength={2000}
                placeholder="https://…"
              />
            </div>
            <div className="form-field">
              <label htmlFor="sellerName">Your name</label>
              <input
                id="sellerName"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                required
                maxLength={200}
              />
            </div>
            <div className="form-field">
              <label htmlFor="contact">Contact</label>
              <input
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                maxLength={500}
                placeholder="Email or phone"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={busy !== null}
            >
              {busy === "submit" ? "Publishing…" : "Publish listing"}
            </button>
          </form>
          {formError ? (
            <p className="message error" role="alert">
              {formError}
            </p>
          ) : null}
          {formOk ? (
            <p className="message success" role="status">
              {formOk}
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
