// ProTrader Data Source Types: Types for all sheet schemas
export interface SystemConfigRow {
  config_key: string;
  config_value: string;
  data_type: string;
  description: string;
  is_active: boolean;
  updated_by: string;
  updated_at: string;
}

export interface AssetRow {
  symbol: string;
  broker_symbol: string;
  asset_class: string;
  enabled: boolean;
  min_timeframe: string;
  max_timeframe: string;
  spread_limit: number;
  session_allowed: string;
  strategy_allowed: string;
  notes: string;
  updated_at: string;
}
