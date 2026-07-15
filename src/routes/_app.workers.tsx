import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, GlassCard } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import type { Worker } from "@/lib/mock-data";
import { toast } from "sonner";
import { X } from "lucide-react";

export const Route = createFileRoute("/_app/workers")({
  head: () => ({ meta: [{ title: "Ouvriers d'agence — Sunlight" }] }),
  component: Workers,
});

function Workers() {
  const { workers, setWorkers } = useStore();
  const [selected, setSelected] = useState<Worker | null>(null);
  const totalHours = (w: Worker) => Object.values(w.hoursByDay).reduce((a, b) => a + b, 0);
  return (
    <div>
      <PageHeader title="Ouvriers d'agence" subtitle={`${workers.length} ouvriers`} />
      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr>
            <th className="px-4 py-3 text-left">Nom</th><th className="px-4 py-3 text-left">Agence</th><th className="px-4 py-3 text-left">Mission</th><th className="px-4 py-3 text-left">Contrat</th><th className="px-4 py-3 text-left">Taux</th><th className="px-4 py-3 text-left">Heures ce mois</th>
          </tr></thead>
          <tbody>
            {workers.map(w => (
              <tr key={w.id} onClick={() => setSelected(w)} className="cursor-pointer border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{w.name}</td><td className="px-4 py-3">{w.agency}</td><td className="px-4 py-3">{w.mission}</td>
                <td className="px-4 py-3 text-xs">{w.contractStart} → {w.contractEnd}</td>
                <td className="px-4 py-3">{w.hourlyRate} MAD/h</td>
                <td className="px-4 py-3 font-semibold text-accent">{totalHours(w)}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
      {selected && <WorkerDetail worker={selected} onClose={() => setSelected(null)} onSave={(w) => { setWorkers(workers.map(x => x.id === w.id ? w : x)); toast.success("Pointage validé"); setSelected(null); }} />}
    </div>
  );
}

function WorkerDetail({ worker, onClose, onSave }: { worker: Worker; onClose: () => void; onSave: (w: Worker) => void }) {
  const [hours, setHours] = useState(worker.hoursByDay);
  const today = new Date().getDate();
  const total = Object.values(hours).reduce((a, b) => a + b, 0);
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div><h2 className="text-xl font-bold text-primary">{worker.name}</h2><div className="text-sm text-muted-foreground">{worker.agency} · {worker.mission}</div></div>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="mb-3 rounded-md bg-muted/50 p-3 text-sm">Total : <span className="text-lg font-bold text-primary">{total}h</span> · Coût : {(total * worker.hourlyRate).toLocaleString("fr-FR")} MAD</div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
            <div key={d} className={`rounded border p-2 text-center text-xs ${d === today ? "border-accent bg-accent/10" : "border-border"}`}>
              <div className="font-semibold">{d}</div>
              <input type="number" min={0} max={12} value={hours[d] || 0} onChange={e => setHours({ ...hours, [d]: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded border border-input px-1 py-0.5 text-center text-xs" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end"><button onClick={() => onSave({ ...worker, hoursByDay: hours })} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Valider le pointage</button></div>
      </div>
    </div>
  );
}
