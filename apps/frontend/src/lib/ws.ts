const envWsUrl = import.meta.env.VITE_WS_URL?.trim();

export function getWsUrl(): string | undefined {
  if (envWsUrl && !/^ws(s)?:\/\/(localhost|127\.0\.0\.1)/.test(envWsUrl)) {
    return envWsUrl;
  }
  if (typeof window === "undefined") return undefined;
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws`;
}