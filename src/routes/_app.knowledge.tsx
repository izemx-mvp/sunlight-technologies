import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader, GlassCard, EmptyState } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import type { KBArticle } from "@/lib/mock-data";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";

export const Route = createFileRoute("/_app/knowledge")({
  head: () => ({ meta: [{ title: "Base de connaissances — Sunlight" }] }),
  component: KB,
});

const categories = ["Produits", "Tarifs & Devis", "Livraison", "SAV & Garantie", "Compte client"];

function KB() {
  const { kb, setKb } = useStore();
  const [category, setCategory] = useState<string>("Produits");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<KBArticle | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => kb.filter(a => a.category === category && (!search || (a.question + a.answer).toLowerCase().includes(search.toLowerCase()))), [kb, category, search]);

  const remove = (id: string) => { if (confirm("Supprimer cet article ?")) { setKb(kb.filter(a => a.id !== id)); toast.success("Article supprimé"); } };
  const save = (a: KBArticle) => {
    if (kb.find(x => x.id === a.id)) setKb(kb.map(x => x.id === a.id ? a : x));
    else setKb([{ ...a, id: `k${Date.now()}`, updatedAt: new Date().toISOString(), usage: 0 }, ...kb]);
    toast.success("Article enregistré");
    setEditing(null); setCreating(false);
  };

  return (
    <div>
      <PageHeader title="Base de connaissances" subtitle="FAQ utilisée par l'agent IA"
        right={<button onClick={() => setCreating(true)} className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"><Plus className="h-4 w-4" />Ajouter une question</button>} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
        <GlassCard>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Catégories</div>
          {categories.map(c => {
            const count = kb.filter(a => a.category === c).length;
            return (
              <button key={c} onClick={() => setCategory(c)} className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${category === c ? "bg-primary text-white" : "hover:bg-muted"}`}>
                <span>{c}</span><span className={`text-xs ${category === c ? "text-white/70" : "text-muted-foreground"}`}>{count}</span>
              </button>
            );
          })}
        </GlassCard>

        <div>
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un article…" className="w-full rounded-md border border-input bg-white pl-9 pr-3 py-2 text-sm" />
          </div>
          {filtered.length === 0 ? <EmptyState hint="Ajoutez un article ou changez la recherche" /> :
            <div className="space-y-2">
              {filtered.map(a => (
                <GlassCard key={a.id} className="!p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-primary">{a.question}</div>
                      <div className="mt-1 line-clamp-2 text-sm text-slate-ink">{a.answer}</div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>Utilisé {a.usage}× par l'IA</span>·<span>Modifié le {new Date(a.updatedAt).toLocaleDateString("fr-FR")}</span>
                        {a.tags.map(t => <span key={t} className="rounded-full bg-muted px-1.5 py-0.5">#{t}</span>)}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setEditing(a)} className="rounded-md p-1.5 hover:bg-muted"><Pencil className="h-4 w-4 text-slate-ink" /></button>
                      <button onClick={() => remove(a.id)} className="rounded-md p-1.5 hover:bg-danger/10"><Trash2 className="h-4 w-4 text-danger" /></button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>}
        </div>
      </div>

      {(editing || creating) && <KBForm article={editing} onClose={() => { setEditing(null); setCreating(false); }} onSave={save} defaultCategory={category} />}
    </div>
  );
}

function KBForm({ article, onClose, onSave, defaultCategory }: { article: KBArticle | null; onClose: () => void; onSave: (a: KBArticle) => void; defaultCategory: string }) {
  const [f, setF] = useState<KBArticle>(article || { id: "", category: defaultCategory, question: "", answer: "", usage: 0, updatedAt: "", tags: [] });
  const [tagInput, setTagInput] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form onSubmit={e => { e.preventDefault(); onSave(f); }} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-primary">{article ? "Modifier" : "Nouvelle"} question</h3><button type="button" onClick={onClose}><X className="h-5 w-5" /></button></div>
        <div className="space-y-3">
          <input required value={f.question} onChange={e => setF({ ...f, question: e.target.value })} placeholder="Question" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <textarea required value={f.answer} onChange={e => setF({ ...f, answer: e.target.value })} placeholder="Réponse" rows={4} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <select value={f.category} onChange={e => setF({ ...f, category: e.target.value })} className="w-full rounded-md border border-input px-3 py-2 text-sm">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <div>
            <div className="mb-1 flex flex-wrap gap-1">
              {f.tags.map(t => <span key={t} className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">#{t}<button type="button" onClick={() => setF({ ...f, tags: f.tags.filter(x => x !== t) })}>×</button></span>)}
            </div>
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (tagInput.trim()) { setF({ ...f, tags: [...f.tags, tagInput.trim()] }); setTagInput(""); } } }} placeholder="Ajouter tag + Entrée" className="w-full rounded-md border border-input px-3 py-2 text-xs" />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-input px-4 py-2 text-sm">Annuler</button>
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}
