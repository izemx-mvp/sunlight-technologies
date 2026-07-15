import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sun, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("salim@sunlight.ma");
  const [password, setPassword] = useState("sunlight2026");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Connexion réussie", { description: "Bienvenue Salim" });
      navigate({ to: "/dashboard" });
    }, 700);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sunlight-animated p-4">
      {/* Floating shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="float-shape absolute -left-24 top-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="float-shape absolute right-10 top-1/3 h-96 w-96 rounded-full bg-[#C8862B]/20 blur-3xl" style={{ animationDelay: "-6s" }} />
        <div className="float-shape absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-white/10 blur-2xl" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C8862B] to-[#f4c07a] shadow-2xl">
            <Sun className="h-9 w-9 text-white" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">Sunlight Technologies</div>
            <div className="text-sm font-medium text-white/70">Back-office d'administration</div>
          </div>
        </div>

        <form onSubmit={submit} className="glass-card space-y-4 rounded-2xl p-8 shadow-2xl">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full rounded-md border border-input bg-white/80 px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full rounded-md border border-input bg-white/80 px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-ink"><input type="checkbox" className="rounded" defaultChecked /> Se souvenir de moi</label>
            <a href="#" className="text-accent hover:underline">Mot de passe oublié ?</a>
          </div>
          <button type="submit" disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#1B2A4A] to-[#2d3f68] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-70">
            {loading ? "Connexion..." : "Se connecter"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <div className="pt-2 text-center text-xs text-slate-ink">
            Démo cliquable · Identifiants pré-remplis
          </div>
        </form>
      </div>
    </div>
  );
}
