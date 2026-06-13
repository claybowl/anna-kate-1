import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FloralCorner } from "@/components/floral-corner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · Treasure" },
      { name: "description", content: "Sign in to your colorful resale inventory companion." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/app` },
        });
        if (error) throw error;
        toast.success("Account created! Loading your shop…");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
      navigate({ to: "/app" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-12">
      <FloralCorner position="top-left" />
      <FloralCorner position="top-right" />
      <FloralCorner position="bottom-left" />
      <FloralCorner position="bottom-right" />

      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[6%] top-[12%] size-28 rotate-12 rounded-3xl neo-border neo-shadow bg-sun animate-wiggle" />
        <div className="absolute right-[10%] top-[18%] size-24 -rotate-6 rounded-full neo-border neo-shadow bg-hot animate-wiggle [animation-delay:-1s]" />
        <div className="absolute right-[14%] bottom-[12%] size-20 rotate-[20deg] neo-border neo-shadow bg-electric animate-wiggle [animation-delay:-2s]" />
        <div className="absolute left-[12%] bottom-[20%] size-24 -rotate-12 rounded-2xl neo-border neo-shadow bg-avocado animate-wiggle [animation-delay:-1.5s]" />
        <div className="absolute left-[50%] top-[5%] size-14 rotate-45 neo-border neo-shadow bg-sienna animate-wiggle [animation-delay:-0.5s]" />
      </div>

      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2">
          <div className="grid size-10 place-items-center rounded-2xl neo-border neo-shadow-sm bg-hot text-2xl">💎</div>
          <span className="font-display text-xl tracking-tight">TREASURE</span>
        </Link>

        <div className="neo-tile p-8 animate-pop">
          <h1 className="font-display text-4xl uppercase tracking-tight">
            {mode === "signin" ? "Welcome back" : "Let's go"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to your inventory." : "Create your account in seconds."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-widest">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@reseller.com"
                className="mt-1 w-full rounded-xl neo-border bg-background px-4 py-3 text-base outline-none focus:bg-sun"
              />
            </div>
            <div>
              <label className="font-mono text-[11px] uppercase tracking-widest">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl neo-border bg-background px-4 py-3 text-base outline-none focus:bg-sun"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="neo-press w-full rounded-full neo-border neo-shadow bg-hot px-6 py-3.5 font-display text-base uppercase tracking-wide text-white disabled:opacity-60"
            >
              {loading ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-5 w-full text-center text-sm font-medium underline-offset-4 hover:underline"
          >
            {mode === "signin" ? "No account yet? Sign up →" : "Already have one? Sign in →"}
          </button>
        </div>
      </div>
    </div>
  );
}
