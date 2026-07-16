import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, BarChart3, MessagesSquare, TicketCheck, BookOpen,
  CalendarDays, Images, Share2, KanbanSquare, UserCircle2, RefreshCw,
  Users, HardHat, Receipt, Briefcase, Settings2, ShieldCheck, Plug,
  Bell, Search, LogOut, Menu, X, Sun,
} from "lucide-react";
import { useStore } from "@/lib/store";
import sunlightLogo from "@/assets/sunlight-logo.jpg";

const nav = [
  { section: "PILOTAGE", items: [
    { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { to: "/overview", label: "Vue globale", icon: BarChart3 },
  ]},
  { section: "SERVICE CLIENT", items: [
    { to: "/conversations", label: "Conversations", icon: MessagesSquare },
    { to: "/tickets", label: "Tickets", icon: TicketCheck },
    { to: "/knowledge", label: "Base de connaissances", icon: BookOpen },
  ]},
  { section: "COMMUNITY MANAGEMENT", items: [
    { to: "/calendar", label: "Calendrier éditorial", icon: CalendarDays },
    { to: "/gallery", label: "Galerie de posts", icon: Images },
    { to: "/social-accounts", label: "Comptes connectés", icon: Share2 },
  ]},
  { section: "PROSPECTION", items: [
    { to: "/pipeline", label: "Pipeline", icon: KanbanSquare },
    { to: "/leads", label: "Fiches leads", icon: UserCircle2 },
    { to: "/follow-ups", label: "Relances automatiques", icon: RefreshCw },
  ]},
  { section: "AGENT INTERNE", items: [
    { to: "/employees", label: "Employés", icon: Users },
    { to: "/workers", label: "Ouvriers d'agence", icon: HardHat },
    { to: "/accounting", label: "Comptabilité", icon: Receipt },
    { to: "/recruitment", label: "Recrutement", icon: Briefcase },
  ]},
  { section: "ADMINISTRATION", items: [
    { to: "/config", label: "Configuration des agents", icon: Settings2 },
    { to: "/users", label: "Utilisateurs & rôles", icon: ShieldCheck },
    { to: "/integrations", label: "Intégrations", icon: Plug },
  ]},
] as const;

export function SunlightLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={sunlightLogo}
        alt="Sun Light Technology"
        className="h-10 w-auto rounded-md object-contain"
      />
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { notifications, setNotifications } = useStore();
  const currentPath = useRouterState({ select: s => s.location.pathname });
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-sidebar text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <SunlightLogo />
          <button className="lg:hidden text-white/80" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto px-2 py-4">
          {nav.map(group => (
            <div key={group.section} className="mb-4">
              <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/40">{group.section}</div>
              {group.items.map(item => {
                const active = currentPath === item.to;
                const Icon = item.icon;
                return (
                  <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
                    className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-sidebar-accent text-white shadow-sm border-l-2 border-[#C8862B]" : "text-white/70 hover:bg-sidebar-accent/60 hover:text-white"}`}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-white/80 px-4 backdrop-blur-md">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="relative max-w-lg flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Rechercher un lead, un ticket, une conversation..." className="w-full rounded-md border border-input bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button onClick={() => { setNotifOpen(v => !v); setUserMenuOpen(false); }} className="relative rounded-md p-2 hover:bg-muted">
                <Bell className="h-5 w-5 text-slate-ink" />
                {unread > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C8862B] px-1 text-[10px] font-bold text-white">{unread}</span>}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 z-30 w-80 rounded-lg border border-border bg-white p-2 shadow-xl">
                  <div className="flex items-center justify-between px-2 pb-2">
                    <div className="text-sm font-semibold">Notifications</div>
                    <button className="text-xs text-accent hover:underline" onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}>Tout marquer lu</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`flex items-start gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted ${!n.read ? "bg-accent/5" : ""}`}>
                        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.kind === "success" ? "bg-[oklch(0.68_0.16_150)]" : n.kind === "warning" ? "bg-[oklch(0.78_0.15_75)]" : "bg-[oklch(0.65_0.13_240)]"}`} />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{n.title}</div>
                          <div className="text-xs text-muted-foreground">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => { setUserMenuOpen(v => !v); setNotifOpen(false); }} className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-muted">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1B2A4A] text-xs font-bold text-white">SR</div>
                <span className="hidden text-sm font-medium sm:inline">Salim R.</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-12 z-30 w-48 rounded-lg border border-border bg-white p-1 shadow-xl">
                  <div className="px-3 py-2 text-xs text-muted-foreground">Connecté en tant que<br /><span className="font-medium text-foreground">salim@sunlight.ma</span></div>
                  <div className="my-1 h-px bg-border" />
                  <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"><UserCircle2 className="h-4 w-4" /> Profil</button>
                  <Link to="/" className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger hover:bg-muted"><LogOut className="h-4 w-4" /> Déconnexion</Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
    </div>
  );
}

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass-card rounded-xl p-5 ${className}`}>{children}</div>;
}

export function StatusBadge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "success" | "warning" | "danger" | "info" | "muted" }) {
  const tones: Record<string, string> = {
    default: "bg-primary/10 text-primary",
    success: "bg-[oklch(0.68_0.16_150)]/15 text-[oklch(0.4_0.14_150)]",
    warning: "bg-[oklch(0.78_0.15_75)]/20 text-[oklch(0.45_0.15_75)]",
    danger: "bg-danger/15 text-danger",
    info: "bg-[oklch(0.65_0.13_240)]/15 text-[oklch(0.4_0.13_240)]",
    muted: "bg-muted text-muted-foreground",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ title = "Aucun résultat", hint }: { title?: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
      <div className="mb-3 text-4xl">🔍</div>
      <div className="font-semibold text-foreground">{title}</div>
      {hint && <div className="mt-1 text-sm text-muted-foreground">{hint}</div>}
    </div>
  );
}
