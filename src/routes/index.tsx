import { createFileRoute } from "@tanstack/react-router";
import heroImage from "@/assets/hero-dashboard.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexus — Build the Impossible" },
      { name: "description", content: "Next-generation infrastructure for high-performance creative teams. Scalable, secure, and blazingly fast." },
      { property: "og:title", content: "Nexus — Build the Impossible" },
      { property: "og:description", content: "Next-generation infrastructure for high-performance creative teams." },
      { property: "og:image", content: heroImage },
      { name: "twitter:image", content: heroImage },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground selection:bg-brand selection:text-brand-foreground">
      {/* Ambient gradient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 size-[600px] rounded-full bg-brand/20 blur-[140px] animate-orb" />
        <div className="absolute top-1/3 -right-40 size-[520px] rounded-full bg-[oklch(0.55_0.22_280)]/30 blur-[160px] animate-orb [animation-delay:-4s]" />
        <div className="absolute bottom-0 left-1/3 size-[480px] rounded-full bg-[oklch(0.65_0.2_200)]/20 blur-[150px] animate-orb [animation-delay:-8s]" />
      </div>

      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-brand">
            <div className="size-3 rotate-45 rounded-[2px] bg-brand-foreground" />
          </div>
          <span className="text-xl font-extrabold tracking-tighter">NEXUS</span>
        </div>
        <div className="hidden items-center gap-10 text-sm font-medium text-foreground/60 md:flex">
          <a href="#platform" className="transition-colors hover:text-brand">Platform</a>
          <a href="#solutions" className="transition-colors hover:text-brand">Solutions</a>
          <a href="#company" className="transition-colors hover:text-brand">Company</a>
        </div>
        <button className="rounded-full glass-panel px-6 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-brand hover:text-brand-foreground active:scale-95">
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <main className="mx-auto max-w-7xl px-6 pt-20 pb-32">
        <div className="max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1 text-xs font-semibold tracking-wide text-brand animate-fade-up">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-brand" />
            </span>
            VERSION 4.0 IS LIVE
          </div>

          <h1 className="mb-10 text-7xl font-extrabold leading-[0.9] tracking-tighter animate-fade-up [animation-delay:120ms] md:text-[110px]">
            BUILD THE <br />
            <span className="text-brand">IMPOSSIBLE.</span>
          </h1>

          <p className="mb-12 max-w-2xl text-xl leading-relaxed text-foreground/55 animate-fade-up [animation-delay:240ms] md:text-2xl">
            The next generation infrastructure for high-performance creative teams.
            Scalable, secure, and blazingly fast.
          </p>

          <div className="flex flex-col gap-4 animate-fade-up [animation-delay:360ms] sm:flex-row">
            <button className="rounded-2xl bg-brand px-10 py-5 text-lg font-extrabold text-brand-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-12px_color-mix(in_oklab,var(--brand)_50%,transparent)] active:scale-95">
              Start Building Free
            </button>
            <button className="rounded-2xl glass-panel px-10 py-5 text-lg font-bold text-foreground transition-all hover:bg-white/10">
              Book a Demo
            </button>
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative mt-32 animate-fade-up [animation-delay:480ms]">
          <div className="overflow-hidden rounded-[32px] glass-panel shadow-2xl ring-1 ring-white/5">
            <img
              src={heroImage}
              alt="Nexus dashboard interface preview"
              className="aspect-[16/9] w-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2 opacity-50">
            <div className="flex size-6 items-center justify-center rounded-full bg-foreground/20">
              <div className="size-2 rotate-45 rounded-[2px] bg-foreground" />
            </div>
            <span className="text-lg font-extrabold tracking-tighter">NEXUS</span>
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-foreground/30">
            © 2026 Nexus Systems Inc. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-sm text-foreground/40">
            <a href="#" className="hover:text-foreground">Twitter</a>
            <a href="#" className="hover:text-foreground">GitHub</a>
            <a href="#" className="hover:text-foreground">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
