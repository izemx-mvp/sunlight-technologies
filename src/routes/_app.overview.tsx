import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, GlassCard, StatusBadge } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/_app/overview")({
  head: () => ({ meta: [{ title: "Vue globale — Sunlight" }] }),
  component: Overview,
});

function Overview() {
  const { conversations, tickets, leads, posts, employees } = useStore();
  const openTickets = tickets.filter(t => t.status !== "resolu").length;
  const activeLeads = leads.filter(l => !["converti", "perdu"].includes(l.stage)).length;

  const agentData = [
    { agent: "Service Client", volume: conversations.length * 12, color: "#1B2A4A" },
    { agent: "Community", volume: posts.length, color: "#C8862B" },
    { agent: "Prospection", volume: leads.length, color: "#2d5f78" },
    { agent: "Interne", volume: employees.length, color: "#5B6472" },
  ];
  const pieData = [
    { name: "WhatsApp", value: 42, color: "#25D366" },
    { name: "Site web", value: 34, color: "#1B2A4A" },
    { name: "LinkedIn", value: 14, color: "#0A66C2" },
    { name: "Autres", value: 10, color: "#C8862B" },
  ];

  return (
    <div>
      <PageHeader title="Vue globale" subtitle="Performance consolidée des 4 agents IA" />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { l: "Conversations", v: conversations.length * 12, t: "Ce mois" },
          { l: "Tickets ouverts", v: openTickets, t: "À traiter" },
          { l: "Leads actifs", v: activeLeads, t: "En pipeline" },
          { l: "Collaborateurs", v: employees.length, t: "Actifs" },
        ].map(k => (
          <GlassCard key={k.l}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.l}</div>
            <div className="mt-1 text-3xl font-bold text-primary">{k.v}</div>
            <StatusBadge tone="muted">{k.t}</StatusBadge>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <GlassCard>
          <h3 className="mb-3 font-semibold text-primary">Volume par agent</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="agent" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
                  {agentData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="mb-3 font-semibold text-primary">Répartition des interactions</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
