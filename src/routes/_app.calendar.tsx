import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader, GlassCard, StatusBadge } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import type { Post, PostStatus, SocialChannel } from "@/lib/mock-data";
import { toast } from "sonner";
import { Plus, X, ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, Eye, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/calendar")({
  head: () => ({ meta: [{ title: "Calendrier éditorial — Sunlight" }] }),
  component: CalendarPage,
});

const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const dayNames = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const gradients = ["linear-gradient(135deg,#1B2A4A,#C8862B)","linear-gradient(135deg,#C8862B,#f4c07a)","linear-gradient(135deg,#1B2A4A,#5B6472)","linear-gradient(135deg,#2d3f68,#C8862B)"];
const channelBadge = (c: SocialChannel) => ({ linkedin: "bg-[#0A66C2]", facebook: "bg-[#1877F2]", instagram: "bg-gradient-to-tr from-[#833AB4] via-[#E1306C] to-[#F77737]" }[c]);

function CalendarPage() {
  const { posts, setPosts } = useStore();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);

  const monthPosts = useMemo(() => posts.filter(p => { const d = new Date(p.date); return d.getFullYear() === year && d.getMonth() === month; }), [posts, year, month]);

  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Mon = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const nav = (delta: number) => { const d = new Date(year, month + delta, 1); setYear(d.getFullYear()); setMonth(d.getMonth()); };

  const cells: (number | null)[] = [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const publishNow = (p: Post) => {
    setPosts(posts.map(x => x.id === p.id ? { ...x, status: "publie" as PostStatus, stats: { likes: 0, comments: 0, shares: 0, reach: 0 } } : x));
    toast.success("Post publié");
    setSelected(null);
  };
  const removePost = (id: string) => { setPosts(posts.filter(p => p.id !== id)); toast.success("Post supprimé"); setSelected(null); };

  return (
    <div>
      <PageHeader title="Calendrier éditorial"
        right={<button onClick={() => setCreating(true)} className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"><Plus className="h-4 w-4" />Nouveau post</button>} />

      <GlassCard>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => nav(-1)} className="rounded-md border border-input p-1.5 hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
            <div className="min-w-40 text-center font-semibold text-primary">{monthNames[month]} {year}</div>
            <button onClick={() => nav(1)} className="rounded-md border border-input p-1.5 hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="text-sm text-muted-foreground">{monthPosts.length} post(s)</div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-muted-foreground">
          {dayNames.map(d => <div key={d} className="p-2 text-center">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            const dayPosts = day ? monthPosts.filter(p => new Date(p.date).getDate() === day) : [];
            return (
              <div key={i} className={`min-h-24 rounded-md border p-1 ${day ? "border-border bg-white/60" : "border-transparent"}`}>
                {day && <div className="mb-1 text-xs font-semibold text-slate-ink">{day}</div>}
                <div className="space-y-1">
                  {dayPosts.map(p => (
                    <button key={p.id} onClick={() => setSelected(p)} className="block w-full text-left">
                      <div className="relative h-10 w-full overflow-hidden rounded" style={{ background: p.gradient }}>
                        <div className="absolute right-0.5 top-0.5 flex gap-0.5">
                          {p.channels.map(c => <span key={c} className={`h-4 w-4 rounded-full ${channelBadge(c)} text-[8px] flex items-center justify-center text-white font-bold`}>{c[0].toUpperCase()}</span>)}
                        </div>
                        <div className={`absolute bottom-0.5 left-0.5 rounded px-1 text-[9px] font-semibold ${p.status==="publie"?"bg-[oklch(0.68_0.16_150)] text-white":p.status==="planifie"?"bg-[oklch(0.65_0.13_240)] text-white":"bg-muted text-slate-ink"}`}>{p.status}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {selected && <PostDetail post={selected} onClose={() => setSelected(null)} onPublish={publishNow} onDelete={removePost} />}
      {creating && <NewPost onClose={() => setCreating(false)} onCreate={(p) => { setPosts([p, ...posts]); setCreating(false); toast.success("Post créé"); }} defaultDate={new Date(year, month, 15, 10).toISOString()} />}
    </div>
  );
}

export function PostDetail({ post, onClose, onPublish, onDelete }: { post: Post; onClose: () => void; onPublish: (p: Post) => void; onDelete: (id: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="grid max-h-[92vh] w-full max-w-4xl grid-cols-1 gap-0 overflow-y-auto rounded-xl bg-white shadow-2xl lg:grid-cols-2" onClick={e => e.stopPropagation()}>
        <div className="p-6" style={{ background: "linear-gradient(180deg, #f8fafc, #ffffff)" }}>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#C8862B] to-[#f4c07a] text-white font-bold">S</div>
            <div><div className="text-sm font-semibold">Sunlight Technologies</div><div className="text-[10px] text-muted-foreground">Sponsorisé · 1h</div></div>
          </div>
          <p className="mb-3 text-sm">{post.caption}</p>
          <div className="h-56 w-full rounded-md" style={{ background: post.gradient }} />
          {post.stats && (
            <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {post.stats.likes}</span>
              <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {post.stats.comments}</span>
              <span className="flex items-center gap-1"><Share2 className="h-3.5 w-3.5" /> {post.stats.shares}</span>
              <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {post.stats.reach}</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{new Date(post.date).toLocaleString("fr-FR")}</div>
              <h2 className="mt-1 text-xl font-bold text-primary">{post.title}</h2>
              <div className="mt-2 flex gap-1">{post.channels.map(c => <StatusBadge key={c} tone="info">{c}</StatusBadge>)}</div>
              <div className="mt-2"><StatusBadge tone={post.status === "publie" ? "success" : post.status === "planifie" ? "info" : "muted"}>{post.status}</StatusBadge></div>
            </div>
            <button onClick={onClose}><X className="h-5 w-5" /></button>
          </div>
          <div className="mt-6 space-y-2">
            <button className="w-full rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-muted">Modifier</button>
            {post.status !== "publie" && <button onClick={() => onPublish(post)} className="w-full rounded-md bg-[oklch(0.68_0.16_150)] px-3 py-2 text-sm font-semibold text-white">Publier maintenant</button>}
            <button onClick={() => onDelete(post.id)} className="flex w-full items-center justify-center gap-1 rounded-md border border-danger px-3 py-2 text-sm font-semibold text-danger hover:bg-danger/5"><Trash2 className="h-4 w-4" /> Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewPost({ onClose, onCreate, defaultDate }: { onClose: () => void; onCreate: (p: Post) => void; defaultDate: string }) {
  const [f, setF] = useState({ title: "", caption: "", channels: ["linkedin"] as SocialChannel[], date: defaultDate.slice(0, 16) });
  const toggle = (c: SocialChannel) => setF({ ...f, channels: f.channels.includes(c) ? f.channels.filter(x => x !== c) : [...f.channels, c] });
  const submit = (status: PostStatus) => (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ id: `p${Date.now()}`, title: f.title, caption: f.caption, channels: f.channels, date: new Date(f.date).toISOString(), status, gradient: gradients[Math.floor(Math.random() * gradients.length)] });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form onSubmit={submit("planifie")} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-primary">Nouveau post</h3><button type="button" onClick={onClose}><X className="h-5 w-5" /></button></div>
        <div className="space-y-3">
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-input text-sm text-muted-foreground">📷 Cliquez pour uploader une image</div>
          <input required value={f.title} onChange={e => setF({ ...f, title: e.target.value })} placeholder="Titre" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <textarea required value={f.caption} onChange={e => setF({ ...f, caption: e.target.value })} placeholder="Légende" rows={3} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <div>
            <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Canaux</div>
            <div className="flex gap-1">
              {(["linkedin", "facebook", "instagram"] as SocialChannel[]).map(c => (
                <button type="button" key={c} onClick={() => toggle(c)} className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${f.channels.includes(c) ? "bg-primary text-white" : "border border-input"}`}>{c}</button>
              ))}
            </div>
          </div>
          <input type="datetime-local" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={submit("brouillon")} className="rounded-md border border-input px-4 py-2 text-sm">Enregistrer brouillon</button>
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Planifier</button>
        </div>
      </form>
    </div>
  );
}
