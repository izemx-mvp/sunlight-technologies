import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, GlassCard } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/config")({
  head: () => ({ meta: [{ title: "Configuration des agents — Sunlight" }] }),
  component: Config,
});

const tabs = ["Service Client", "Community Management", "Prospection", "Agent Interne"] as const;

function Config() {
  const { agentConfig, setAgentConfig } = useStore();
  const [tab, setTab] = useState<typeof tabs[number]>("Service Client");

  return (
    <div>
      <PageHeader title="Configuration des agents" subtitle="Ajustez le comportement de chaque agent IA" />
      <div className="mb-4 flex flex-wrap gap-1 border-b border-border">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`border-b-2 px-4 py-2 text-sm font-medium ${tab===t?"border-accent text-accent":"border-transparent text-muted-foreground hover:text-foreground"}`}>{t}</button>
        ))}
      </div>

      {tab === "Service Client" && <SC config={agentConfig.serviceClient} onSave={sc => { setAgentConfig({ ...agentConfig, serviceClient: sc }); toast.success("Configuration enregistrée"); }} />}
      {tab === "Community Management" && <CM config={agentConfig.community} onSave={cm => { setAgentConfig({ ...agentConfig, community: cm }); toast.success("Configuration enregistrée"); }} />}
      {tab === "Prospection" && <PR config={agentConfig.prospection} onSave={pr => { setAgentConfig({ ...agentConfig, prospection: pr }); toast.success("Configuration enregistrée"); }} />}
      {tab === "Agent Interne" && <IN config={agentConfig.interne} onSave={ai => { setAgentConfig({ ...agentConfig, interne: ai }); toast.success("Configuration enregistrée"); }} />}
    </div>
  );
}

type SCConfig = { tone: string; escalationDelay: number; escalationUnit: string; languages: string[]; hoursFrom: string; hoursTo: string };
function SC({ config, onSave }: { config: SCConfig; onSave: (c: SCConfig) => void }) {
  const [f, setF] = useState(config);
  const allLangs = ["Français", "Arabe", "Anglais", "Espagnol"];
  return (
    <GlassCard className="max-w-2xl space-y-4">
      <Row label="Tonalité des réponses"><select value={f.tone} onChange={e => setF({...f, tone: e.target.value})} className="rounded-md border border-input px-3 py-2 text-sm"><option>professionnelle</option><option>chaleureuse</option><option>concise</option></select></Row>
      <Row label="Délai max avant escalade"><div className="flex gap-2"><input type="number" value={f.escalationDelay} onChange={e => setF({...f, escalationDelay: parseInt(e.target.value)})} className="w-24 rounded-md border border-input px-3 py-2 text-sm" /><select value={f.escalationUnit} onChange={e => setF({...f, escalationUnit: e.target.value})} className="rounded-md border border-input px-2 py-2 text-sm"><option>minutes</option><option>heures</option></select></div></Row>
      <Row label="Langues supportées"><div className="flex flex-wrap gap-1">{allLangs.map(l => <button key={l} type="button" onClick={() => setF({...f, languages: f.languages.includes(l) ? f.languages.filter(x=>x!==l) : [...f.languages, l]})} className={`rounded-full px-2.5 py-0.5 text-xs ${f.languages.includes(l) ? "bg-primary text-white" : "border border-input"}`}>{l}</button>)}</div></Row>
      <Row label="Heures disponibilité chat"><div className="flex items-center gap-2"><input type="time" value={f.hoursFrom} onChange={e => setF({...f, hoursFrom: e.target.value})} className="rounded-md border border-input px-2 py-2 text-sm" /><span>→</span><input type="time" value={f.hoursTo} onChange={e => setF({...f, hoursTo: e.target.value})} className="rounded-md border border-input px-2 py-2 text-sm" /></div></Row>
      <button onClick={() => onSave(f)} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Enregistrer les modifications</button>
    </GlassCard>
  );
}

type CMConfig = { objectives: string[]; frequency: Record<"linkedin"|"facebook"|"instagram", string>; tone: string; captionLength: number; imagesPerPost: number };
function CM({ config, onSave }: { config: CMConfig; onSave: (c: CMConfig) => void }) {
  const [f, setF] = useState(config);
  const objectives = ["Notoriété", "Génération de leads", "Engagement", "Recrutement"];
  return (
    <GlassCard className="max-w-2xl space-y-4">
      <Row label="Objectifs marketing"><div className="flex flex-wrap gap-2">{objectives.map(o => <label key={o} className="flex items-center gap-1 text-sm"><input type="checkbox" checked={f.objectives.includes(o)} onChange={e => setF({...f, objectives: e.target.checked ? [...f.objectives, o] : f.objectives.filter(x=>x!==o)})} />{o}</label>)}</div></Row>
      {(["linkedin","facebook","instagram"] as const).map(n => (
        <Row key={n} label={`Fréquence ${n}`}><select value={f.frequency[n]} onChange={e => setF({...f, frequency: {...f.frequency, [n]: e.target.value}})} className="rounded-md border border-input px-3 py-2 text-sm"><option>Quotidien</option><option>3x/semaine</option><option>hebdomadaire</option></select></Row>
      ))}
      <Row label="Tonalité"><select value={f.tone} onChange={e => setF({...f, tone: e.target.value})} className="rounded-md border border-input px-3 py-2 text-sm"><option>professionnelle</option><option>décontractée</option><option>inspirante</option></select></Row>
      <Row label={`Longueur légende (${f.captionLength} caractères)`}><input type="range" min={80} max={400} value={f.captionLength} onChange={e => setF({...f, captionLength: parseInt(e.target.value)})} className="w-full" /></Row>
      <Row label={`Images par post (${f.imagesPerPost})`}><input type="range" min={1} max={4} value={f.imagesPerPost} onChange={e => setF({...f, imagesPerPost: parseInt(e.target.value)})} className="w-full" /></Row>
      <button onClick={() => onSave(f)} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Enregistrer les modifications</button>
    </GlassCard>
  );
}

