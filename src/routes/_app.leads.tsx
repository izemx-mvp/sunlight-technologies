import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader, GlassCard, StatusBadge, EmptyState } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import type { Lead, LeadStage, Channel } from "@/lib/mock-data";
import { LeadDetail } from "./_app.pipeline";

export const Route = createFileRoute("/_app/leads")({
  head: () => ({ meta: [{ title: "Fiches leads — Sunlight" }] }),
  component: Leads,
});

const stageLabel: Record<LeadStage, string> = { nouveau: "Nouveau", contacte: "Contacté", qualifie: "Qualifié", negociation: "Négociation", converti: "Converti", perdu: "Perdu" };
const owners = ["Karim B.", "Sofia M.", "Yasmine H.", "Mehdi A."];

function Leads() {
  const { leads } = useStore();
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState<"all" | Channel>("all");
  const [stage, setStage] = useState<"all" | LeadStage>("all");
  const [owner, setOwner] = useState<"all" | string>("all");
  const [selected, setSelected] = useState<Lead | null>(null);

  const filtered = useMemo(() => leads.filter(l =>
    (!search || (l.company + l.contact).toLowerCase().includes(search.toLowerCase())) &&
    (channel === "all" || l.channel === channel) &&
    (stage === "all" || l.stage === stage) &&
    (owner === "all" || l.owner === owner)
  ), [leads, search, channel, stage, owner]);

  return (
    <div>
      <PageHeader title="Fiches leads" subtitle={`${filtered.length} lead(s)`} />
      <GlassCard className="mb-4">
        <div className="flex flex-wrap gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" className="flex-1 min-w-[180px] rounded-md border border-input px-3 py-2 text-sm" />
          <select value={channel} onChange={e => setChannel(e.target.value as "all" | Channel)} className="rounded-md border border-input px-2 py-2 text-sm"><option value="all">Tous canaux</option><option value="web">Web</option><option value="whatsapp">WhatsApp</option><option value="linkedin">LinkedIn</option><option value="phone">Téléphone</option><option value="email">Email</option></select>
          <select value={stage} onChange={e => setStage(e.target.value as "all" | LeadStage)} className="rounded-md border border-input px-2 py-2 text-sm"><option value="all">Tous statuts</option>{Object.entries(stageLabel).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select>
          <select value={owner} onChange={e => setOwner(e.target.value)} className="rounded-md border border-input px-2 py-2 text-sm"><option value="all">Tous commerciaux</option>{owners.map(o => <option key={o}>{o}</option>)}</select>
        </div>
      </GlassCard>

      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground"><tr>
            <th className="px-4 py-3 text-left">Entreprise</th><th className="px-4 py-3 text-left">Secteur</th><th className="px-4 py-3 text-left">Canal</th><th className="px-4 py-3 text-left">Statut</th><th className="px-4 py-3 text-left">Montant</th><th className="px-4 py-3 text-left">Commercial</th><th className="px-4 py-3 text-left">Dernière</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7}><EmptyState /></td></tr>}
            {filtered.map(l => (
              <tr key={l.id} onClick={() => setSelected(l)} className="cursor-pointer border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-semibold">{l.company}</td>
                <td className="px-4 py-3">{l.sector}</td>
                <td className="px-4 py-3 text-xs uppercase">{l.channel}</td>
                <td className="px-4 py-3"><StatusBadge tone={l.stage==="converti"?"success":l.stage==="perdu"?"danger":"info"}>{stageLabel[l.stage]}</StatusBadge></td>
                <td className="px-4 py-3 font-semibold text-accent">{l.amount.toLocaleString("fr-FR")} MAD</td>
                <td className="px-4 py-3">{l.owner}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(l.lastContact).toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {selected && <LeadDetail lead={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
