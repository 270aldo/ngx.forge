import { CheckHealthData, GetSupabaseConfigData } from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Obtiene la configuración de Supabase para el frontend
   * @tags dbtn/module:config
   * @name get_supabase_config
   * @summary Get Supabase Config
   * @request GET:/routes/supabase-config
   */
  export namespace get_supabase_config {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetSupabaseConfigData;
  }
}
