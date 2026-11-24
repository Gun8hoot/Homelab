import type { Lang } from "./i18n";

export type Service = {
  /** Subdomain of the service (name of its nginx conf): https://<id>.<BASE_DOMAIN> */
  id: string;
  /** Only if the real subdomain differs from `id`. */
  sub?: string;
  name: string;
  /** Slug from https://github.com/homarr-labs/dashboard-icons, or a full URL / absolute path. Omit it (or if it fails to load) to get the Docker logo. */
  icon?: string;
  description: Record<Lang, string>;
};

export const services: Service[] = [
  {
    id: "proxmox",
    name: "Proxmox",
    icon: "proxmox",
    description: {
      en: "Virtualization platform for virtual machines and containers.",
      fr: "Plateforme de virtualisation pour machines virtuelles et conteneurs.",
    },
  },
  {
    id: "jellyfin",
    name: "Jellyfin",
    icon: "jellyfin",
    description: {
      en: "Media server for movies, shows and music.",
      fr: "Serveur multimédia pour films, séries et musique.",
    },
  },
  {
    id: "seerr",
    name: "Seerr",
    icon: "seerr",
    description: {
      en: "Request manager for movies and shows.",
      fr: "Gestionnaire de demandes de films et séries.",
    },
  },
  {
    id: "radarr",
    name: "Radarr",
    icon: "radarr",
    description: {
      en: "Movie collection manager and downloader.",
      fr: "Gestionnaire et téléchargeur de films.",
    },
  },
  {
    id: "sonarr",
    name: "Sonarr",
    icon: "sonarr",
    description: {
      en: "TV show collection manager and downloader.",
      fr: "Gestionnaire et téléchargeur de séries.",
    },
  },
  {
    id: "prowlarr",
    name: "Prowlarr",
    icon: "prowlarr",
    description: {
      en: "Indexer manager for Radarr and Sonarr.",
      fr: "Gestionnaire d’indexeurs pour Radarr et Sonarr.",
    },
  },
  {
    id: "qbittorrent",
    name: "qBittorrent",
    icon: "qbittorrent",
    description: {
      en: "BitTorrent download client.",
      fr: "Client de téléchargement BitTorrent.",
    },
  },
  {
    id: "pihole",
    name: "Pi-hole",
    icon: "pi-hole",
    description: {
      en: "Network-wide ad and tracker blocker.",
      fr: "Bloqueur de publicités et de traqueurs pour tout le réseau.",
    },
  },
  {
    id: "vaultwarden",
    name: "Vaultwarden",
    icon: "vaultwarden",
    description: {
      en: "Password manager compatible with Bitwarden.",
      fr: "Gestionnaire de mots de passe compatible Bitwarden.",
    },
  },
  {
    id: "forgejo",
    name: "Forgejo",
    icon: "forgejo",
    description: {
      en: "Git forge for code, issues and projects.",
      fr: "Forge Git pour le code, les tickets et les projets.",
    },
  },
  {
    id: "kuma",
    name: "Uptime Kuma",
    icon: "uptime-kuma",
    description: {
      en: "Uptime monitoring with downtime alerts.",
      fr: "Surveillance de disponibilité avec alertes.",
    },
  },
  {
    id: "anki-sync",
    name: "Anki Sync",
    icon: "anki",
    description: {
      en: "Sync server for Anki flashcards.",
      fr: "Serveur de synchronisation pour les cartes Anki.",
    },
  },
  {
    // No icon: shows the Docker logo.
    id: "engram",
    name: "Engram",
    description: {
      en: "Spaced-repetition flashcards with FSRS scheduling.",
      fr: "Cartes mémoire à répétition espacée avec planification FSRS.",
    },
  },
];
