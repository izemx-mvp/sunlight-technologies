import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, GlassCard, StatusBadge } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import type { SocialChannel } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/social-accounts")({
  head: () => ({ meta: [{ title: "Comptes connectés — Sunlight" }] }),
  component: Accounts,
});

const nets: { key: SocialChannel; name: string; color: string }[] = [
  { key: "linkedin", name: "LinkedIn", color: "#0A66C2" },
  { key: "facebook", name: "Facebook", color: "#1877F2" },
  { key: "instagram", name: "Instagram", color: "#E1306C" },
];

function Accounts() {
  const { socialSettings, setSocialSettings } = useStore();
  const update = (k: SocialChannel, patch: Partial<typeof socialSettings[SocialChannel]>) => {
    setSocialSettings({ ...socialSettings, [k]: { ...socialSettings[k], ...patch } });
  };
  const toggle = (k: SocialChannel) => {
    const s = socialSettings[k];
    update(k, { connected: !s.connected, account: !s.connected ? `@Sunlight${nets.find(n=>n.key===k)?.name}` : "—" });
    toast.success(s.connected ? `${k} déconnecté` : `${k} connecté ✓`);
  };

  return (
    <div>
      <PageHeader title="Comptes connectés" subtitle="Gérez vos réseaux sociaux" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {nets.map(n => {
          const s = socialSettings[n.key];
          return (
            <GlassCard key={n.key}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg font-bold text-white" style={{ background: n.color }}>{n.name[0]}</div>
                  <div>
                    <div className="font-semibold text-primary">{n.name}</div>
                    <div className="text-xs text-muted-foreground">{s.account}</div>
                  </div>
                </div>
                <StatusBadge tone={s.connected ? "success" : "muted"}>{s.connected ? "Connecté ✓" : "Non connecté"}</StatusBadge>
              </div>
              <button onClick={() => toggle(n.key)} className={`w-full rounded-md px-3 py-2 text-sm font-semibold ${s.connected ? "border border-danger text-danger hover:bg-danger/5" : "bg-primary text-white hover:bg-primary/90"}`}>
                {s.connected ? "Déconnecter" : "Connecter"}
              </button>

              {s.connected && (
                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Fréquence</label>
                    <select value={s.frequency} onChange={e => update(n.key, { frequency: e.target.value })} className="w-full rounded-md border border-input px-2 py-1.5 text-sm">
                      <option>Quotidien</option><option>3x/semaine</option><option>Hebdomadaire</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">Tonalité</label>
                    <select value={s.tone} onChange={e => update(n.key, { tone: e.target.value })} className="w-full rounded-md border border-input px-2 py-1.5 text-sm">
                      <option>professionnelle</option><option>décontractée</option><option>inspirante</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 flex justify-between text-xs font-semibold uppercase text-muted-foreground"><span>Images / post</span><span>{s.imagesPerPost}</span></label>
                    <input type="range" min={1} max={4} value={s.imagesPerPost} onChange={e => update(n.key, { imagesPerPost: parseInt(e.target.value) })} className="w-full" />
                  </div>
                  <button onClick={() => toast.success(`Réglages ${n.name} enregistrés`)} className="w-full rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white">Enregistrer les réglages</button>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
