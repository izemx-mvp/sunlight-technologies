import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import { PageHeader, GlassCard, StatusBadge, EmptyState } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { Send, Search, MessageSquare, Globe, AlertTriangle, CheckCircle2, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_app/conversations")({
  head: () => ({ meta: [{ title: "Conversations — Sunlight" }] }),
  component: Conversations,
});

function Conversations() {
  const { conversations, setConversations } = useStore();
  const [selectedId, setSelectedId] = useState(conversations[0]?.id);
  const [filter, setFilter] = useState<"all" | "whatsapp" | "web" | "unread" | "escalated">("all");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const list = useMemo(() => conversations.filter(c => {
    if (filter === "whatsapp" && c.channel !== "whatsapp") return false;
    if (filter === "web" && c.channel !== "web") return false;
    if (filter === "unread" && c.unread === 0) return false;
    if (filter === "escalated" && !c.escalated) return false;
    if (search && !(c.contact + c.company).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [conversations, filter, search]);

  const selected = conversations.find(c => c.id === selectedId);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [selected?.messages.length, typing]);

  const send = () => {
    if (!draft.trim() || !selected) return;
    const newMsg = { id: Math.random().toString(), from: "human" as const, text: draft, at: new Date().toISOString() };
    setConversations(conversations.map(c => c.id === selected.id ? { ...c, messages: [...c.messages, newMsg], unread: 0, lastAt: newMsg.at } : c));
    setDraft("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const ai = { id: Math.random().toString(), from: "ai" as const, text: "Merci pour votre message. Je transmets à l'équipe.", at: new Date().toISOString() };
      setConversations(prev => prev.map(c => c.id === selected.id ? { ...c, messages: [...c.messages, ai] } : c));
    }, 1500);
  };

  const escalate = () => { if (!selected) return; setConversations(conversations.map(c => c.id === selected.id ? { ...c, escalated: true } : c)); toast.success("Conversation escaladée à un commercial"); };
  const resolve = () => { if (!selected) return; toast.success("Conversation marquée comme résolue"); };
  const insertFAQ = () => { setDraft("D'après notre FAQ : nos LED industrielles ont une durée de vie de 50 000 heures."); toast("Réponse FAQ insérée"); };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <PageHeader title="Conversations" subtitle="Site web + WhatsApp" />
      <GlassCard className="flex min-h-0 flex-1 gap-0 p-0">
        {/* List */}
        <div className="flex w-80 flex-col border-r border-border">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full rounded-md border border-input bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-accent" />
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {[{k:"all",l:"Tous"},{k:"whatsapp",l:"WhatsApp"},{k:"web",l:"Site web"},{k:"unread",l:"Non lus"},{k:"escalated",l:"Escaladés"}].map(f => (
                <button key={f.k} onClick={() => setFilter(f.k as typeof filter)} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${filter === f.k ? "bg-primary text-white" : "bg-muted text-slate-ink hover:bg-muted/70"}`}>{f.l}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {list.length === 0 ? <div className="p-8 text-center text-sm text-muted-foreground">Aucune conversation</div> :
              list.map(c => (
                <button key={c.id} onClick={() => setSelectedId(c.id)} className={`flex w-full items-start gap-3 border-b border-border/50 p-3 text-left transition-colors hover:bg-muted/50 ${selectedId === c.id ? "bg-accent/10" : ""}`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{c.contact.split(" ").map(s=>s[0]).slice(0,2).join("")}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="truncate text-sm font-semibold">{c.contact}</div>
                      {c.channel === "whatsapp" ? <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" /> : <Globe className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{c.company}</div>
                    <div className="mt-0.5 truncate text-xs text-slate-ink">{c.messages[c.messages.length - 1]?.text}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{new Date(c.lastAt).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</span>
                      {c.unread > 0 && <span className="rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">{c.unread}</span>}
                      {c.escalated && <AlertTriangle className="h-3 w-3 text-danger" />}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Thread */}
        {selected ? (
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-border p-3">
              <div>
                <div className="font-semibold">{selected.contact}</div>
                <div className="text-xs text-muted-foreground">{selected.company} · {selected.channel}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={insertFAQ} className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium hover:bg-muted"><BookOpen className="mr-1 inline h-3 w-3" />Insérer FAQ</button>
                <button onClick={escalate} className="rounded-md border border-border bg-white px-2.5 py-1 text-xs font-medium hover:bg-muted"><AlertTriangle className="mr-1 inline h-3 w-3" />Escalader</button>
                <button onClick={resolve} className="rounded-md bg-[oklch(0.68_0.16_150)] px-2.5 py-1 text-xs font-medium text-white hover:opacity-90"><CheckCircle2 className="mr-1 inline h-3 w-3" />Résoudre</button>
              </div>
            </div>
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
              {selected.messages.map(m => {
                const isClient = m.from === "client";
                const bg = isClient ? "bg-white" : m.from === "ai" ? "bg-primary text-white" : "bg-accent text-white";
                const label = isClient ? selected.contact : m.from === "ai" ? "Agent IA" : "Agent humain";
                return (
                  <div key={m.id} className={`flex ${isClient ? "" : "justify-end"}`}>
                    <div className={`max-w-md rounded-2xl px-4 py-2 shadow-sm ${bg}`}>
                      <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide opacity-75">{label}</div>
                      <div className="text-sm">{m.text}</div>
                      <div className="mt-1 text-[10px] opacity-60">{new Date(m.at).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</div>
                    </div>
                  </div>
                );
              })}
              {typing && <div className="text-xs italic text-muted-foreground">L'agent IA est en train d'écrire…</div>}
            </div>
            <div className="flex gap-2 border-t border-border p-3">
              <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Écrivez votre message…" className="flex-1 rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:border-accent" />
              <button onClick={send} className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"><Send className="h-4 w-4" /> Envoyer</button>
            </div>
          </div>
        ) : <div className="flex flex-1 items-center justify-center"><EmptyState /></div>}

        {/* Context */}
        {selected && (
          <div className="hidden w-72 flex-col border-l border-border p-4 xl:flex">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</div>
            <div className="font-semibold">{selected.contact}</div>
            <div className="text-sm text-muted-foreground">{selected.company}</div>
            <div className="mt-3 flex flex-wrap gap-1">{selected.tags.map(t => <StatusBadge key={t} tone="muted">{t}</StatusBadge>)}</div>
            <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Historique commandes</div>
            <div className="mt-2 space-y-1">
              {selected.orders.length ? selected.orders.map(o => (
                <div key={o.ref} className="rounded-md border border-border bg-white p-2 text-xs"><div className="font-semibold">{o.ref}</div><div className="text-muted-foreground">{o.amount.toLocaleString("fr-FR")} MAD · {o.date}</div></div>
              )) : <div className="text-xs text-muted-foreground">Aucune commande</div>}
            </div>
            <button className="mt-4 rounded-md border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-white">Voir la fiche lead</button>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
