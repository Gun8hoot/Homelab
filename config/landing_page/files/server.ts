import index from "./index.html";
import { services, type Service } from "./src/services";

// Bun loads .env automatically.
const defaultLang = process.env.DEFAULT_LANG === "fr" ? "fr" : "en";
const baseDomain = process.env.BASE_DOMAIN || "localhost";

// SERVICES=a,b,c (or a JSON array): only these services exist for the page, in this order.
function parseList(value: string): string[] {
  try {
    const json = JSON.parse(value);
    if (Array.isArray(json)) return json.map(String);
  } catch {}
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

const catalog = new Map(services.map((s) => [s.id, s]));
const configured: Service[] = [...new Set(parseList(process.env.SERVICES ?? "").map((id) => id.toLowerCase()))].flatMap(
  (id) => {
    const service = catalog.get(id);
    if (!service) console.warn(`SERVICES: unknown service "${id}" ignored (add it to src/services.ts)`);
    return service ? [service] : [];
  },
);

// Address of a service: https://<subdomain>.<BASE_DOMAIN>.
// The subdomain is SUBDOMAIN_<ID> from .env if set (e.g. SUBDOMAIN_QBITTORRENT=qbit), else the service id.
function resolveUrl(s: Service): string {
  const suffix = s.id.toUpperCase().replace(/[^A-Z0-9]/g, "_");
  const sub = process.env[`SUBDOMAIN_${suffix}`]?.trim().replace(/^\.+|\.+$/g, "");
  return `https://${sub || s.sub || s.id}.${baseDomain}`;
}

const items = configured.map((s) => ({ id: s.id, url: resolveUrl(s) }));

Bun.serve({
  port: Number(process.env.PORT) || 3000,
  routes: {
    "/api/config": () => Response.json({ defaultLang, services: items }),
    "/*": index,
  },
  development: process.env.NODE_ENV !== "production" && { hmr: true, console: true },
});

console.log(`Homelab landing page on http://localhost:${process.env.PORT || 3000} (default language: ${defaultLang})`);
for (const { id, url } of items) console.log(`  ${id} -> ${url}`);
