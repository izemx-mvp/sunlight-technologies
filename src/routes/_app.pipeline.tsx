import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader, GlassCard, StatusBadge } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import type { Lead, LeadStage, Channel } from "@/lib/mock-data";
import { toast } from "sonner";
import { Plus, X, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_app/pipeline")({
  head: () => ({ meta: [{ title: "Pipeline — Sunlight" }] }),
  component: Pipeline,
});

const stages: { key: LeadStage; label: string; color: string }[] = [
  { key: "nouveau", label: "Nouveau", color: "#5B6472" },
  { key: "contacte", label: "Contacté", color: "#2d5f78" },
  { key: "qualifie", label: "Qualifié", color: "#C8862B" },
  { key: "negociation", label: "En négociation", color: "#8a5a1b" },
  { key: "converti", label: "Converti / Perdu", color: "#1B2A4A" },
];
const nextStage: Record<LeadStage, LeadStage> = { nouveau: "contacte", contacte: "qualifie", qualifie: "negociation", negociation: "converti", converti: "converti", perdu: "perdu" };

function Pipeline() {
  const { leads, setLeads } = useStore();
  const [selected, setSelected] = useState<Lead | null>(null);
  const [creating, setCreating] = useState(false);

  const advance = (id: string) => {
    setLeads(leads.map(l => l.id === id ? { ...l, stage: nextStage[l.stage] } : l));
    toast.success("Lead avancé à l'étape suivante");
  };
  const move = (id: string, stage: LeadStage) => setLeads(leads.map(l => l.id === id ? { ...l, stage } : l));

  return (
    <div>
      <PageHeader title="Pipeline" subtitle={`${leads.length} leads · ${leads.reduce((s,l)=>s+(l.stage!=="perdu"?l.amount:0),0).toLocaleString("fr-FR")} MAD potentiels`}
        right={<button onClick={() => setCreating(true)} className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"><Plus className="h-4 w-4" />Ajouter un lead</button>} />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5"
        onDragOver={e => e.preventDefault()}>
        {stages.map(s => {
          const items = leads.filter(l => s.key === "converti" ? (l.stage === "converti" || l.stage === "perdu") : l.stage === s.key);
          const sum = items.reduce((sum, l) => sum + l.amount, 0);
          return (
            <div key={s.key} onDragOver={e => e.preventDefault()} onDrop={e => { const id = e.dataTransfer.getData("id"); if (id) move(id, s.key); }}
              className="rounded-xl bg-white/60 p-2 backdrop-blur">
              <div className="flex items-center justify-between px-1 py-2">
                <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full" style={{ background: s.color }} /><div className="font-semibold text-primary">{s.label}</div></div>
                <div className="text-xs text-muted-foreground">{items.length}</div>
              </div>
              <div className="mb-2 px-1 text-xs text-slate-ink">{sum.toLocaleString("fr-FR")} MAD</div>
              <div className="space-y-2">
                {items.map(l => (
                  <div key={l.id} draggable onDragStart={e => e.dataTransfer.setData("id", l.id)}
                    onClick={() => setSelected(l)}
                    className="cursor-pointer rounded-lg border border-border bg-white p-3 shadow-sm hover:shadow-md">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="text-sm font-semibold text-primary">{l.company}</div>
                      <StatusBadge tone="muted">{l.channel}</StatusBadge>
                    </div>
                    <div className="text-xs text-muted-foreground">{l.sector}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs font-bold text-accent">{l.amount.toLocaleString("fr-FR")} MAD</div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">{l.owner[0]}</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Dernière · {new Date(l.lastContact).toLocaleDateString("fr-FR")}</span>
                      {l.stage !== "converti" && l.stage !== "perdu" && (
                        <button onClick={e => { e.stopPropagation(); advance(l.id); }} className="rounded-md p-1 hover:bg-muted"><ArrowRight className="h-3 w-3" /></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selected && <LeadDetail lead={selected} onClose={() => setSelected(null)} />}
      {creating && <NewLead onClose={() => setCreating(false)} onCreate={l => { setLeads([l, ...leads]); setCreating(false); toast.success("Lead ajouté"); }} />}
    </div>
  );
}

export function LeadDetail({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const { leads, setLeads } = useStore();
  const [notes, setNotes] = useState(lead.notes);
  const [next, setNext] = useState(lead.nextAction);
  const save = () => { setLeads(leads.map(l => l.id === lead.id ? { ...l, notes, nextAction: next } : l)); toast.success("Fiche mise à jour"); };
  const relance = () => toast.success("Relance envoyée par WhatsApp");
  const setStage = (stage: LeadStage) => { setLeads(leads.map(l => l.id === lead.id ? { ...l, stage } : l)); toast.success(`Lead marqué ${stage}`); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-xs font-mono text-muted-foreground">{lead.id}</div>
            <h2 className="text-xl font-bold text-primary">{lead.company}</h2>
            <div className="text-sm text-muted-foreground">{lead.sector} · {lead.contact}</div>
            <div className="mt-2 flex gap-2 text-xs">
              <StatusBadge tone="info">{lead.email}</StatusBadge><StatusBadge tone="info">{lead.phone}</StatusBadge><StatusBadge tone="muted">Canal · {lead.channel}</StatusBadge>
            </div>
          </div>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>

        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Historique</div>
          <div className="space-y-2">
            {lead.history.map((h, i) => (
              <div key={i} className="flex items-start gap-3 rounded-md border border-border bg-muted/30 p-2 text-sm">
                <StatusBadge tone="muted">{h.kind}</StatusBadge>
                <div className="flex-1">{h.text}</div>
                <span className="text-xs text-muted-foreground">{new Date(h.at).toLocaleDateString("fr-FR")}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Prochaine action</label>
            <input type="date" value={next.date.slice(0, 10)} onChange={e => setNext({ ...next, date: e.target.value })} className="mb-2 w-full rounded-md border border-input px-3 py-2 text-sm" />
            <input value={next.text} onChange={e => setNext({ ...next, text: e.target.value })} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <button onClick={save} className="rounded-md border border-input px-3 py-2 text-sm">Enregistrer</button>
          <button onClick={relance} className="rounded-md bg-[#25D366] px-3 py-2 text-sm font-semibold text-white">Relancer maintenant</button>
          <button onClick={() => setStage("converti")} className="rounded-md bg-[oklch(0.68_0.16_150)] px-3 py-2 text-sm font-semibold text-white">Marquer converti</button>
          <button onClick={() => setStage("perdu")} className="rounded-md border border-danger px-3 py-2 text-sm font-semibold text-danger">Marquer perdu</button>
        </div>
      </div>
    </div>
  );
}

function NewLead({ onClose, onCreate }: { onClose: () => void; onCreate: (l: Lead) => void }) {
  const [f, setF] = useState({ company: "", sector: "Distribution", contact: "", email: "", phone: "", channel: "web" as Channel, amount: 25000 });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      id: `L${Date.now()}`, ...f, stage: "nouveau", lastContact: new Date().toISOString(), owner: "Karim B.",
      notes: "", nextAction: { date: new Date().toISOString(), text: "Premier contact" }, history: [],
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form onSubmit={submit} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-primary">Nouveau lead</h3><button type="button" onClick={onClose}><X className="h-5 w-5" /></button></div>
        <div className="space-y-2">
          <input required value={f.company} onChange={e => setF({ ...f, company: e.target.value })} placeholder="Entreprise" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <input required value={f.contact} onChange={e => setF({ ...f, contact: e.target.value })} placeholder="Contact" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <input required type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="Email" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} placeholder="Téléphone" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <select value={f.sector} onChange={e => setF({ ...f, sector: e.target.value })} className="rounded-md border border-input px-2 py-2 text-sm">
              {["Distribution","Immobilier","Retail","Construction","Hôtellerie","Restauration","Industrie","Design","Public","BTP"].map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={f.channel} onChange={e => setF({ ...f, channel: e.target.value as Channel })} className="rounded-md border border-input px-2 py-2 text-sm">
              <option value="web">Site web</option><option value="whatsapp">WhatsApp</option><option value="linkedin">LinkedIn</option><option value="phone">Téléphone</option><option value="email">Email</option>
            </select>
          </div>
          <input required type="number" value={f.amount} onChange={e => setF({ ...f, amount: parseInt(e.target.value) })} placeholder="Montant potentiel MAD" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
        </div>
        <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-md border border-input px-4 py-2 text-sm">Annuler</button><button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Créer</button></div>
      </form>
    </div>
  );
}
