import { CheckHealthData, GetSupabaseConfigData } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Obtiene la configuración de Supabase para el frontend
   *
   * @tags dbtn/module:config
   * @name get_supabase_config
   * @summary Get Supabase Config
   * @request GET:/routes/supabase-config
   */
  get_supabase_config = (params: RequestParams = {}) =>
    this.request<GetSupabaseConfigData, any>({
      path: `/routes/supabase-config`,
      method: "GET",
      ...params,
    });
}
