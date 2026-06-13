import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { valuateItem, type Valuation } from "@/lib/valuation.functions";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Inventory · Treasure" },
      { name: "description", content: "Your bold, colorful resale inventory dashboard." },
    ],
  }),
  component: Dashboard,
});

type Category = {
  id: string;
  name: string;
  color: string;
  emoji: string;
};

type Item = {
  id: string;
  user_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  image_url: string; // storage path
  estimated_low: number | null;
  estimated_high: number | null;
  confidence: string | null;
  reasoning: string | null;
  status: string;
  created_at: string;
};

const SHAPE_COLORS = ["#FF3EA5", "#FFD60A", "#3D7CFF", "#00D9A3", "#FF8A3D", "#A06BFF"];
const EMOJIS = ["✨", "👕", "💎", "🪞", "👜", "🕯️", "📿", "🧥", "🎩", "🌸", "🛍️", "🎨"];

function Dashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [showUpload, setShowUpload] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);

  // load session + initial data
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) return;
      setUserId(session.user.id);
      setEmail(session.user.email ?? "");
      await Promise.all([loadCategories(), loadItems()]);
    })();
  }, []);

  async function loadCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) return toast.error(error.message);
    setCategories((data ?? []) as Category[]);
  }

  async function loadItems() {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    const list = (data ?? []) as Item[];
    setItems(list);

    // batch-sign URLs
    const paths = list.map((i) => i.image_url).filter(Boolean);
    if (paths.length) {
      const { data: signed } = await supabase.storage
        .from("item-photos")
        .createSignedUrls(paths, 60 * 60);
      const map: Record<string, string> = {};
      signed?.forEach((s, idx) => {
        if (s.signedUrl) map[paths[idx]] = s.signedUrl;
      });
      setSignedUrls(map);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  const filtered = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((i) => i.category_id === activeCategory);
  }, [items, activeCategory]);

  const totalLow = items.reduce((a, i) => a + (Number(i.estimated_low) || 0), 0);
  const totalHigh = items.reduce((a, i) => a + (Number(i.estimated_high) || 0), 0);

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 pt-6 pb-2 sm:px-8">
        <div className="flex items-center gap-2">
          <div className="grid size-10 place-items-center rounded-2xl neo-border neo-shadow-sm bg-hot text-2xl">💎</div>
          <div>
            <div className="font-display text-xl leading-none tracking-tight">TREASURE</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{email}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewCategory(true)}
            className="neo-press rounded-full neo-border neo-shadow-sm bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider"
          >
            + Category
          </button>
          <button
            onClick={signOut}
            className="neo-press rounded-full neo-border neo-shadow-sm bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Totals */}
      <section className="mx-auto mt-6 max-w-6xl px-5 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard color="bg-hot text-white" label="Items tracked" value={items.length.toString()} />
          <StatCard color="bg-sun" label="Inventory value (low)" value={`$${totalLow.toFixed(0)}`} />
          <StatCard color="bg-lime" label="Inventory value (high)" value={`$${totalHigh.toFixed(0)}`} />
        </div>
      </section>

      {/* Category chips */}
      <section className="mx-auto mt-8 max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap gap-2">
          <Chip active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
            <span className="mr-1">🌈</span> All <span className="ml-2 font-mono text-[11px] opacity-70">{items.length}</span>
          </Chip>
          {categories.map((c) => {
            const count = items.filter((i) => i.category_id === c.id).length;
            return (
              <Chip
                key={c.id}
                active={activeCategory === c.id}
                onClick={() => setActiveCategory(c.id)}
                accent={c.color}
              >
                <span className="mr-1">{c.emoji}</span>
                {c.name}
                <span className="ml-2 font-mono text-[11px] opacity-70">{count}</span>
              </Chip>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto mt-8 max-w-6xl px-5 sm:px-8">
        {filtered.length === 0 ? (
          <EmptyState onAdd={() => setShowUpload(true)} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, idx) => {
              const cat = categories.find((c) => c.id === item.category_id);
              return (
                <ItemCard
                  key={item.id}
                  item={item}
                  category={cat}
                  signedUrl={signedUrls[item.image_url]}
                  index={idx}
                  onChanged={loadItems}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Floating snap button */}
      <button
        onClick={() => setShowUpload(true)}
        className="neo-press fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full neo-border neo-shadow-lg bg-hot px-8 py-5 font-display text-base uppercase tracking-wider text-white"
      >
        📸 Snap & Value
      </button>

      {showUpload && userId && (
        <UploadModal
          userId={userId}
          categories={categories}
          onClose={() => setShowUpload(false)}
          onSaved={async () => {
            setShowUpload(false);
            await loadItems();
          }}
        />
      )}

      {showNewCategory && userId && (
        <NewCategoryModal
          userId={userId}
          onClose={() => setShowNewCategory(false)}
          onSaved={async () => {
            setShowNewCategory(false);
            await loadCategories();
          }}
        />
      )}
    </div>
  );
}

function StatCard({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className={`neo-tile p-5 ${color}`}>
      <div className="font-mono text-[10px] uppercase tracking-widest opacity-80">{label}</div>
      <div className="mt-2 font-display text-4xl leading-none">{value}</div>
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
  accent,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  accent?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={active && accent ? { backgroundColor: accent, color: "#fff" } : undefined}
      className={`neo-press flex items-center rounded-full neo-border px-4 py-2 text-sm font-bold ${
        active ? "neo-shadow bg-foreground text-background" : "neo-shadow-sm bg-card"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="neo-tile mx-auto max-w-xl bg-sun p-10 text-center animate-pop">
      <div className="text-6xl">🛍️</div>
      <h2 className="mt-4 font-display text-3xl uppercase tracking-tight">No treasures yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">Snap your first item and watch the AI tell you what it's worth.</p>
      <button
        onClick={onAdd}
        className="neo-press mt-6 rounded-full neo-border neo-shadow bg-hot px-6 py-3 font-display text-base uppercase tracking-wide text-white"
      >
        📸 Snap your first
      </button>
    </div>
  );
}

const STATUSES: Array<{ key: string; label: string; color: string }> = [
  { key: "sourcing", label: "Sourcing", color: "bg-sun" },
  { key: "listed", label: "Listed", color: "bg-electric text-white" },
  { key: "sold", label: "Sold", color: "bg-lime" },
];

function ItemCard({
  item,
  category,
  signedUrl,
  index,
  onChanged,
}: {
  item: Item;
  category?: Category;
  signedUrl?: string;
  index: number;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState(false);

  async function cycleStatus() {
    const i = STATUSES.findIndex((s) => s.key === item.status);
    const next = STATUSES[(i + 1) % STATUSES.length];
    setBusy(true);
    const { error } = await supabase.from("items").update({ status: next.key }).eq("id", item.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else onChanged();
  }

  async function remove() {
    if (!confirm("Delete this item?")) return;
    setBusy(true);
    await supabase.storage.from("item-photos").remove([item.image_url]);
    const { error } = await supabase.from("items").delete().eq("id", item.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else onChanged();
  }

  const status = STATUSES.find((s) => s.key === item.status) ?? STATUSES[0];

  return (
    <div className="neo-tile overflow-hidden animate-pop" style={{ animationDelay: `${Math.min(index * 40, 240)}ms` }}>
      <div className="relative aspect-square overflow-hidden border-b-[3px] border-foreground bg-muted">
        {signedUrl ? (
          <img src={signedUrl} alt={item.name} className="size-full object-cover" />
        ) : (
          <div className="grid size-full place-items-center font-mono text-xs text-muted-foreground">loading…</div>
        )}
        {category && (
          <div
            className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full neo-border px-2.5 py-1 text-[11px] font-bold"
            style={{ backgroundColor: category.color, color: "#fff" }}
          >
            <span>{category.emoji}</span> {category.name}
          </div>
        )}
        <button
          onClick={cycleStatus}
          disabled={busy}
          className={`neo-press absolute right-3 top-3 rounded-full neo-border neo-shadow-sm px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${status.color}`}
        >
          {status.label}
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg leading-tight tracking-tight">{item.name}</h3>
          {item.estimated_low != null && item.estimated_high != null && (
            <div className="shrink-0 rounded-md bg-foreground px-2 py-1 font-mono text-[11px] text-background">
              ${Number(item.estimated_low).toFixed(0)}–${Number(item.estimated_high).toFixed(0)}
            </div>
          )}
        </div>
        {item.description && <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>}
        {item.reasoning && (
          <p className="mt-3 border-t pt-3 text-[12px] italic text-muted-foreground">
            <span className="font-mono uppercase tracking-widest not-italic">Why:</span> {item.reasoning}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between text-[11px]">
          <span className="font-mono uppercase tracking-widest text-muted-foreground">
            Confidence: {item.confidence ?? "—"}
          </span>
          <button onClick={remove} disabled={busy} className="font-mono uppercase tracking-widest text-destructive hover:underline">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadModal({
  userId,
  categories,
  onClose,
  onSaved,
}: {
  userId: string;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [valuation, setValuation] = useState<Valuation | null>(null);
  const [categoryId, setCategoryId] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "valuing" | "saving">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const valuate = useServerFn(valuateItem);

  function handleFile(f: File) {
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setValuation(null);
  }

  async function runValuation() {
    if (!file) return;
    setStatus("valuing");
    try {
      const base64 = await fileToBase64(file);
      const result = await valuate({ data: { imageBase64: base64, mimeType: file.type, hint } });
      setValuation(result);
      // auto-pick best matching category by name
      const match = categories.find((c) =>
        c.name.toLowerCase().includes(result.category.replace("_", " ").split(" ")[0])
      );
      if (match) setCategoryId(match.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Valuation failed");
    } finally {
      setStatus("idle");
    }
  }

  async function save() {
    if (!file || !valuation) return;
    setStatus("saving");
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("item-photos").upload(path, file, {
        contentType: file.type,
      });
      if (upErr) throw upErr;

      const { error: insErr } = await supabase.from("items").insert({
        user_id: userId,
        category_id: categoryId || null,
        name: valuation.name,
        description: valuation.description,
        image_url: path,
        estimated_low: valuation.estimated_low,
        estimated_high: valuation.estimated_high,
        confidence: valuation.confidence,
        reasoning: valuation.reasoning,
        status: "sourcing",
      });
      if (insErr) throw insErr;

      toast.success("Added to your inventory!");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="font-display text-3xl uppercase tracking-tight">Snap & Value</h2>
      <p className="mt-1 text-sm text-muted-foreground">Upload a photo and let the AI do the appraising.</p>

      <div className="mt-5 space-y-4">
        {/* File picker */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {previewUrl ? (
            <div className="relative overflow-hidden rounded-2xl neo-border">
              <img src={previewUrl} alt="preview" className="aspect-square w-full object-cover" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-3 right-3 neo-press rounded-full neo-border neo-shadow-sm bg-card px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
              >
                Replace
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="neo-press grid w-full place-items-center rounded-2xl neo-border bg-sun py-12 text-center"
            >
              <div className="text-5xl">📸</div>
              <div className="mt-2 font-display text-lg uppercase">Choose photo</div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">tap to open camera or gallery</div>
            </button>
          )}
        </div>

        <div>
          <label className="font-mono text-[11px] uppercase tracking-widest">Hint (optional)</label>
          <input
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder="e.g. 1970s silk blouse, label says Vera"
            className="mt-1 w-full rounded-xl neo-border bg-background px-4 py-2.5 text-sm outline-none focus:bg-sun"
          />
        </div>

        {!valuation && (
          <button
            disabled={!file || status === "valuing"}
            onClick={runValuation}
            className="neo-press w-full rounded-full neo-border neo-shadow bg-electric px-6 py-3.5 font-display text-base uppercase tracking-wide text-white disabled:opacity-50"
          >
            {status === "valuing" ? "Appraising…" : "🤖 Value this item"}
          </button>
        )}

        {valuation && (
          <div className="neo-tile bg-lime p-5 animate-pop">
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-80">AI Appraisal</div>
            <div className="mt-1 font-display text-2xl leading-tight">{valuation.name}</div>
            <div className="mt-1 text-sm">{valuation.description}</div>
            <div className="mt-3 inline-block rounded-lg bg-foreground px-3 py-1.5 font-mono text-sm text-background">
              ${valuation.estimated_low.toFixed(0)} – ${valuation.estimated_high.toFixed(0)}
            </div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-widest opacity-80">
              Confidence: {valuation.confidence}
            </div>
            <p className="mt-2 text-[12px] italic">{valuation.reasoning}</p>

            <div className="mt-4">
              <label className="font-mono text-[11px] uppercase tracking-widest">Save to category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded-xl neo-border bg-card px-3 py-2.5 text-sm"
              >
                <option value="">— Uncategorized —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={save}
              disabled={status === "saving"}
              className="neo-press mt-4 w-full rounded-full neo-border neo-shadow bg-hot px-6 py-3 font-display text-base uppercase tracking-wide text-white disabled:opacity-50"
            >
              {status === "saving" ? "Saving…" : "💾 Save to inventory"}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

function NewCategoryModal({
  userId,
  onClose,
  onSaved,
}: {
  userId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(SHAPE_COLORS[0]);
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("categories").insert({
      user_id: userId,
      name: name.trim(),
      color,
      emoji,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Category created");
    onSaved();
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="font-display text-3xl uppercase tracking-tight">New category</h2>
      <form onSubmit={save} className="mt-5 space-y-4">
        <div>
          <label className="font-mono text-[11px] uppercase tracking-widest">Name</label>
          <input
            required
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mid-century lamps"
            className="mt-1 w-full rounded-xl neo-border bg-background px-4 py-3 text-base outline-none focus:bg-sun"
          />
        </div>
        <div>
          <label className="font-mono text-[11px] uppercase tracking-widest">Color</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {SHAPE_COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`size-10 rounded-full neo-border ${color === c ? "neo-shadow scale-110" : "neo-shadow-sm"}`}
                aria-label={c}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="font-mono text-[11px] uppercase tracking-widest">Emoji</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                type="button"
                key={e}
                onClick={() => setEmoji(e)}
                className={`grid size-10 place-items-center rounded-xl neo-border bg-card text-lg ${
                  emoji === e ? "neo-shadow" : "neo-shadow-sm"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <button
          disabled={busy || !name.trim()}
          className="neo-press w-full rounded-full neo-border neo-shadow bg-hot px-6 py-3.5 font-display text-base uppercase tracking-wide text-white disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create category"}
        </button>
      </form>
    </Modal>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={onClose}>
      <div
        className="neo-tile relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="neo-press absolute right-3 top-3 grid size-9 place-items-center rounded-full neo-border neo-shadow-sm bg-card font-bold"
          aria-label="Close"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // strip "data:...;base64," prefix
      const idx = result.indexOf(",");
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
