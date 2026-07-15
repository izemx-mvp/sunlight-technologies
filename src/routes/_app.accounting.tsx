import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader, GlassCard, StatusBadge } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import type { Invoice, InvoiceKind, InvoiceStatus } from "@/lib/mock-data";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const Route = createFileRoute("/_app/accounting")({
  head: () => ({ meta: [{ title: "Comptabilité — Sunlight" }] }),
  component: Accounting,
});

const cashData = [
  { month: "Janv", entrees: 320000, sorties: 210000 },
  { month: "Févr", entrees: 285000, sorties: 240000 },
  { month: "Mars", entrees: 410000, sorties: 260000 },
  { month: "Avril", entrees: 380000, sorties: 290000 },
  { month: "Mai", entrees: 465000, sorties: 310000 },
  { month: "Juin", entrees: 520000, sorties: 330000 },
];

function Accounting() {
  const { invoices, setInvoices } = useStore();
  const [tab, setTab] = useState<InvoiceKind>("fournisseur");
  const [creating, setCreating] = useState(false);
  const list = useMemo(() => invoices.filter(i => i.kind === tab), [invoices, tab]);
  const solde = cashData.reduce((s, m) => s + m.entrees - m.sorties, 0);
  const markPaid = (id: string) => { setInvoices(invoices.map(i => i.id === id ? { ...i, status: "payee" as InvoiceStatus } : i)); toast.success("Facture marquée payée"); };

  return (
    <div>
      <PageHeader title="Comptabilité" subtitle={`${invoices.filter(i=>i.status==="attente").length} en attente · ${invoices.filter(i=>i.status==="retard").length} en retard`}
        right={<button onClick={() => setCreating(true)} className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"><Plus className="h-4 w-4" />Nouvelle facture</button>} />

      <GlassCard className="mb-4">
        <div className="mb-2 flex items-center justify-between"><h3 className="font-semibold text-primary">Trésorerie (6 mois)</h3><div className="text-right"><div className="text-xs text-muted-foreground">Solde net</div><div className="text-2xl font-bold text-[oklch(0.68_0.16_150)]">+{solde.toLocaleString("fr-FR")} MAD</div></div></div>
        <div className="h-56">
          <ResponsiveContainer><LineChart data={cashData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{fontSize:11}} /><YAxis tick={{fontSize:11}} /><Tooltip /><Legend /><Line type="monotone" dataKey="entrees" name="Entrées" stroke="#1B2A4A" strokeWidth={2} /><Line type="monotone" dataKey="sorties" name="Sorties" stroke="#C8862B" strokeWidth={2} /></LineChart></ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="mb-3 flex gap-1 border-b border-border">
        {[["fournisseur","Factures fournisseurs"],["client","Factures clients"]].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k as InvoiceKind)} className={`border-b-2 px-4 py-2 text-sm font-medium ${tab===k?"border-accent text-accent":"border-transparent text-muted-foreground"}`}>{l}</button>
        ))}
      </div>

      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr>
            <th className="px-4 py-3 text-left">N°</th><th className="px-4 py-3 text-left">Tiers</th><th className="px-4 py-3 text-left">Montant</th><th className="px-4 py-3 text-left">Échéance</th><th className="px-4 py-3 text-left">Statut</th><th className="px-4 py-3"></th>
          </tr></thead>
          <tbody>{list.map(i => (
            <tr key={i.id} className="border-t border-border hover:bg-muted/30">
              <td className="px-4 py-3 font-mono text-xs">{i.number}</td><td className="px-4 py-3 font-medium">{i.party}</td>
              <td className="px-4 py-3 font-semibold">{i.amount.toLocaleString("fr-FR")} MAD</td>
              <td className="px-4 py-3 text-xs">{new Date(i.due).toLocaleDateString("fr-FR")}</td>
              <td className="px-4 py-3"><StatusBadge tone={i.status==="payee"?"success":i.status==="retard"?"danger":"warning"}>{i.status}</StatusBadge></td>
              <td className="px-4 py-3">{i.status!=="payee" && <button onClick={() => markPaid(i.id)} className="rounded-md bg-[oklch(0.68_0.16_150)] px-3 py-1 text-xs font-semibold text-white">Marquer payée</button>}</td>
            </tr>
          ))}</tbody>
        </table>
      </GlassCard>

      {creating && <NewInvoice kind={tab} onClose={() => setCreating(false)} onCreate={inv => { setInvoices([inv, ...invoices]); setCreating(false); toast.success("Facture ajoutée"); }} />}
    </div>
  );
}

function NewInvoice({ kind, onClose, onCreate }: { kind: InvoiceKind; onClose: () => void; onCreate: (i: Invoice) => void }) {
  const [f, setF] = useState({ number: "", party: "", amount: 10000, due: new Date().toISOString().slice(0, 10) });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form onSubmit={e => { e.preventDefault(); onCreate({ id: `i${Date.now()}`, kind, status: "attente", ...f, due: new Date(f.due).toISOString() }); }} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-primary">Nouvelle facture {kind}</h3><button type="button" onClick={onClose}><X className="h-5 w-5" /></button></div>
        <div className="space-y-2">
          <input required value={f.number} onChange={e => setF({ ...f, number: e.target.value })} placeholder="N° facture" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <input required value={f.party} onChange={e => setF({ ...f, party: e.target.value })} placeholder="Tiers" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <input required type="number" value={f.amount} onChange={e => setF({ ...f, amount: parseInt(e.target.value) })} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <input required type="date" value={f.due} onChange={e => setF({ ...f, due: e.target.value })} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
        </div>
        <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm">Annuler</button><button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Ajouter</button></div>
      </form>
    </div>
  );
}
