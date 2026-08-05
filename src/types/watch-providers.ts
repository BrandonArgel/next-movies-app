export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface WatchLocaleData {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface WatchProvidersResponse {
  results: Record<string, WatchLocaleData>;
}
