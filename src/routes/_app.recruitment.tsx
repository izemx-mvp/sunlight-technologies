import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, GlassCard, StatusBadge } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import type { Candidate, CandidateStage, JobPosting } from "@/lib/mock-data";
import { toast } from "sonner";
import { Plus, X, Star, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_app/recruitment")({
  head: () => ({ meta: [{ title: "Recrutement — Sunlight" }] }),
  component: Recruitment,
});

const stages: { key: CandidateStage; label: string }[] = [
  { key: "recue", label: "Candidature reçue" }, { key: "preselection", label: "Présélection" },
  { key: "entretien", label: "Entretien" }, { key: "offre", label: "Offre" },
  { key: "recrute", label: "Recruté" },
];
const nextS: Record<CandidateStage, CandidateStage> = { recue: "preselection", preselection: "entretien", entretien: "offre", offre: "recrute", recrute: "recrute", refuse: "refuse" };

function Recruitment() {
  const { jobs, setJobs, candidates, setCandidates } = useStore();
  const [jobId, setJobId] = useState(jobs[0]?.id);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [creatingJob, setCreatingJob] = useState(false);
  const list = candidates.filter(c => c.jobId === jobId);

  return (
    <div>
      <PageHeader title="Recrutement"
        right={<>
          <select value={jobId} onChange={e => setJobId(e.target.value)} className="rounded-md border border-input bg-white px-3 py-2 text-sm">
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
          <button onClick={() => setCreatingJob(true)} className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Ouvrir un poste</button>
        </>} />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        {stages.map(s => {
          const items = list.filter(c => c.stage === s.key);
          return (
            <div key={s.key} className="rounded-xl bg-white/60 p-2 backdrop-blur">
              <div className="flex items-center justify-between px-1 py-2"><div className="font-semibold text-primary">{s.label}</div><div className="text-xs text-muted-foreground">{items.length}</div></div>
              <div className="space-y-2">
                {items.map(c => (
                  <div key={c.id} onClick={() => setSelected(c)} className="cursor-pointer rounded-lg border border-border bg-white p-3 shadow-sm hover:shadow-md">
                    <div className="font-semibold text-primary">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.source} · {new Date(c.appliedAt).toLocaleDateString("fr-FR")}</div>
                    <div className="mt-1 flex">{[1,2,3,4,5].map(i => <Star key={i} className={`h-3 w-3 ${i <= c.rating ? "fill-accent text-accent" : "text-muted"}`} />)}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selected && <CandidateDetail candidate={selected} onClose={() => setSelected(null)} onAdvance={() => { setCandidates(candidates.map(x => x.id === selected.id ? { ...x, stage: nextS[x.stage] } : x)); toast.success("Candidat avancé"); setSelected(null); }} onReject={() => { setCandidates(candidates.map(x => x.id === selected.id ? { ...x, stage: "refuse" } : x)); toast("Candidat refusé"); setSelected(null); }} />}
      {creatingJob && (
        <NewJob onClose={() => setCreatingJob(false)} onCreate={j => { setJobs([...jobs, j]); setJobId(j.id); setCreatingJob(false); toast.success("Poste ouvert"); }} />
      )}
    </div>
  );
}

function CandidateDetail({ candidate, onClose, onAdvance, onReject }: { candidate: Candidate; onClose: () => void; onAdvance: () => void; onReject: () => void }) {
  const [notes, setNotes] = useState(candidate.notes);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between"><div><h2 className="text-xl font-bold text-primary">{candidate.name}</h2><div className="text-sm text-muted-foreground">{candidate.source}</div><div className="mt-1 flex">{[1,2,3,4,5].map(i => <Star key={i} className={`h-4 w-4 ${i <= candidate.rating ? "fill-accent text-accent" : "text-muted"}`} />)}</div></div><button onClick={onClose}><X className="h-5 w-5" /></button></div>
        <div className="mb-3 rounded-md bg-muted/50 p-3 text-sm"><div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">CV</div>{candidate.cvSummary}</div>
        <div className="mb-3"><label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Notes d'entretien</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full rounded-md border border-input px-3 py-2 text-sm" /></div>
        <div className="flex justify-end gap-2"><button onClick={onReject} className="rounded-md border border-danger px-3 py-2 text-sm font-semibold text-danger">Refuser</button><button onClick={onAdvance} className="flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white">Avancer <ArrowRight className="h-3 w-3" /></button></div>
      </div>
    </div>
  );
}

function NewJob({ onClose, onCreate }: { onClose: () => void; onCreate: (j: JobPosting) => void }) {
  const [f, setF] = useState({ title: "", department: "Commercial", description: "" });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form onSubmit={e => { e.preventDefault(); onCreate({ id: `j${Date.now()}`, ...f }); }} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-primary">Nouveau poste</h3><button type="button" onClick={onClose}><X className="h-5 w-5" /></button></div>
        <div className="space-y-2">
          <input required value={f.title} onChange={e => setF({ ...f, title: e.target.value })} placeholder="Titre du poste" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <select value={f.department} onChange={e => setF({ ...f, department: e.target.value })} className="w-full rounded-md border border-input px-3 py-2 text-sm"><option>Commercial</option><option>SAV</option><option>Production</option><option>RH</option><option>Marketing</option></select>
          <textarea required value={f.description} onChange={e => setF({ ...f, description: e.target.value })} placeholder="Description…" rows={4} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
        </div>
        <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm">Annuler</button><button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Ouvrir</button></div>
      </form>
    </div>
  );
}