type PRConfig = { sectors: string[]; sources: Record<string, boolean>; followUpFrequency: string; firstFollowUpDelay: number };
function PR({ config, onSave }: { config: PRConfig; onSave: (c: PRConfig) => void }) {
  const [f, setF] = useState(config);
  const [tag, setTag] = useState("");
  return (
    <GlassCard className="max-w-2xl space-y-4">
      <Row label="Secteurs cibles"><div className="flex flex-wrap gap-1">{f.sectors.map(s => <span key={s} className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">{s}<button onClick={() => setF({...f, sectors: f.sectors.filter(x=>x!==s)})}>×</button></span>)}<input value={tag} onChange={e => setTag(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && tag.trim()) { setF({...f, sectors: [...f.sectors, tag.trim()]}); setTag(""); }}} placeholder="+ secteur" className="rounded-full border border-input px-2 py-0.5 text-xs" /></div></Row>
      <Row label="Sources de leads actives"><div className="space-y-1">{Object.entries(f.sources).map(([s, v]) => <label key={s} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={v} onChange={e => setF({...f, sources: {...f.sources, [s]: e.target.checked}})} />{s}</label>)}</div></Row>
      <Row label="Fréquence de relance par défaut"><select value={f.followUpFrequency} onChange={e => setF({...f, followUpFrequency: e.target.value})} className="rounded-md border border-input px-3 py-2 text-sm"><option>quotidienne</option><option>hebdomadaire</option><option>bimensuelle</option></select></Row>
      <Row label="Délai avant 1re relance (jours)"><input type="number" value={f.firstFollowUpDelay} onChange={e => setF({...f, firstFollowUpDelay: parseInt(e.target.value)})} className="w-24 rounded-md border border-input px-3 py-2 text-sm" /></Row>
      <button onClick={() => onSave(f)} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Enregistrer les modifications</button>
    </GlassCard>
  );
}

type INConfig = { accountingCategories: string[]; recruitmentSteps: string[]; employeeFields: string[] };
function IN({ config, onSave }: { config: INConfig; onSave: (c: INConfig) => void }) {
  const [f, setF] = useState(config);
  const allFields = ["Nom", "Poste", "Département", "Manager", "Salaire", "Date d'entrée", "Téléphone", "Email"];
  return (
    <GlassCard className="max-w-2xl space-y-4">
      <Row label="Catégories comptables"><div className="flex flex-wrap gap-1">{f.accountingCategories.map(c => <span key={c} className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">{c}<button onClick={() => setF({...f, accountingCategories: f.accountingCategories.filter(x=>x!==c)})}>×</button></span>)}</div></Row>
      <Row label="Étapes recrutement"><div className="space-y-1">{f.recruitmentSteps.map((s, i) => <div key={i} className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{i+1}.</span><input value={s} onChange={e => { const arr = [...f.recruitmentSteps]; arr[i] = e.target.value; setF({...f, recruitmentSteps: arr}); }} className="flex-1 rounded-md border border-input px-2 py-1 text-sm" /><button onClick={() => setF({...f, recruitmentSteps: f.recruitmentSteps.filter((_,x)=>x!==i)})} className="text-danger">×</button></div>)}<button type="button" onClick={() => setF({...f, recruitmentSteps: [...f.recruitmentSteps, "Nouvelle étape"]})} className="text-xs text-accent">+ ajouter</button></div></Row>
      <Row label="Champs fiche employé"><div className="flex flex-wrap gap-2">{allFields.map(x => <label key={x} className="flex items-center gap-1 text-sm"><input type="checkbox" checked={f.employeeFields.includes(x)} onChange={e => setF({...f, employeeFields: e.target.checked ? [...f.employeeFields, x] : f.employeeFields.filter(y=>y!==x)})} />{x}</label>)}</div></Row>
      <button onClick={() => onSave(f)} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Enregistrer les modifications</button>
    </GlassCard>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">{label}</label>{children}</div>;
}
