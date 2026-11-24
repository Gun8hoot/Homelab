import { createRoot } from "react-dom/client";
import App from "./App";
import { I18nProvider, isLang } from "./i18n";
import "./index.css";

// DEFAULT_LANG, SERVICES, BASE_DOMAIN and SUBDOMAIN_* come from .env, resolved by the server.
const config = await fetch("/api/config")
  .then((r) => r.json())
  .catch(() => ({}));

createRoot(document.getElementById("root")!).render(
  <I18nProvider defaultLang={isLang(config.defaultLang) ? config.defaultLang : "en"}>
    <App items={config.services ?? []} />
  </I18nProvider>,
);
