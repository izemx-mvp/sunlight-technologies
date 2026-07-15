import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { PageHeader, GlassCard, StatusBadge } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import { MessagesSquare, Megaphone, Target, Users, TrendingUp, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Tableau de bord — Sunlight" }, { name: "description", content: "Vue d'ensemble de la plateforme Sunlight." }] }),
  component: Dashboard,
});

const periods = [
  { key: "1", label: "Aujourd'hui", mult: 0.06 },
  { key: "7", label: "7 jours", mult: 0.3 },
  { key: "30", label: "30 jours", mult: 1 },
  { key: "90", label: "90 jours", mult: 2.9 },
];

function Dashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("30");
  const [chartMode, setChartMode] = useState<"conv" | "leads" | "posts">("conv");
  const { posts } = useStore();
  const mult = periods.find(p => p.key === period)!.mult;

  const kpis = [
    { icon: MessagesSquare, color: "#1B2A4A", label: "Service Client", value: Math.round(128 * mult), suffix: "conversations traitées", trend: 12, sub: "Temps de réponse moyen : 45s", to: "/conversations" },
    { icon: Megaphone, color: "#C8862B", label: "Community Management", value: Math.round(24 * mult), suffix: "posts publiés", trend: 8, sub: "Taux d'engagement moyen : 4,2%", to: "/calendar" },
    { icon: Target, color: "#2d5f78", label: "Prospection", value: Math.round(37 * mult), suffix: "leads actifs", trend: 18, sub: "9 convertis ce mois", to: "/pipeline" },
    { icon: Users, color: "#5B6472", label: "Agent Interne", value: 48, suffix: "collaborateurs", trend: 2, sub: "6 postes ouverts en recrutement", to: "/employees" },
  ];

  const areaData = useMemo(() => {
    const days = Math.min(30, Math.round(parseInt(period)));
    return Array.from({ length: days }, (_, i) => {
      const base = chartMode === "conv" ? 40 : chartMode === "leads" ? 6 : 2;
      const variance = chartMode === "conv" ? 30 : chartMode === "leads" ? 8 : 3;
      const v = Math.round(base + Math.sin(i / 3) * variance + Math.random() * variance);
      return { day: `${i + 1}`, value: Math.max(1, v) };
    });
  }, [period, chartMode]);

  const channelData = [
    { channel: "Site web", value: 34 },
    { channel: "WhatsApp", value: 28 },
    { channel: "LinkedIn", value: 18 },
    { channel: "Salons", value: 12 },
    { channel: "Recommandations", value: 8 },
  ];

  const activity = [
    { icon: "🎯", text: "Nouveau lead qualifié : Atlas Distribution", at: "il y a 5 min" },
    { icon: "✅", text: "Ticket #1042 résolu par l'agent IA", at: "il y a 20 min" },
    { icon: "📣", text: "Post LinkedIn publié : « Nouvelle gamme LED industrielle »", at: "il y a 1h" },
    { icon: "💬", text: "Nouvelle conversation WhatsApp : Naciri Hôtellerie", at: "il y a 2h" },
    { icon: "👤", text: "Candidature reçue : poste Technicien SAV", at: "il y a 3h" },
    { icon: "💰", text: "Facture #INV-2044 marquée payée", at: "hier à 14h32" },
    { icon: "📅", text: "Post Instagram planifié pour vendredi", at: "hier à 11h04" },
    { icon: "🔥", text: "Lead converti : Groupe Ménara — 92 000 MAD", at: "hier à 09h18" },
    { icon: "🧾", text: "3 factures fournisseurs importées", at: "il y a 2 jours" },
    { icon: "🎓", text: "Formation équipe SAV planifiée", at: "il y a 2 jours" },
    { icon: "📈", text: "Rapport mensuel prospection généré", at: "il y a 3 jours" },
    { icon: "🛠", text: "Configuration Agent Community mise à jour", at: "il y a 3 jours" },
  ];

  const alerts = [
    { level: "urgent" as const, text: "3 tickets en attente depuis +24h", to: "/tickets" },
    { level: "moyen" as const, text: "2 factures fournisseurs à échéance cette semaine", to: "/accounting" },
    { level: "moyen" as const, text: "5 leads sans contact depuis 5 jours", to: "/leads" },
    { level: "faible" as const, text: "1 candidature en attente de retour depuis 3 jours", to: "/recruitment" },
  ];

  const upcomingPosts = posts.filter(p => p.status === "planifie").slice(0, 3);

  return (
    <div>
      <PageHeader title="Tableau de bord" subtitle="Vue d'ensemble de la plateforme Sunlight"
        right={
          <div className="flex rounded-md border border-border bg-white p-0.5 shadow-sm">
            {periods.map(p => (
              <button key={p.key} onClick={() => setPeriod(p.key)}
                className={`rounded px-3 py-1.5 text-sm font-medium transition ${period === p.key ? "bg-primary text-white" : "text-slate-ink hover:bg-muted"}`}>
                {p.label}
              </button>
            ))}
          </div>
        } />

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <button key={k.label} onClick={() => navigate({ to: k.to })} className="text-left">
              <GlassCard className="group h-full transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg text-white shadow-sm" style={{ background: k.color }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[oklch(0.68_0.16_150)]/15 px-2 py-0.5 text-xs font-semibold text-[oklch(0.4_0.14_150)]">
                    <TrendingUp className="h-3 w-3" /> +{k.trend}%
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-primary">{k.value}</div>
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{k.suffix}</div>
                </div>
                <div className="mt-3 text-xs text-slate-ink">{k.sub}</div>
                <div className="mt-3 text-xs font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">Ouvrir {k.label} →</div>
              </GlassCard>
            </button>
          );
        })}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <GlassCard className="xl:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-semibold text-primary">Volume de demandes clients</h3>
              <p className="text-xs text-muted-foreground">{parseInt(period)} derniers jours</p>
            </div>
            <div className="flex rounded-md border border-border bg-white p-0.5">
              {[
                { k: "conv" as const, l: "Conversations" },
                { k: "leads" as const, l: "Leads" },
                { k: "posts" as const, l: "Posts publiés" },
              ].map(t => (
                <button key={t.k} onClick={() => setChartMode(t.k)} className={`rounded px-2.5 py-1 text-xs font-medium ${chartMode === t.k ? "bg-primary text-white" : "text-slate-ink hover:bg-muted"}`}>{t.l}</button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="fillnavy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1B2A4A" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#1B2A4A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#5B6472" />
                <YAxis tick={{ fontSize: 11 }} stroke="#5B6472" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} labelFormatter={(l) => `Jour ${l}`} />
                <Area type="monotone" dataKey="value" stroke="#1B2A4A" strokeWidth={2} fill="url(#fillnavy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-1 font-semibold text-primary">Répartition des leads</h3>
          <p className="mb-3 text-xs text-muted-foreground">Par canal d'entrée</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="#5B6472" />
                <YAxis dataKey="channel" type="category" tick={{ fontSize: 11 }} stroke="#5B6472" width={100} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} formatter={(v: number) => [`${v}%`, "Part"]} />
                <Bar dataKey="value" fill="#C8862B" radius={[0, 6, 6, 0]} label={{ position: "right", fontSize: 11, fill: "#5B6472", formatter: (v: number) => `${v}%` }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <GlassCard className="xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-primary">Activité récente</h3>
            <button className="text-xs font-semibold text-accent hover:underline">Voir tout l'historique</button>
          </div>
          <div className="space-y-2">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-muted/50">
                <div className="text-lg">{a.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-foreground">{a.text}</div>
                  <div className="text-xs text-muted-foreground">{a.at}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard>
            <h3 className="mb-3 font-semibold text-primary">Alertes & actions requises</h3>
            <div className="space-y-2">
              {alerts.map((a, i) => (
                <div key={i} className="flex items-center gap-3 rounded-md border border-border bg-white/60 p-2">
                  <StatusBadge tone={a.level === "urgent" ? "danger" : a.level === "moyen" ? "warning" : "info"}>{a.level}</StatusBadge>
                  <div className="min-w-0 flex-1 text-sm">{a.text}</div>
                  <Link to={a.to} className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-white hover:bg-primary/90">Traiter</Link>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="mb-3 font-semibold text-primary">Prochaines publications</h3>
            <div className="space-y-2">
              {upcomingPosts.length ? upcomingPosts.map(p => (
                <div key={p.id} className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/50">
                  <div className="h-10 w-10 shrink-0 rounded" style={{ background: p.gradient }} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                </div>
              )) : <div className="py-4 text-center text-sm text-muted-foreground">Aucune publication planifiée</div>}
            </div>
            <Link to="/calendar" className="mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-accent hover:underline">Voir le calendrier <ArrowRight className="h-3 w-3" /></Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
