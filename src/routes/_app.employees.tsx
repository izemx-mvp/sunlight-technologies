import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, GlassCard, StatusBadge } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import type { Employee } from "@/lib/mock-data";
import { toast } from "sonner";
import { X, Eye, EyeOff, Download, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/employees")({
  head: () => ({ meta: [{ title: "Employés — Sunlight" }] }),
  component: Employees,
});

function Employees() {
  const { employees } = useStore();
  const [selected, setSelected] = useState<Employee | null>(null);
  return (
    <div>
      <PageHeader title="Employés" subtitle={`${employees.length} collaborateurs`} />
      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground"><tr>
            <th className="px-4 py-3 text-left">Nom</th><th className="px-4 py-3 text-left">Poste</th><th className="px-4 py-3 text-left">Département</th><th className="px-4 py-3 text-left">Statut</th><th className="px-4 py-3 text-left">Entrée</th><th className="px-4 py-3"></th>
          </tr></thead>
          <tbody>
            {employees.map(e => (
              <tr key={e.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">{e.name.split(" ").map(s=>s[0]).join("")}</div><span className="font-medium">{e.name}</span></div></td>
                <td className="px-4 py-3">{e.role}</td>
                <td className="px-4 py-3">{e.department}</td>
                <td className="px-4 py-3"><StatusBadge tone={e.status==="present"?"success":e.status==="conge"?"info":"danger"}>{e.status}</StatusBadge></td>
                <td className="px-4 py-3 text-xs">{e.hiredAt}</td>
                <td className="px-4 py-3"><button onClick={() => setSelected(e)} className="rounded-md border border-input px-3 py-1 text-xs font-medium hover:bg-muted">Voir la fiche</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
      {selected && <EmpDetail emp={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function EmpDetail({ emp, onClose }: { emp: Employee; onClose: () => void }) {
  const [tab, setTab] = useState<"info" | "docs" | "leave">("info");
  const [showSalary, setShowSalary] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{emp.name.split(" ").map(s=>s[0]).join("")}</div>
            <div><h2 className="text-xl font-bold text-primary">{emp.name}</h2><div className="text-sm text-muted-foreground">{emp.role} · {emp.department}</div></div>
          </div>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="flex gap-1 border-b border-border px-6">
          {[["info","Informations"],["docs","Documents"],["leave","Présence & congés"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k as "info"|"docs"|"leave")} className={`border-b-2 px-3 py-3 text-sm font-medium ${tab===k?"border-accent text-accent":"border-transparent text-muted-foreground hover:text-foreground"}`}>{l}</button>
          ))}
        </div>
        <div className="p-6">
          {tab === "info" && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Email" value={emp.email} /><Field label="Téléphone" value={emp.phone} />
              <Field label="Manager" value={emp.manager} /><Field label="Date d'entrée" value={emp.hiredAt} />
              <div><div className="text-xs font-semibold uppercase text-muted-foreground">Salaire</div><div className="flex items-center gap-2 font-semibold">{showSalary ? `${emp.salary.toLocaleString("fr-FR")} MAD` : "•••••"}<button onClick={() => setShowSalary(v => !v)}>{showSalary ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}</button></div></div>
              <Field label="Statut" value={emp.status} />
            </div>
          )}
          {tab === "docs" && (
            <div className="space-y-2">
              {emp.documents.map(d => (
                <div key={d.name} className="flex items-center justify-between rounded-md border border-border p-3"><div className="flex items-center gap-2">📄<span className="text-sm font-medium">{d.name}</span><span className="text-xs text-muted-foreground">({d.size})</span></div><button onClick={() => toast("Téléchargement simulé")} className="flex items-center gap-1 rounded-md border border-input px-3 py-1 text-xs hover:bg-muted"><Download className="h-3 w-3" />Télécharger</button></div>
              ))}
            </div>
          )}
          {tab === "leave" && (
            <div>
              <div className="mb-3 flex items-center justify-between"><div className="text-sm">Solde restant : <span className="font-bold text-primary">{emp.leavesRemaining} jours</span></div><button onClick={() => setLeaveOpen(true)} className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white"><Plus className="h-3 w-3" />Demande de congé</button></div>
              <div className="space-y-2">{emp.leaves.map((l, i) => <div key={i} className="rounded-md border border-border p-2 text-sm"><span className="font-medium">{l.type}</span> · du {new Date(l.from).toLocaleDateString("fr-FR")} au {new Date(l.to).toLocaleDateString("fr-FR")}</div>)}</div>
              {leaveOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setLeaveOpen(false)}>
                  <form onSubmit={e => { e.preventDefault(); toast.success("Demande de congé envoyée"); setLeaveOpen(false); }} onClick={e => e.stopPropagation()} className="w-full max-w-sm rounded-xl bg-white p-6">
                    <h3 className="mb-3 text-lg font-bold text-primary">Demande de congé</h3>
                    <div className="space-y-2">
                      <input required type="date" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
                      <input required type="date" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
                      <select className="w-full rounded-md border border-input px-3 py-2 text-sm"><option>Congé payé</option><option>RTT</option><option>Sans solde</option></select>
                    </div>
                    <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setLeaveOpen(false)} className="rounded-md border px-4 py-2 text-sm">Annuler</button><button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Envoyer</button></div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs font-semibold uppercase text-muted-foreground">{label}</div><div>{value}</div></div>;
}
