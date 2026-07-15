import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, GlassCard, StatusBadge } from "@/components/app-layout";
import { useStore } from "@/lib/store";
import type { UserAccount, UserRole } from "@/lib/mock-data";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

export const Route = createFileRoute("/_app/users")({
  head: () => ({ meta: [{ title: "Utilisateurs & rôles — Sunlight" }] }),
  component: Users,
});

const roles: UserRole[] = ["admin", "commercial", "rh", "support"];
const roleTone: Record<UserRole, "danger" | "info" | "warning" | "muted"> = { admin: "danger", commercial: "info", rh: "warning", support: "muted" };

function Users() {
  const { users, setUsers } = useStore();
  const [creating, setCreating] = useState(false);

  const toggle = (id: string) => { setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u)); toast.success("Statut mis à jour"); };
  const changeRole = (id: string, role: UserRole) => { setUsers(users.map(u => u.id === id ? { ...u, role } : u)); toast.success(`Rôle → ${role}`); };

  return (
    <div>
      <PageHeader title="Utilisateurs & rôles" subtitle={`${users.length} comptes internes`}
        right={<button onClick={() => setCreating(true)} className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Inviter un utilisateur</button>} />
      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr>
            <th className="px-4 py-3 text-left">Nom</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Rôle</th><th className="px-4 py-3 text-left">Statut</th><th className="px-4 py-3 text-left">Dernière connexion</th>
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: u.avatarColor }}>{u.name.split(" ").map(s=>s[0]).join("")}</div><span className="font-medium">{u.name}</span></div></td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3"><select value={u.role} onChange={e => changeRole(u.id, e.target.value as UserRole)} className="rounded-md border border-input bg-white px-2 py-1 text-xs">{roles.map(r => <option key={r} value={r}>{r}</option>)}</select> <StatusBadge tone={roleTone[u.role]}>{u.role}</StatusBadge></td>
                <td className="px-4 py-3"><button onClick={() => toggle(u.id)} className={`relative h-5 w-9 rounded-full transition ${u.active ? "bg-[oklch(0.68_0.16_150)]" : "bg-muted"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${u.active ? "left-4.5" : "left-0.5"}`} style={{left: u.active ? "1.125rem" : "0.125rem"}} /></button> <span className="ml-2 text-xs">{u.active ? "Actif" : "Inactif"}</span></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(u.lastLogin).toLocaleString("fr-FR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
      {creating && <NewUser onClose={() => setCreating(false)} onCreate={u => { setUsers([...users, u]); setCreating(false); toast.success("Invitation envoyée"); }} />}
    </div>
  );
}

function NewUser({ onClose, onCreate }: { onClose: () => void; onCreate: (u: UserAccount) => void }) {
  const [f, setF] = useState({ name: "", email: "", role: "commercial" as UserRole });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form onSubmit={e => { e.preventDefault(); onCreate({ id: `u${Date.now()}`, ...f, active: true, lastLogin: new Date().toISOString(), avatarColor: "#5B6472" }); }} className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-primary">Inviter un utilisateur</h3><button type="button" onClick={onClose}><X className="h-5 w-5" /></button></div>
        <div className="space-y-2">
          <input required value={f.name} onChange={e => setF({...f, name: e.target.value})} placeholder="Nom complet" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <input required type="email" value={f.email} onChange={e => setF({...f, email: e.target.value})} placeholder="Email" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          <select value={f.role} onChange={e => setF({...f, role: e.target.value as UserRole})} className="w-full rounded-md border border-input px-3 py-2 text-sm">{roles.map(r => <option key={r}>{r}</option>)}</select>
        </div>
        <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm">Annuler</button><button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">Inviter</button></div>
      </form>
    </div>
  );
}
