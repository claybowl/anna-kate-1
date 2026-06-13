import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FloralCorner } from "@/components/floral-corner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Treasure — Snap. Value. List." },
      { name: "description", content: "A bold, colorful resale companion. Snap a photo of vintage clothing, jewelry, or decor and get an instant resale valuation." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app" });
      else setChecking(false);
    });
  }, [navigate]);

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Floral corners — 70s disco wallpaper vibes */}
      <FloralCorner position="top-left" />
      <FloralCorner position="top-right" />
      <FloralCorner position="bottom-left" />
      <FloralCorner position="bottom-right" />

      {/* Floating shapes — 70s floral couch vibes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-[18%] size-24 rotate-12 rounded-3xl neo-border neo-shadow bg-sun animate-wiggle" />
        <div className="absolute right-[10%] top-[24%] size-32 -rotate-6 rounded-full neo-border neo-shadow bg-hot animate-wiggle [animation-delay:-1s]" />
        <div className="absolute left-[14%] bottom-[14%] size-28 rotate-[20deg] neo-border neo-shadow bg-electric animate-wiggle [animation-delay:-2s]" style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }} />
        <div className="absolute right-[16%] bottom-[18%] size-20 -rotate-12 neo-border neo-shadow bg-lime animate-wiggle [animation-delay:-1.5s]" style={{ borderRadius: "40% 60% 70% 30% / 50% 60% 40% 50%" }} />
        <div className="absolute left-[45%] top-[8%] size-16 rotate-45 neo-border neo-shadow bg-tangerine animate-wiggle [animation-delay:-0.5s]" />
        <div className="absolute right-[40%] bottom-[8%] size-20 -rotate-[15deg] neo-border neo-shadow bg-grape animate-wiggle [animation-delay:-2.5s]" style={{ borderRadius: "30% 70% 50% 50% / 60% 40% 60% 40%" }} />
        <div className="absolute left-[60%] top-[55%] size-14 -rotate-6 rounded-full neo-border neo-shadow bg-avocado animate-wiggle [animation-delay:-3s]" />
        <div className="absolute right-[5%] top-[60%] size-18 rotate-[30deg] neo-border neo-shadow bg-copper animate-wiggle [animation-delay:-0.8s]" style={{ borderRadius: "50% 50% 30% 70% / 40% 60% 50% 50%" }} />
        <div className="absolute left-[3%] top-[50%] size-12 rotate-12 neo-border neo-shadow bg-sienna animate-wiggle [animation-delay:-1.8s]" />
      </div>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid size-10 place-items-center rounded-2xl neo-border neo-shadow-sm bg-hot text-2xl">💎</div>
          <span className="font-display text-xl tracking-tight">TREASURE</span>
        </div>
        <Link to="/auth" className="neo-press rounded-full neo-border neo-shadow-sm bg-cream px-5 py-2.5 text-sm font-bold uppercase tracking-wider">
          Sign in
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6 pt-12 pb-24 text-center">
        <div className="mx-auto inline-flex animate-pop items-center gap-2 rounded-full neo-border neo-shadow-sm bg-cream px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em]">
          <span className="size-2 rounded-full bg-hot" /> For resellers who hustle
        </div>

        <h1 className="mx-auto mt-8 max-w-4xl font-display text-6xl leading-[0.9] tracking-tight sm:text-7xl md:text-[112px]">
          <span className="inline-block animate-pop [animation-delay:60ms]">SNAP.</span>{" "}
          <span className="inline-block animate-pop bg-hot px-3 text-white [animation-delay:140ms]">VALUE.</span>{" "}
          <span className="inline-block animate-pop [animation-delay:220ms]">LIST.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Point your camera at any vintage piece, jewel, or weird beautiful object.
          Our AI tells you what it is and what it's worth — then files it away in a
          loud, joyful inventory you'll actually love opening.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/auth" className="neo-press rounded-full neo-border neo-shadow bg-hot px-8 py-4 font-display text-lg uppercase tracking-wide text-white">
            Start valuing →
          </Link>
          <a href="#how" className="neo-press rounded-full neo-border neo-shadow-sm bg-sun px-8 py-4 font-display text-lg uppercase tracking-wide">
            How it works
          </a>
        </div>

        <section id="how" className="mt-28 grid gap-6 text-left md:grid-cols-3">
          {[
            { emoji: "📸", color: "bg-sun", title: "Snap it", body: "Upload a photo from your phone or desktop. Add a quick note if it helps." },
            { emoji: "🤖", color: "bg-electric text-white", title: "AI values it", body: "Identifies the piece, era, and brand cues. Returns a realistic resale range." },
            { emoji: "🗂️", color: "bg-avocado text-white", title: "File it", body: "Saved into your inventory with custom categories. Track sourcing → listed → sold." },
          ].map((s, i) => (
            <div key={s.title} className={`neo-tile p-7 animate-pop ${s.color}`} style={{ animationDelay: `${300 + i * 80}ms` }}>
              <div className="text-5xl">{s.emoji}</div>
              <h3 className="mt-4 font-display text-2xl uppercase tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Made loud for resellers · © 2026 Treasure
      </footer>
    </div>
  );
}
