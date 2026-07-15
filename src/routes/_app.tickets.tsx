import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader, GlassCard, StatusBadge, EmptyState } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import type { Ticket, TicketStatus, Priority, Channel } from "@/lib/mock-data";
import { toast } from "sonner";
import { Plus, X, ArrowUpDown } from "lucide-react";

export const Route = createFileRoute("/_app/tickets")({
  head: () => ({ meta: [{ title: "Tickets — Sunlight" }] }),
  component: Tickets,
});

const agents = ["Sofia M.", "Karim B.", "Yasmine H.", "Mehdi A.", "IA"];

function Tickets() {
  const { tickets, setTickets } = useStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | TicketStatus>("all");
  const [channel, setChannel] = useState<"all" | Channel>("all");
  const [priority, setPriority] = useState<"all" | Priority>("all");
  const [sort, setSort] = useState<{ key: keyof Ticket; asc: boolean }>({ key: "updatedAt", asc: false });
  const [openTicket, setOpenTicket] = useState<Ticket | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = tickets.filter(t =>
      (status === "all" || t.status === status) &&
      (channel === "all" || t.channel === channel) &&
      (priority === "all" || t.priority === priority) &&
      (!search || (t.subject + t.client + t.id).toLowerCase().includes(search.toLowerCase()))
    );
    list = [...list].sort((a, b) => {
      const va = a[sort.key] as string; const vb = b[sort.key] as string;
      return (va > vb ? 1 : -1) * (sort.asc ? 1 : -1);
    });
    return list;
  }, [tickets, search, status, channel, priority, sort]);

  const priorityTone = (p: Priority) => p === "urgent" ? "danger" : p === "normale" ? "info" : "muted";
  const statusTone = (s: TicketStatus) => s === "resolu" ? "success" : s === "en_cours" ? "warning" : "muted";
  const statusLabel = (s: TicketStatus) => s === "resolu" ? "Résolu" : s === "en_cours" ? "En cours" : "Ouvert";

  const changeStatus = (id: string, s: TicketStatus) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: s, updatedAt: new Date().toISOString(), history: [...t.history, { at: new Date().toISOString(), text: `Statut → ${statusLabel(s)}` }] } : t));
    setOpenTicket(prev => prev && prev.id === id ? { ...prev, status: s } : prev);
    toast.success(`Ticket ${id} → ${statusLabel(s)}`);
  };
  const changeAssignee = (id: string, a: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, assignee: a, updatedAt: new Date().toISOString() } : t));
    setOpenTicket(prev => prev && prev.id === id ? { ...prev, assignee: a } : prev);
    toast.success(`Assigné à ${a}`);
  };

  return (
    <div>
      <PageHeader title="Tickets" subtitle={`${tickets.length} tickets · ${tickets.filter(t=>t.status!=="resolu").length} à traiter`}
        right={<button onClick={() => setNewOpen(true)} className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"><Plus className="h-4 w-4" />Nouveau ticket</button>} />

      <GlassCard className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" className="flex-1 min-w-[200px] rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:border-accent" />
          <select value={status} onChange={e => setStatus(e.target.value as "all" | TicketStatus)} className="rounded-md border border-input bg-white px-2 py-2 text-sm">
            <option value="all">Tous statuts</option><option value="ouvert">Ouvert</option><option value="en_cours">En cours</option><option value="resolu">Résolu</option>
          </select>
          <select value={channel} onChange={e => setChannel(e.target.value as "all" | Channel)} className="rounded-md border border-input bg-white px-2 py-2 text-sm">
            <option value="all">Tous canaux</option><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="phone">Téléphone</option><option value="web">Site</option>
          </select>
          <select value={priority} onChange={e => setPriority(e.target.value as "all" | Priority)} className="rounded-md border border-input bg-white px-2 py-2 text-sm">
            <option value="all">Toutes priorités</option><option value="urgent">Urgente</option><option value="normale">Normale</option><option value="basse">Basse</option>
          </select>
        </div>
      </GlassCard>

      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {[
                { k: "id", l: "ID" }, { k: "client", l: "Client" }, { k: "subject", l: "Sujet" },
                { k: "channel", l: "Canal" }, { k: "priority", l: "Priorité" }, { k: "status", l: "Statut" },
                { k: "assignee", l: "Assigné" }, { k: "updatedAt", l: "MAJ" },
              ].map(c => (
                <th key={c.k} className="cursor-pointer px-4 py-3 text-left font-semibold" onClick={() => setSort(s => ({ key: c.k as keyof Ticket, asc: s.key === c.k ? !s.asc : true }))}>
                  <span className="inline-flex items-center gap-1">{c.l}<ArrowUpDown className="h-3 w-3" /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={8}><EmptyState /></td></tr>}
            {filtered.map(t => (
              <tr key={t.id} className="cursor-pointer border-t border-border hover:bg-muted/30" onClick={() => setOpenTicket(t)}>
                <td className="px-4 py-3 font-mono text-xs">#{t.id}</td>
                <td className="px-4 py-3 font-medium">{t.client}</td>
                <td className="px-4 py-3">{t.subject}</td>
                <td className="px-4 py-3 text-xs uppercase">{t.channel}</td>
                <td className="px-4 py-3"><StatusBadge tone={priorityTone(t.priority)}>{t.priority}</StatusBadge></td>
                <td className="px-4 py-3"><StatusBadge tone={statusTone(t.status)}>{statusLabel(t.status)}</StatusBadge></td>
                <td className="px-4 py-3 text-slate-ink">{t.assignee}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(t.updatedAt).toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {openTicket && <TicketDetail ticket={openTicket} onClose={() => setOpenTicket(null)} onStatus={changeStatus} onAssign={changeAssignee} />}
      {newOpen && <NewTicket onClose={() => setNewOpen(false)} onCreate={(t) => { setTickets([t, ...tickets]); setNewOpen(false); toast.success(`Ticket ${t.id} créé`); }} />}
    </div>
  );
}

function TicketDetail({ ticket, onClose, onStatus, onAssign }: { ticket: Ticket; onClose: () => void; onStatus: (id: string, s: TicketStatus) => void; onAssign: (id: string, a: string) => void }) {
  const [note, setNote] = useState(ticket.internalNote || "");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-xs font-mono text-muted-foreground">#{ticket.id}</div>
            <h2 className="text-xl font-bold text-primary">{ticket.subject}</h2>
            <div className="text-sm text-muted-foreground">{ticket.client} · {ticket.channel}</div>
          </div>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="mb-4 rounded-md bg-muted/50 p-3 text-sm">{ticket.description}</div>
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Statut</label>
            <select value={ticket.status} onChange={e => onStatus(ticket.id, e.target.value as TicketStatus)} className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm">
              <option value="ouvert">Ouvert</option><option value="en_cours">En cours</option><option value="resolu">Résolu</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Assigné à</label>
            <select value={ticket.assignee} onChange={e => onAssign(ticket.id, e.target.value)} className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm">
              {agents.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Note interne</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm" rows={3} />
        </div>
        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Historique</div>
          <div className="space-y-1 text-xs">
            {ticket.history.map((h, i) => <div key={i} className="flex justify-between border-l-2 border-accent pl-2"><span>{h.text}</span><span className="text-muted-foreground">{new Date(h.at).toLocaleString("fr-FR")}</span></div>)}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={() => { onStatus(ticket.id, "resolu"); onClose(); }} className="rounded-md bg-[oklch(0.68_0.16_150)] px-4 py-2 text-sm font-semibold text-white">Résoudre</button>
          <button onClick={() => { toast("Ticket escaladé"); onClose(); }} className="rounded-md border border-danger px-4 py-2 text-sm font-semibold text-danger">Escalader</button>
        </div>
      </div>
    </div>
  );
}

function NewTicket({ onClose, onCreate }: { onClose: () => void; onCreate: (t: Ticket) => void }) {
  const [f, setF] = useState({ subject: "", client: "", channel: "web" as Channel, priority: "normale" as Priority, description: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      id: `T${1050 + Math.floor(Math.random() * 900)}`,
      subject: f.subject, client: f.client, channel: f.channel, priority: f.priority, status: "ouvert",
      assignee: "Non assigné", updatedAt: new Date().toISOString(), description: f.description,
      history: [{ at: new Date().toISOString(), text: "Ticket créé manuellement" }],
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form onSubmit={submit} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-primary">Nouveau ticket</h3><button type="button" onClick={onClose}><X className="h-5 w-5" /></button></div>
        <div className="space-y-3">
          <input required value={f.subject} onChange={e => setF({ ...f, subject: e.target.value })} placeholder="Titre" className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm" />
          <input required value={f.client} onChange={e => setF({ ...f, client: e.target.value })} placeholder="Client" className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <select value={f.channel} onChange={e => setF({ ...f, channel: e.target.value as Channel })} className="rounded-md border border-input bg-white px-2 py-2 text-sm">
              <option value="web">Site web</option><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="phone">Téléphone</option>
            </select>
            <select value={f.priority} onChange={e => setF({ ...f, priority: e.target.value as Priority })} className="rounded-md border border-input bg-white px-2 py-2 text-sm">
              <option value="urgent">Urgente</option><option value="normale">Normale</option><option value="basse">Basse</option>
            </select>
          </div>
          <textarea required value={f.description} onChange={e => setF({ ...f, description: e.target.value })} placeholder="Description…" rows={3} className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm" />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-input px-4 py-2 text-sm">Annuler</button>
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Créer</button>
        </div>
      </form>
    </div>
  );
}
