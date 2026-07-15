import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, GlassCard, StatusBadge } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import type { FollowUpRule, Channel } from "@/lib/mock-data";
import { toast } from "sonner";
import { Plus, X, History } from "lucide-react";

export const Route = createFileRoute("/_app/follow-ups")({
  head: () => ({ meta: [{ title: "Relances — Sunlight" }] }),
  component: FollowUps,
});

function FollowUps() {
  const { followUps, setFollowUps, followUpLogs } = useStore();
  const [creating, setCreating] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const toggle = (id: string) => setFollowUps(followUps.map(r => r.id === id ? { ...r, active: !r.active } : r));

  return (
    <div>
      <PageHeader title="Relances automatiques" subtitle={`${followUps.filter(r=>r.active).length}/${followUps.length} règles actives`}
        right={<>
          <button onClick={() => setShowLogs(true)} className="flex items-center gap-1.5 rounded-md border border-input bg-white px-3 py-2 text-sm font-medium hover:bg-muted"><History className="h-4 w-4" />Historique</button>
          <button onClick={() => setCreating(true)} className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"><Plus className="h-4 w-4" />Créer une règle</button>
        </>} />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {followUps.map(r => (
          <GlassCard key={r.id}>
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-primary">{r.name}</div>
                <div className="mt-1 flex gap-1"><StatusBadge tone="info">{r.channel}</StatusBadge><StatusBadge tone="muted">{r.trigger} {r.days} jours</StatusBadge></div>
              </div>
              <button onClick={() => { toggle(r.id); toast(r.active ? "Règle désactivée" : "Règle activée"); }} className={`relative h-6 w-11 rounded-full transition ${r.active ? "bg-[oklch(0.68_0.16_150)]" : "bg-muted"}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${r.active ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
            <div className="line-clamp-2 rounded-md bg-muted/50 p-2 text-xs italic text-slate-ink">« {r.template} »</div>
          </GlassCard>
        ))}
      </div>

      {creating && <NewRule onClose={() => setCreating(false)} onCreate={r => { setFollowUps([r, ...followUps]); setCreating(false); toast.success("Règle créée"); }} />}
      {showLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowLogs(false)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-primary">Historique des relances</h3><button onClick={() => setShowLogs(false)}><X className="h-5 w-5" /></button></div>
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs uppercase text-muted-foreground"><tr><th className="p-2 text-left">Lead</th><th className="p-2 text-left">Canal</th><th className="p-2 text-left">Date</th><th className="p-2 text-left">Statut</th></tr></thead>
              <tbody>{followUpLogs.map(l => (
                <tr key={l.id} className="border-t border-border"><td className="p-2 font-medium">{l.lead}</td><td className="p-2">{l.channel}</td><td className="p-2 text-xs">{new Date(l.at).toLocaleDateString("fr-FR")}</td><td className="p-2"><StatusBadge tone={l.status==="repondue"?"success":l.status==="ouverte"?"info":"muted"}>{l.status}</StatusBadge></td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function NewRule({ onClose, onCreate }: { onClose: () => void; onCreate: (r: FollowUpRule) => void }) {
  const [f, setF] = useState<Omit<FollowUpRule, "id">>({ name: "", channel: "whatsapp", trigger: "Aucun contact depuis", days: 7, template: "", active: true });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form onSubmit={e => { e.preventDefault(); onCreate({ ...f, id: `r${Date.now()}` }); }} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-primary">Nouvelle règle</h3><button type="button" onClick={onClose}><X className="h-5 w-5" /></button></div>
        <div className="space-y-2">
          <input required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="Nom de la règle" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <select value={f.channel} onChange={e => setF({ ...f, channel: e.target.value as Channel })} className="w-full rounded-md border border-input px-3 py-2 text-sm">
            <option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="linkedin">LinkedIn</option>
          </select>
          <input value={f.trigger} onChange={e => setF({ ...f, trigger: e.target.value })} placeholder="Condition de déclenchement" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <input required type="number" value={f.days} onChange={e => setF({ ...f, days: parseInt(e.target.value) })} placeholder="Délai (jours)" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <textarea required value={f.template} onChange={e => setF({ ...f, template: e.target.value })} placeholder="Message-type…" rows={3} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
        </div>
        <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-md border border-input px-4 py-2 text-sm">Annuler</button><button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Créer</button></div>
      </form>
    </div>
  );
}
