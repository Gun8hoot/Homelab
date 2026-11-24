import { useEffect, useMemo, useState } from "react";
import { langs, useI18n } from "./i18n";
import { services, type Service } from "./services";

type Status = { up: boolean; ms: number | null };
type Entry = Service & { url: string };

const ICON_CDN = "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/";
const goTo = (i: number) => document.getElementById(`s-${i}`)?.scrollIntoView();

function DockerLogo() {
  return (
    <svg viewBox="0 0 64 48" className="size-full" fill="#2496ED" role="img" aria-label="Docker">
      <path d="M3 28h52c1-3 .5-5-1-7 2 .5 4 1 5 3 1.5-.5 3-.5 4 0-1 2.5-3 3-5 3C54 38 44 45 28 45 12 45 4 38 3 28z" />
      {[[12, 20], [20, 20], [28, 20], [36, 20], [44, 20], [20, 12], [28, 12], [36, 12], [28, 4]].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="7" height="7" rx="1" />
      ))}
    </svg>
  );
}

function Logo({ icon }: { icon?: string }) {
  const [failed, setFailed] = useState(false);
  if (!icon || failed) return <DockerLogo />;
  const src = /^(https?:)?\//.test(icon) ? icon : `${ICON_CDN}${icon}.svg`;
  return <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className="size-full object-contain" />;
}

function Ping({ status }: { status?: Status }) {
  const { t } = useI18n();
  const state = !status ? "checking" : status.up ? "up" : "down";
  const dot = { up: "bg-green-500", down: "bg-red-500", checking: "bg-muted/60" }[state];
  const label = { up: t.online, down: t.offline, checking: t.checking }[state];
  return (
    <p className="mt-6 flex items-center gap-3 text-lg md:text-xl 2xl:text-2xl">
      <span aria-hidden className={`size-3 shrink-0 rounded-full md:size-3.5 ${dot}`} />
      <span className="font-semibold">{label}</span>
      {status?.up && status.ms != null && <span className="tabular-nums text-muted">{status.ms} ms</span>}
    </p>
  );
}

function ServiceSection({
  service,
  index,
  status,
}: {
  service: Entry;
  index: number;
  status?: Status;
}) {
  const { lang, t } = useI18n();
  const href = service.url;
  return (
    <section
      id={`s-${index}`}
      data-section={index}
      className="flex h-svh snap-start snap-always items-center pl-14 pr-6 md:pl-28 md:pr-14"
    >
      <div className="flex w-full flex-col items-start gap-8 md:flex-row md:items-center md:gap-14">
        <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-tile p-6 md:size-52 md:p-11 xl:size-64 2xl:size-72 2xl:p-14">
          <Logo icon={service.icon} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-6 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-10">
          <div className="min-w-0">
            <h2 className="text-4xl font-extrabold tracking-tight md:text-7xl lg:text-8xl 2xl:text-9xl">
              {service.name}
            </h2>
            <p className="mt-4 max-w-[30ch] text-xl text-muted md:text-3xl 2xl:text-4xl">{service.description[lang]}</p>
            <Ping status={status} />
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.go}: ${service.name}`}
            className="shrink-0 whitespace-nowrap text-xl font-semibold underline decoration-signal decoration-4 underline-offset-8 transition-colors hover:decoration-ink md:text-2xl 2xl:text-3xl"
          >
            {t.go}
          </a>
        </div>
      </div>
    </section>
  );
}

function Rail({ active, labels }: { active: number; labels: string[] }) {
  const { t } = useI18n();
  return (
    <nav
      aria-label={t.sections}
      className="fixed left-3 top-0 z-10 flex h-svh flex-col items-center justify-center md:left-8"
    >
      <div aria-hidden className="absolute inset-y-0 w-px bg-muted/30" />
      <ul className="relative flex flex-col">
        {labels.map((label, i) => (
          <li key={label}>
            <button
              onClick={() => goTo(i)}
              aria-label={label}
              aria-current={active === i}
              className="grid size-6 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-page"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  active === i ? "size-3.5 bg-signal ring-2 ring-page" : "size-2 bg-muted/70"
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function LangSwitch() {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      role="group"
      aria-label={t.language}
      className="fixed right-4 top-4 z-10 flex rounded-full bg-ink p-1 text-sm font-semibold text-page ring-1 ring-line"
    >
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-3 py-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-page ${
            lang === l ? "bg-signal text-petrol" : "text-page/80 hover:text-page"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// The check runs in the visitor's browser, so it follows the same DNS and network path as the link itself.
// A no-cors HEAD request resolves as soon as the service answers (whatever the status) and fails when it is unreachable.
async function ping(url: string): Promise<Status> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 4000);
  const started = performance.now();
  try {
    await fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: ctl.signal,
    });
    return { up: true, ms: Math.round(performance.now() - started) };
  } catch {
    return { up: false, ms: null };
  } finally {
    clearTimeout(timer);
  }
}

function useStatus(list: Entry[]) {
  const [status, setStatus] = useState<Record<string, Status>>({});
  useEffect(() => {
    let alive = true;
    const run = () => {
      if (document.hidden) return;
      list.forEach(async (s) => {
        const result = await ping(s.url);
        if (alive) setStatus((prev) => ({ ...prev, [s.id]: result }));
      });
    };
    run();
    const timer = setInterval(run, 15_000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [list]);
  return status;
}

export default function App({ items }: { items: { id: string; url: string }[] }) {
  const { t } = useI18n();
  const [active, setActive] = useState(0);

  // Only the services listed in SERVICES (.env), in that order.
  const list = useMemo(
    () =>
      items.flatMap(({ id, url }) => {
        const s = services.find((x) => x.id === id);
        return s ? [{ ...s, url }] : [];
      }),
    [items],
  );
  const status = useStatus(list);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.section));
        }
      },
      { threshold: 0.6 },
    );
    document.querySelectorAll("[data-section]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [list]);

  // Light on the title, dark as soon as you scroll to the services.
  useEffect(() => {
    document.documentElement.dataset.theme = active > 0 ? "dark" : "light";
  }, [active]);

  return (
    <>
      <LangSwitch />
      <Rail active={active} labels={["Homelab", ...list.map((s) => s.name)]} />
      <main>
        <section
          id="s-0"
          data-section={0}
          className="flex h-svh snap-start snap-always flex-col justify-end overflow-hidden pb-14 pl-14 pr-6 md:pl-28"
        >
          <h1 className="text-[20vw] font-extrabold leading-[0.8] tracking-tighter [font-stretch:75%]">Homelab</h1>
          <p className="mt-8 max-w-[36ch] text-xl text-muted md:text-3xl">{t.tagline(list.length)}</p>
        </section>
        {list.map((s, i) => (
          <ServiceSection key={s.id} service={s} index={i + 1} status={status[s.id]} />
        ))}
      </main>
    </>
  );
}
