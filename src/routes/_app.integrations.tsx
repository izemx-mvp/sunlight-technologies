import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, GlassCard, StatusBadge } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/integrations")({
  head: () => ({ meta: [{ title: "Intégrations — Sunlight" }] }),
  component: Integrations,
});

function Integrations() {
  const { integrations, setIntegrations } = useStore();
  const toggle = (id: string) => {
    setIntegrations(integrations.map(i => i.id === id ? { ...i, connected: !i.connected, lastSync: new Date().toISOString() } : i));
    const it = integrations.find(i => i.id === id);
    toast.success(it?.connected ? `${it.name} déconnecté` : `${it?.name} connecté ✓`);
  };
  return (
    <div>
      <PageHeader title="Intégrations" subtitle="Connectez vos outils externes" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map(i => (
          <GlassCard key={i.id}>
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-lg font-bold text-white">{i.logo}</div>
                <div><div className="font-semibold text-primary">{i.name}</div><div className="text-xs text-muted-foreground">Dernière sync : {typeof i.lastSync === "string" && i.lastSync !== "—" ? new Date(i.lastSync).toLocaleString("fr-FR") : "—"}</div></div>
              </div>
              <StatusBadge tone={i.connected ? "success" : "muted"}>{i.connected ? "Connecté" : "Non connecté"}</StatusBadge>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggle(i.id)} className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold ${i.connected ? "border border-danger text-danger hover:bg-danger/5" : "bg-primary text-white hover:bg-primary/90"}`}>{i.connected ? "Déconnecter" : "Connecter"}</button>
              <a href="#" className="rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-muted">Documentation</a>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
