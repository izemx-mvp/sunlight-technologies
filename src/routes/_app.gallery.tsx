import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader, GlassCard, StatusBadge, EmptyState } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import type { Post, SocialChannel, PostStatus } from "@/lib/mock-data";
import { PostDetail } from "./_app.calendar";

export const Route = createFileRoute("/_app/gallery")({
  head: () => ({ meta: [{ title: "Galerie — Sunlight" }] }),
  component: Gallery,
});

function Gallery() {
  const { posts, setPosts } = useStore();
  const [channel, setChannel] = useState<"all" | SocialChannel>("all");
  const [status, setStatus] = useState<"all" | PostStatus>("all");
  const [month, setMonth] = useState<"all" | string>("all");
  const [selected, setSelected] = useState<Post | null>(null);

  const filtered = useMemo(() => posts.filter(p =>
    (channel === "all" || p.channels.includes(channel)) &&
    (status === "all" || p.status === status) &&
    (month === "all" || new Date(p.date).getMonth().toString() === month)
  ), [posts, channel, status, month]);

  const months = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

  return (
    <div>
      <PageHeader title="Galerie de posts" subtitle={`${filtered.length} publications`} />
      <GlassCard className="mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1">
            {(["all", "linkedin", "facebook", "instagram"] as const).map(c => (
              <button key={c} onClick={() => setChannel(c)} className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${channel === c ? "bg-primary text-white" : "border border-input"}`}>{c === "all" ? "Tous" : c}</button>
            ))}
          </div>
          <select value={month} onChange={e => setMonth(e.target.value)} className="rounded-md border border-input px-2 py-1.5 text-sm">
            <option value="all">Tous les mois</option>
            {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value as "all" | PostStatus)} className="rounded-md border border-input px-2 py-1.5 text-sm">
            <option value="all">Tous statuts</option><option value="publie">Publié</option><option value="planifie">Planifié</option><option value="brouillon">Brouillon</option>
          </select>
        </div>
      </GlassCard>

      {filtered.length === 0 ? <EmptyState /> :
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map(p => (
            <button key={p.id} onClick={() => setSelected(p)} className="group text-left">
              <div className="glass-card overflow-hidden rounded-xl p-0">
                <div className="relative aspect-square" style={{ background: p.gradient }}>
                  <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-xs font-semibold text-white/90">{p.title}</div>
                </div>
                <div className="p-2">
                  <div className="truncate text-xs font-semibold">{p.title}</div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{new Date(p.date).toLocaleDateString("fr-FR")}</span>
                    <StatusBadge tone={p.status === "publie" ? "success" : p.status === "planifie" ? "info" : "muted"}>{p.status}</StatusBadge>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>}
      {selected && <PostDetail post={selected} onClose={() => setSelected(null)} onPublish={() => {}} onDelete={(id) => { setPosts(posts.filter(x => x.id !== id)); setSelected(null); }} />}
    </div>
  );
}
