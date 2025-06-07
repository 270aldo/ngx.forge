/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** SupabaseConfigResponse */
export interface SupabaseConfigResponse {
  /** Url */
  url: string;
  /** Anon Key */
  anon_key: string;
}

export type CheckHealthData = HealthResponse;

export type GetSupabaseConfigData = SupabaseConfigResponse;
