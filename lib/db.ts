import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'protrader_db.json');

interface Doctrine {
  id: number;
  doctrine_key: string;
  doctrine_name: string;
  description: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface OperatingRule {
  id: number;
  rule_key: string;
  rule_name: string;
  rule_value: string;
  rule_type: string;
  description: string;
  is_enforced: number;
  created_at: string;
  updated_at: string;
}

interface AuditLog {
  id: number;
  action: string;
  resource: string;
  resource_id: string;
  details: string;
  user: string;
  created_at: string;
}

interface SystemService {
  id: number;
  service_key: string;
  service_name: string;
  description: string;
  status: string;
  health_status: string;
  created_at: string;
  updated_at: string;
}

interface SystemEvent {
  id: number;
  event_type: string;
  source_module: string;
  entity_type: string | null;
  entity_id: string | null;
  account_id: string | null;
  strategy_engine_id: string | null;
  symbol_id: string | null;
  payload_json: string;
  status: string;
  created_at: string;
  processed_at: string | null;
}

interface ServiceHealthSnapshot {
  id: number;
  service_key: string;
  health_status: string;
  latency_ms: number;
  last_success_at: string;
  last_failure_at: string | null;
  details_json: string;
  created_at: string;
}

interface SystemEnvironment {
  id: number;
  environment_key: string;
  environment_name: string;
  description: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface FeatureFlag {
  id: number;
  flag_key: string;
  flag_name: string;
  description: string;
  module_name: string;
  environment: string;
  is_enabled: number;
  default_value: number;
  current_value: number;
  risk_level: string;
  requires_approval: number;
  created_at: string;
  updated_at: string;
}

interface RuntimeConfiguration {
  id: number;
  config_key: string;
  config_name: string;
  config_value: string;
  data_type: string;
  module_name: string;
  environment: string;
  is_sensitive: number;
  risk_level: string;
  requires_approval: number;
  requires_restart: number;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

interface ConfigChangeLog {
  id: number;
  config_key: string;
  previous_value: string;
  new_value: string;
  changed_by: string;
  environment: string;
  change_reason: string;
  approval_required: number;
  approval_status: string;
  created_at: string;
}

interface ConfigApprovalRequest {
  id: number;
  config_key: string;
  requested_value: string;
  requested_by: string;
  reviewed_by: string | null;
  approval_status: string;
  request_reason: string;
  review_comment: string | null;
  requested_at: string;
  reviewed_at: string | null;
}

interface ComplianceDocument {
  id: number;
  document_type: string;
  title: string;
  version: string;
  content: string;
  summary: string;
  is_active: number;
  requires_reacceptance: number;
  approval_status: string;
  created_by: string;
  approved_by: string | null;
  effective_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ComplianceAcceptance {
  id: number;
  user_id: string;
  document_id: number;
  document_type: string;
  document_version: string;
  accepted_at: string;
  ip_address: string;
  device_info: string;
  acceptance_method: string;
  acknowledgement_payload_json: string;
  is_current: number;
  created_at: string;
}

interface ComplianceStatusSnapshot {
  id: number;
  user_id: string;
  compliance_status: string;
  missing_documents_json: string;
  restricted_features_json: string;
  checked_at: string;
  created_at: string;
}

interface ComplianceReacceptanceRequest {
  id: number;
  document_id: number;
  document_version: string;
  target_user_id: string | null;
  target_role_id: string | null;
  required_reason: string;
  status: string;
  requested_by: string;
  requested_at: string;
  completed_at: string | null;
}

interface MarketDataSource {
  id: number;
  source_name: string;
  source_type: string;
  provider_name: string;
  connection_status: string;
  supported_symbols_json: string;
  supported_timeframes_json: string;
  last_sync_at: string;
  reliability_score: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface SymbolDef {
  id: number;
  symbol_code: string;
  display_name: string;
  asset_class: string;
  base_currency: string;
  quote_currency: string;
  pip_size: number;
  point_size: number;
  tick_size: number;
  contract_size: number;
  digits: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface SymbolMaster {
  id: number;
  symbol_code: string;
  display_name: string;
  asset_class: string;
  base_currency: string;
  quote_currency: string;
  profit_currency: string;
  margin_currency: string;
  pip_size: number;
  point_size: number;
  tick_size: number;
  tick_value: number;
  digits: number;
  contract_size: number;
  min_lot: number;
  max_lot: number;
  lot_step: number;
  typical_spread: number;
  max_allowed_spread: number;
  min_stop_distance: number;
  freeze_level: number;
  analysis_enabled: number;
  trading_enabled: number;
  backtesting_enabled: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface AssetClassDefault {
  id: number;
  asset_class: string;
  default_contract_size: number;
  default_min_lot: number;
  default_max_lot: number;
  default_lot_step: number;
  default_spread_warning: number;
  default_max_spread: number;
  default_volatility_class: string;
  created_at: string;
  updated_at: string;
}

interface BrokerSymbolMapping {
  id: number;
  broker_id: number;
  broker_name: string;
  broker_server: string;
  internal_symbol_id: number;
  broker_symbol: string;
  data_sync_enabled: number;
  execution_enabled: number;
  last_verified_at: string;
  mapping_status: string;
  created_at: string;
  updated_at: string;
}

interface SymbolStrategyPermission {
  id: number;
  symbol_id: number;
  strategy_engine_id: string; // e.g., 'LIQUIDITY', 'CHANNEL'
  analysis_enabled: number;
  signal_enabled: number;
  assisted_execution_enabled: number;
  auto_execution_enabled: number;
  backtesting_enabled: number;
  minimum_setup_score: number;
  max_daily_trades: number;
  max_open_positions: number;
  allowed_timeframes_json: string;
  allowed_sessions_json: string;
  created_at: string;
  updated_at: string;
}

interface SymbolSession {
  id: number;
  symbol_id: number;
  session_name: string;
  start_time_utc: string;
  end_time_utc: string;
  broker_start_time: string;
  broker_end_time: string;
  is_active: number;
  volatility_expectation: string;
  spread_expectation: string;
  execution_allowed: number;
  created_at: string;
  updated_at: string;
}

interface SymbolSpreadRule {
  id: number;
  symbol_id: number;
  session_name: string;
  typical_spread: number;
  warning_spread: number;
  max_tradable_spread: number;
  news_max_spread: number;
  rollover_max_spread: number;
  created_at: string;
  updated_at: string;
}

interface SymbolNewsSensitivity {
  id: number;
  symbol_id: number;
  affected_currencies_json: string;
  high_impact_block_minutes_before: number;
  high_impact_block_minutes_after: number;
  critical_block_minutes_before: number;
  critical_block_minutes_after: number;
  auto_trade_allowed_during_news: number;
  created_at: string;
  updated_at: string;
}

interface SymbolValidationStatus {
  id: number;
  symbol_id: number;
  validation_status: string;
  missing_fields_json: string;
  last_validated_at: string;
  validated_by: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface MarketSnapshot {

  id: number;
  symbol_id: number;
  symbol_code?: string; // Virtual
  bid: number;
  ask: number;
  spread: number;
  current_session: string;
  latest_tick_time: string;
  latest_m1_candle_id: number | null;
  latest_h1_candle_id: number | null;
  latest_h8_candle_id: number | null;
  latest_h12_candle_id: number | null;
  data_health_status: string;
  tradable_status: string;
  created_at: string;
  updated_at: string;
}

interface CandleRebuildLog {
  id: number;
  symbol_id: number;
  timeframe: string;
  start_time: string;
  end_time: string;
  rebuild_reason: string;
  source_used: string;
  records_rebuilt: number;
  records_failed: number;
  triggered_by: string;
  status: string;
  created_at: string;
}

interface Candle {
  id: number;
  symbol_id: number;
  source_id: number;
  timeframe: string;
  open_time: string;
  close_time: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  tick_volume: number;
  real_volume: number;
  spread: number;
  broker_time: string;
  utc_time: string;
  candle_direction: string;
  body_size: number;
  upper_wick_size: number;
  lower_wick_size: number;
  total_range: number;
  body_to_range_ratio: number;
  upper_wick_ratio: number;
  lower_wick_ratio: number;
  candle_strength_score: number;
  status: string;
  is_synthetic: number;
  is_rebuilt: number;
  source_candle_ids_json: string;
  created_at: string;
  updated_at: string;
}

interface CandleBuildJob {
  id: number;
  job_type: string;
  symbol_id: number;
  timeframe: string;
  start_time: string;
  end_time: string;
  source_timeframe: string;
  status: string;
  records_processed: number;
  records_created: number;
  records_updated: number;
  records_failed: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

interface CandleAnomaly {
  id: number;
  symbol_id: number;
  timeframe: string;
  candle_time: string;
  anomaly_type: string;
  severity: string;
  description: string;
  resolution_status: string;
  created_at: string;
  resolved_at: string | null;
}

interface TickIngestionLog {
  id: number;
  symbol_id: number;
  source_id: number;
  ticks_received: number;
  ticks_valid: number;
  ticks_rejected: number;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
}

interface SyntheticCandle {
  id: number;
  symbol_id: number;
  timeframe: string;
  block_name: string;
  block_sequence: number;
  open_time: string;
  close_time: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  tick_volume: number;
  average_spread: number;
  candle_direction: string;
  body_size: number;
  upper_wick_size: number;
  lower_wick_size: number;
  total_range: number;
  body_to_range_ratio: number;
  candle_strength_score: number;
  institutional_behavior_type: string;
  interpretation: string;
  source_candle_ids_json: string;
  source_integrity_status: string;
  status: string;
  is_rebuilt: number;
  created_at: string;
  updated_at: string;
}

interface SyntheticCandleBuildJob {
  id: number;
  symbol_id: number;
  timeframe: string;
  build_type: string;
  start_date: string;
  end_date: string;
  status: string;
  records_created: number;
  records_updated: number;
  records_failed: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

interface SyntheticCandleInterpretation {
  id: number;
  synthetic_candle_id: number;
  interpretation_type: string;
  interpretation_summary: string;
  supporting_evidence_json: string;
  confidence_score: number;
  created_at: string;
}

interface SessionBlockConfiguration {
  id: number;
  symbol_id: number;
  block_type: string;
  block_name: string;
  block_sequence: number;
  start_time_utc: string;
  end_time_utc: string;
  broker_start_time: string;
  broker_end_time: string;
  timezone_rule: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface MarketSession {
  id: number;
  symbol_id: number;
  session_name: string;
  session_date: string;
  start_time_utc: string;
  end_time_utc: string;
  broker_start_time: string;
  broker_end_time: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  midpoint_price: number;
  session_range: number;
  body_size: number;
  upper_wick_size: number;
  lower_wick_size: number;
  direction: string;
  strength_score: number;
  average_spread: number;
  maximum_spread: number;
  tick_volume: number;
  behavior_type: string;
  session_score: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface SessionLiquidityLevel {
  id: number;
  market_session_id: number;
  symbol_id: number;
  level_type: string;
  price_level: number;
  strength_score: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface SessionBehaviorEvent {
  id: number;
  market_session_id: number;
  symbol_id: number;
  event_type: string;
  event_time: string;
  event_price: number;
  related_level_id: number | null;
  confidence_score: number;
  interpretation: string;
  created_at: string;
}

interface SessionRelationship {
  id: number;
  symbol_id: number;
  session_date: string;
  source_session: string;
  target_session: string;
  relationship_type: string;
  summary: string;
  confidence_score: number;
  created_at: string;
}

interface DataQualityEvent {
  id: number;
  symbol_id: number;
  timeframe: string;
  event_type: string;
  severity: string;
  description: string;
  affected_start_time: string;
  affected_end_time: string;
  affected_modules_json: string;
  trading_permission_impact: string;
  resolution_status: string;
  created_at: string;
  resolved_at: string | null;
}

interface DataHealthSnapshot {
  id: number;
  symbol_id: number;
  timeframe: string;
  health_score: number;
  health_status: string;
  tick_freshness_status: string;
  candle_completeness_status: string;
  ohlc_validity_status: string;
  spread_status: string;
  timestamp_alignment_status: string;
  synthetic_integrity_status: string;
  trading_permission: string;
  created_at: string;
}

interface DataValidationResult {
  id: number;
  entity_type: string;
  entity_id: number;
  validation_type: string;
  validation_status: string;
  error_code: string | null;
  error_message: string | null;
  severity: string;
  created_at: string;
}

interface DataRecoveryLog {
  id: number;
  data_quality_event_id: number;
  recovery_type: string;
  source_used: string;
  records_requested: number;
  records_recovered: number;
  records_failed: number;
  recovery_status: string;
  notes: string;
  started_at: string | null;
  completed_at: string | null;
}

interface BiasState {
  id: number;
  symbol_id: number;
  timeframe: string;
  bias_state: string;
  confidence_score: number;
  trade_permission: string;
  supporting_factors_json: string;
  conflicting_factors_json: string;
  explanation: string;
  calculated_at: string;
  created_at: string;
}

interface BiasMatrixSnapshot {
  id: number;
  symbol_id: number;
  strategic_bias: string;
  strategic_confidence: number;
  tactical_bias: string;
  tactical_confidence: number;
  execution_bias: string;
  execution_confidence: number;
  final_bias: string;
  final_confidence: number;
  final_permission: string;
  bias_conflict_type: string;
  explanation: string;
  created_at: string;
}

interface BiasInvalidationEvent {
  id: number;
  symbol_id: number;
  timeframe: string;
  previous_bias: string;
  new_bias: string;
  invalidation_reason: string;
  related_event_type: string;
  related_event_id: number | null;
  explanation: string;
  created_at: string;
}

interface SwingPoint {
  id: number;
  symbol_id: number;
  timeframe: string;
  swing_type: string;
  price: number;
  candle_id: number | null;
  candle_time: string;
  strength_score: number;
  is_internal: boolean;
  is_external: boolean;
  is_protected: boolean;
  is_weak: boolean;
  is_strong: boolean;
  created_liquidity: boolean;
  swept_at: string | null;
  status: string;
  created_at: string;
  updated_at: string | null;
}

interface StructureEvent {
  id: number;
  symbol_id: number;
  timeframe: string;
  event_type: string;
  direction: string;
  price_level: number;
  candle_id: number | null;
  event_time: string;
  strength_score: number;
  related_swing_id: number | null;
  validity_status: string;
  confirmation_type: string;
  explanation: string;
  created_at: string;
}

interface StructureState {
  id: number;
  symbol_id: number;
  timeframe: string;
  current_state: string;
  current_direction: string;
  protected_high: number | null;
  protected_low: number | null;
  last_bos_event_id: number | null;
  last_choch_event_id: number | null;
  confidence_score: number;
  trade_permission: string;
  explanation: string;
  updated_at: string | null;
}

interface StructureTransition {
  id: number;
  symbol_id: number;
  timeframe: string;
  previous_state: string;
  new_state: string;
  transition_type: string;
  supporting_events_json: string;
  confidence_score: number;
  explanation: string;
  created_at: string;
}

interface DealingRange {
  id: number;
  symbol_id: number;
  timeframe: string;
  range_type: string;
  range_high: number;
  range_low: number;
  equilibrium_price: number;
  premium_zone_start: number;
  discount_zone_start: number;
  current_price_location: string;
  created_at: string;
  updated_at: string | null;
}

interface LiquidityPool {
  id: number;
  symbol_id: number;
  timeframe: string;
  liquidity_type: string;
  price_level: number;
  strength_score: number;
  touch_count: number;
  is_internal: boolean;
  is_external: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

interface LiquidityEvent {
  id: number;
  symbol_id: number;
  timeframe: string;
  event_type: string;
  liquidity_pool_id: number | null;
  event_price: number;
  event_time: string;
  event_strength: number;
  confirmation_status: string;
  post_sweep_behavior: string;
  explanation: string;
  created_at: string;
}

interface LiquidityMap {
  id: number;
  symbol_id: number;
  timeframe: string;
  nearest_buy_liquidity: number | null;
  nearest_sell_liquidity: number | null;
  strong_liquidity_levels_json: string;
  weak_liquidity_levels_json: string;
  recently_swept_levels_json: string;
  created_at: string;
  updated_at: string | null;
}

interface InducementEvent {
  id: number;
  symbol_id: number;
  timeframe: string;
  inducement_type: string;
  price_level: number;
  confirmation_status: string;
  explanation: string;
  created_at: string;
}

interface InstitutionalZone {
  id: number;
  symbol_id: number;
  timeframe: string;
  zone_type: string;
  direction: string;
  zone_high: number;
  zone_low: number;
  origin_candle_id: number | null;
  related_liquidity_event_id: number | null;
  related_structure_event_id: number | null;
  related_session_id: number | null;
  quality_score: number;
  status: string;
  fill_percentage: number;
  freshness_status: string;
  created_at: string;
  updated_at: string | null;
}

interface ZoneMitigationEvent {
  id: number;
  zone_id: number;
  mitigation_type: string;
  mitigation_price: number;
  mitigation_time: string;
  fill_percentage: number;
  reaction_score: number;
  held_or_failed: string;
  related_setup_id: number | null;
  created_at: string;
}

interface PremiumDiscountRange {
  id: number;
  symbol_id: number;
  timeframe: string;
  range_type: string;
  range_high: number;
  range_low: number;
  equilibrium_price: number;
  premium_start: number;
  discount_start: number;
  current_price_location: string;
  related_structure_id: number | null;
  related_channel_id: number | null;
  created_at: string;
  updated_at: string | null;
}

interface ZoneQualityScore {
  id: number;
  zone_id: number;
  score_value: number;
  score_breakdown_json: string;
  classification: string;
  positive_factors_json: string;
  negative_factors_json: string;
  explanation: string;
  created_at: string;
}

interface OpposingZoneWarning {
  id: number;
  setup_id: number | null;
  symbol_id: number;
  zone_id: number;
  warning_type: string;
  severity: string;
  distance_to_zone: number;
  recommendation: string;
  explanation: string;
  created_at: string;
}

interface Channel {
  id: number;
  symbol_id: number;
  timeframe: string;
  channel_type: string;
  direction: string;
  slope: number;
  upper_boundary_line: string;
  lower_boundary_line: string;
  midline: string;
  touch_count_upper: number;
  touch_count_lower: number;
  strength_score: number;
  status: string;
  parent_channel_id: number | null;
  explanation: string;
  created_at: string;
  updated_at: string | null;
}

interface ChannelTouch {
  id: number;
  channel_id: number;
  touch_type: string;
  touch_price: number;
  touch_time: string;
  rejection_strength: number;
  candle_id: number | null;
  created_at: string;
}

interface ChannelBreakout {
  id: number;
  channel_id: number;
  breakout_type: string;
  breakout_direction: string;
  breakout_price: number;
  breakout_time: string;
  confirmation_status: string;
  strength_score: number;
  created_at: string;
}

interface ChannelRetest {
  id: number;
  channel_id: number;
  retest_status: string;
  retest_price: number;
  retest_time: string;
  confirmation_strength: number;
  created_at: string;
}

interface ChannelLifecycle {
  id: number;
  channel_id: number;
  previous_state: string;
  current_state: string;
  transition_reason: string;
  created_at: string;
}

interface LiquiditySetup {
  id: number;
  symbol_id: number;
  timeframe: string;
  setup_type: string;
  direction: string;
  liquidity_event_id: number | null;
  structure_event_id: number | null;
  zone_id: number | null;
  entry_zone_high: number;
  entry_zone_low: number;
  entry_price: number | null;
  stop_loss: number;
  take_profit_targets_json: string;
  risk_reward_ratio: number;
  setup_score: number;
  confidence_level: string;
  status: string;
  explanation: string;
  created_at: string;
  updated_at: string | null;
}

interface SetupLifecycle {
  id: number;
  setup_id: number;
  previous_status: string;
  new_status: string;
  transition_reason: string;
  created_at: string;
}

interface SetupValidationLog {
  id: number;
  setup_id: number;
  validation_type: string;
  result: string;
  details: string;
  created_at: string;
}

interface ChannelStrategySetup {
  id: number;
  strategy_version_id: number | null;
  channel_id: number;
  parent_channel_id: number | null;
  child_channel_id: number | null;
  symbol_id: number;
  timeframe: string;
  setup_type: string;
  direction: string;
  setup_stage: string;
  entry_zone_high: number;
  entry_zone_low: number;
  proposed_entry_price: number | null;
  proposed_stop_loss: number;
  take_profit_targets_json: string;
  risk_reward_ratio: number;
  channel_strength_score: number;
  touch_quality_score: number;
  breakout_quality_score: number | null;
  retest_quality_score: number | null;
  bias_context_json: string;
  structure_context_json: string;
  liquidity_context_json: string;
  zone_context_json: string;
  session_context_json: string;
  status: string;
  explanation: string;
  created_at: string;
  updated_at: string | null;
}

interface ChannelSetupLifecycleEvent {
  id: number;
  setup_id: number;
  previous_stage: string;
  new_stage: string;
  transition_reason: string;
  created_at: string;
}

interface ChannelSetupValidationLog {
  id: number;
  setup_id: number;
  validation_type: string;
  validation_result: string;
  details_json: string;
  created_at: string;
}

interface DatabaseStructure {
  system_doctrines: Doctrine[];
  system_operating_rules: OperatingRule[];
  audit_logs: AuditLog[];
  system_services: SystemService[];
  system_events: SystemEvent[];
  service_health_snapshots: ServiceHealthSnapshot[];
  system_environments: SystemEnvironment[];
  feature_flags: FeatureFlag[];
  runtime_configurations: RuntimeConfiguration[];
  configuration_change_logs: ConfigChangeLog[];
  configuration_approval_requests: ConfigApprovalRequest[];
  compliance_documents: ComplianceDocument[];
  compliance_acceptances: ComplianceAcceptance[];
  compliance_status_snapshots: ComplianceStatusSnapshot[];
  compliance_reacceptance_requests: ComplianceReacceptanceRequest[];
  market_data_sources: MarketDataSource[];
  symbols: SymbolDef[];
  market_snapshots: MarketSnapshot[];
  candle_rebuild_logs: CandleRebuildLog[];
  symbol_masters: SymbolMaster[];
  asset_class_defaults: AssetClassDefault[];
  broker_symbol_mappings: BrokerSymbolMapping[];
  symbol_strategy_permissions: SymbolStrategyPermission[];
  symbol_sessions: SymbolSession[];
  symbol_spread_rules: SymbolSpreadRule[];
  symbol_news_sensitivities: SymbolNewsSensitivity[];
  symbol_validation_statuses: SymbolValidationStatus[];
  candles: Candle[];
  candle_build_jobs: CandleBuildJob[];
  candle_anomalies: CandleAnomaly[];
  tick_ingestion_logs: TickIngestionLog[];
  synthetic_candles: SyntheticCandle[];
  synthetic_candle_build_jobs: SyntheticCandleBuildJob[];
  synthetic_candle_interpretations: SyntheticCandleInterpretation[];
  session_block_configurations: SessionBlockConfiguration[];
  market_sessions: MarketSession[];
  session_liquidity_levels: SessionLiquidityLevel[];
  session_behavior_events: SessionBehaviorEvent[];
  session_relationships: SessionRelationship[];
  data_quality_events: DataQualityEvent[];
  data_health_snapshots: DataHealthSnapshot[];
  data_validation_results: DataValidationResult[];
  data_recovery_logs: DataRecoveryLog[];
  bias_states: BiasState[];
  bias_matrix_snapshots: BiasMatrixSnapshot[];
  bias_invalidation_events: BiasInvalidationEvent[];
  swing_points: SwingPoint[];
  structure_events: StructureEvent[];
  structure_states: StructureState[];
  structure_transitions: StructureTransition[];
  dealing_ranges: DealingRange[];
  liquidity_pools: LiquidityPool[];
  liquidity_events: LiquidityEvent[];
  liquidity_maps: LiquidityMap[];
  inducement_events: InducementEvent[];
  institutional_zones: InstitutionalZone[];
  zone_mitigation_events: ZoneMitigationEvent[];
  premium_discount_ranges: PremiumDiscountRange[];
  zone_quality_scores: ZoneQualityScore[];
  opposing_zone_warnings: OpposingZoneWarning[];
  channels: Channel[];
  channel_touches: ChannelTouch[];
  channel_breakouts: ChannelBreakout[];
  channel_retests: ChannelRetest[];
  channel_lifecycle: ChannelLifecycle[];
  liquidity_setups: LiquiditySetup[];
  setup_lifecycle: SetupLifecycle[];
  setup_validation_logs: SetupValidationLog[];
  channel_strategy_setups: ChannelStrategySetup[];
  channel_setup_lifecycle_events: ChannelSetupLifecycleEvent[];
  channel_setup_validation_logs: ChannelSetupValidationLog[];
}

const defaultData: DatabaseStructure = {
  system_doctrines: [
    { id: 1, doctrine_key: 'CAPITAL_PRESERVATION', doctrine_name: 'Capital Preservation Doctrine', description: 'Capital protection is more important than trade frequency.', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, doctrine_key: 'STRATEGY_INDEPENDENCE', doctrine_name: 'Strategy Independence Doctrine', description: 'Strategies operate independently under shared parameters without inter-dependencies.', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, doctrine_key: 'SHARED_DATA_LAYER', doctrine_name: 'Shared Data Doctrine', description: 'All strategies draw from a single shared market data, session, and news abstraction layer.', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 4, doctrine_key: 'NO_FORCED_TRADING', doctrine_name: 'No-Forced-Trade Doctrine', description: 'The system must not force trades. Target is 2-5 quality opportunities per day.', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 5, doctrine_key: 'CONSERVATIVE_GROWTH', doctrine_name: 'Conservative Growth Doctrine', description: 'Strict lock on lot scaling until significant (100%) account growth is achieved.', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 6, doctrine_key: 'MULTI_CURRENCY_READINESS', doctrine_name: 'Multi-Currency Readiness Doctrine', description: 'Framework built to evaluate cross-pair correlations and exposure limits.', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 7, doctrine_key: 'HUMAN_LIKE_DISCIPLINE', doctrine_name: 'Human-Like Trading Discipline Doctrine', description: 'Avoid revenge trading, unclear markets, overtrading, and unsafe periods.', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 8, doctrine_key: 'RISK_FIRST_EXECUTION', doctrine_name: 'Risk-First Execution Doctrine', description: 'Calculate exit risk boundaries before any entry logic fires.', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 9, doctrine_key: 'AUDITABILITY', doctrine_name: 'Auditability Doctrine', description: 'All critical rule changes must be structurally audit-logged with explanation and attribution.', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 10, doctrine_key: 'NO_DIRECT_EXECUTION', doctrine_name: 'No-Direct-Execution Doctrine', description: 'Strategy engines only generate signal intelligence; execution is governed centrally.', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  system_operating_rules: [
    { id: 1, rule_key: 'MAX_CONCURRENT_POSITIONS', rule_name: 'Maximum Concurrent Positions', rule_value: '10', rule_type: 'integer', description: 'Limit across all strategies, symbols, and standard accounts.', is_enforced: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, rule_key: 'INITIAL_LOT_SIZE', rule_name: 'Initial Lot Size', rule_value: '0.01', rule_type: 'float', description: 'Base fixed lot size applied to all initial setups.', is_enforced: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, rule_key: 'DYNAMIC_LOT_UNLOCK_GROWTH_PERCENT', rule_name: 'Dynamic Lot Unlock Threshold (%)', rule_value: '100', rule_type: 'integer', description: 'Minimum account growth % required to unlock dynamic position sizing (e.g. 200% of initial capital).', is_enforced: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 4, rule_key: 'DAILY_QUALITY_TRADE_TARGET', rule_name: 'Daily Target Opportunities', rule_value: '2-5', rule_type: 'string', description: 'Acceptable range for quality trade opportunities per day.', is_enforced: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 5, rule_key: 'FORCED_TRADING_ENABLED', rule_name: 'Forced Trading', rule_value: 'false', rule_type: 'boolean', description: 'If true, overrides trade restraint mechanisms. Should remain strictly false.', is_enforced: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 6, rule_key: 'NO_TRADE_STATES', rule_name: 'Valid No-Trade States', rule_value: '["NO_TRADE_CONDITIONS_NOT_MET", "NO_TRADE_MARKET_UNCLEAR", "NO_TRADE_RISK_INVALID", "NO_TRADE_NEWS_BLOCK", "NO_TRADE_SPREAD_UNSAFE", "NO_TRADE_STRATEGY_CONFLICT", "NO_TRADE_DATA_UNSAFE"]', rule_type: 'json', description: 'Approved statuses when the system abstains from trading.', is_enforced: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 7, rule_key: 'INDEPENDENT_STRATEGIES', rule_name: 'Active Engines', rule_value: '["LIQUIDITY_ENGINE", "CHANNEL_ENGINE"]', rule_type: 'json', description: 'List of currently active independent strategy engines.', is_enforced: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  audit_logs: [],
  system_services: [
    { id: 1, service_key: 'API_GATEWAY', service_name: 'API Gateway', description: 'Main entry point for all frontend requests', status: 'ACTIVE', health_status: 'HEALTHY', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, service_key: 'MARKET_DATA_SERVICE', service_name: 'Shared Market Data Service', description: 'Centralized source of truth for validated market quotes and candles', status: 'ACTIVE', health_status: 'HEALTHY', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, service_key: 'LIQUIDITY_STRATEGY', service_name: 'Liquidity Strategy Engine', description: 'Generates setups based on liquidity sweeps and structural shifts', status: 'ACTIVE', health_status: 'HEALTHY', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 4, service_key: 'CHANNEL_STRATEGY', service_name: 'Channel Strategy Engine', description: 'Generates setups based on channel bounds and trends', status: 'ACTIVE', health_status: 'HEALTHY', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 5, service_key: 'RISK_SERVICE', service_name: 'Centralized Risk Service', description: 'Validates all proposed setups against global risk doctrines', status: 'ACTIVE', health_status: 'HEALTHY', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 6, service_key: 'EXECUTION_GOVERNANCE', service_name: 'Execution Governance', description: 'Final gatekeeper before trades are dispatched to the broker bridge', status: 'ACTIVE', health_status: 'HEALTHY', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 7, service_key: 'MT5_BRIDGE', service_name: 'MT5 Connector Bridge', description: 'Translates approved orders into MT5 execution calls', status: 'ACTIVE', health_status: 'HEALTHY', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  system_events: [],
  service_health_snapshots: [],
  system_environments: [
    { id: 1, environment_key: 'DEVELOPMENT', environment_name: 'Development', description: 'Local developer testing', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, environment_key: 'STAGING', environment_name: 'Staging', description: 'Pre-production validation', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, environment_key: 'DEMO_TRADING', environment_name: 'Demo Trading', description: 'Live paper trading', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 4, environment_key: 'PRODUCTION_LIVE', environment_name: 'Production Live', description: 'Real money execution', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  feature_flags: [
    { id: 1, flag_key: 'enable_liquidity_strategy', flag_name: 'Liquidity Strategy', description: 'Enables liquidity setup generation', module_name: 'Strategy Engines', environment: 'PRODUCTION_LIVE', is_enabled: 1, default_value: 1, current_value: 1, risk_level: 'MEDIUM', requires_approval: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, flag_key: 'enable_channel_strategy', flag_name: 'Channel Strategy', description: 'Enables channel setup generation', module_name: 'Strategy Engines', environment: 'PRODUCTION_LIVE', is_enabled: 1, default_value: 1, current_value: 1, risk_level: 'MEDIUM', requires_approval: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, flag_key: 'enable_live_execution', flag_name: 'Live Execution', description: 'Allows real money trades to be fired to MT5', module_name: 'Execution Governance', environment: 'PRODUCTION_LIVE', is_enabled: 0, default_value: 0, current_value: 0, risk_level: 'CRITICAL', requires_approval: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 4, flag_key: 'enable_auto_mode', flag_name: 'Auto Mode', description: 'Allows completely automatic trade execution without assisted confirmation', module_name: 'Execution Governance', environment: 'PRODUCTION_LIVE', is_enabled: 0, default_value: 0, current_value: 0, risk_level: 'CRITICAL', requires_approval: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 5, flag_key: 'enable_emergency_stop', flag_name: 'Emergency Stop Engine', description: 'Global kill switch for all strategies and new trades', module_name: 'Risk Engine', environment: 'PRODUCTION_LIVE', is_enabled: 1, default_value: 1, current_value: 1, risk_level: 'CRITICAL', requires_approval: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  runtime_configurations: [
    { id: 1, config_key: 'max_concurrent_positions', config_name: 'Max Concurrent Positions', config_value: '10', data_type: 'integer', module_name: 'Risk Engine', environment: 'PRODUCTION_LIVE', is_sensitive: 0, risk_level: 'HIGH', requires_approval: 1, requires_restart: 0, updated_by: 'system', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, config_key: 'fixed_lot_size', config_name: 'Fixed Lot Size', config_value: '0.01', data_type: 'float', module_name: 'Position Sizing', environment: 'PRODUCTION_LIVE', is_sensitive: 0, risk_level: 'HIGH', requires_approval: 1, requires_restart: 0, updated_by: 'system', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  configuration_change_logs: [],
  configuration_approval_requests: [],
  compliance_documents: [
    {
      id: 1,
      document_type: 'GENERAL_RISK_DISCLOSURE',
      title: 'General Risk Disclosure',
      version: '1.0',
      content: 'Forex and CFD trading involve substantial risk. You may lose part or all trading capital. Past performance does not guarantee future results. Backtesting does not guarantee live performance. Demo performance may differ from live execution. Market conditions can change rapidly. Spreads, slippage, latency, broker execution, and news events may affect results. Cacsms ProTrader does not guarantee profit. Cacsms ProTrader is a decision-support and execution-support platform. The user remains responsible for trading decisions and account risk. Auto-trading increases operational and financial risk. The user must only trade with capital they can afford to risk.',
      summary: 'Trading is risky and you could lose money. Cacsms ProTrader is a tool, not a guarantee.',
      is_active: 1,
      requires_reacceptance: 0,
      approval_status: 'APPROVED',
      created_by: 'SystemAdmin',
      approved_by: 'SuperAdmin',
      effective_at: new Date().toISOString(),
      expires_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      document_type: 'AUTO_TRADING_CONSENT',
      title: 'Auto-Trading Consent Agreement',
      version: '1.0',
      content: 'The system may place trades automatically. Trades may occur without manual confirmation. Market volatility may cause losses. MT5 connection issues may affect execution. Stop loss may fail under abnormal conditions. Slippage and gaps may occur. The user accepts responsibility for enabling automation.',
      summary: 'Auto mode places trades without your manual click. You assume the risk of operational execution.',
      is_active: 1,
      requires_reacceptance: 0,
      approval_status: 'APPROVED',
      created_by: 'SystemAdmin',
      approved_by: 'SuperAdmin',
      effective_at: new Date().toISOString(),
      expires_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      document_type: 'LIVE_EXECUTION_CONSENT',
      title: 'Live Execution Consent Agreement',
      version: '1.0',
      content: 'Real money may be gained or lost. Live execution differs from demo. Broker execution is outside complete system control. User accepts responsibility for live trading. Emergency stop reduces risk but cannot guarantee prevention of loss.',
      summary: 'You are connecting a live financial account. Errors or market conditions can cause loss of real capital.',
      is_active: 1,
      requires_reacceptance: 0,
      approval_status: 'APPROVED',
      created_by: 'SystemAdmin',
      approved_by: 'SuperAdmin',
      effective_at: new Date().toISOString(),
      expires_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  compliance_acceptances: [],
  compliance_status_snapshots: [],
  compliance_reacceptance_requests: [],
  market_data_sources: [
    { id: 1, source_name: 'Primary MT5 Server', source_type: 'MT5_TERMINAL', provider_name: 'Broker A', connection_status: 'CONNECTED', supported_symbols_json: '["EURUSD", "GBPUSD", "USDJPY", "XAUUSD"]', supported_timeframes_json: '["M1", "M5", "M15", "H1", "H4", "D1"]', last_sync_at: new Date().toISOString(), reliability_score: 99.9, is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, source_name: 'Secondary FIX API', source_type: 'FIX_API', provider_name: 'Institutional LP', connection_status: 'DISCONNECTED', supported_symbols_json: '["EURUSD", "GBPUSD", "XAUUSD"]', supported_timeframes_json: '["M1"]', last_sync_at: new Date().toISOString(), reliability_score: 98.5, is_active: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  symbols: [
    { id: 1, symbol_code: 'EURUSD', display_name: 'Euro vs US Dollar', asset_class: 'FOREX', base_currency: 'EUR', quote_currency: 'USD', pip_size: 0.0001, point_size: 0.00001, tick_size: 0.00001, contract_size: 100000, digits: 5, is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, symbol_code: 'GBPUSD', display_name: 'British Pound vs US Dollar', asset_class: 'FOREX', base_currency: 'GBP', quote_currency: 'USD', pip_size: 0.0001, point_size: 0.00001, tick_size: 0.00001, contract_size: 100000, digits: 5, is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, symbol_code: 'XAUUSD', display_name: 'Gold vs US Dollar', asset_class: 'COMMODITY', base_currency: 'XAU', quote_currency: 'USD', pip_size: 0.1, point_size: 0.01, tick_size: 0.01, contract_size: 100, digits: 2, is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  market_snapshots: [
    { id: 1, symbol_id: 1, bid: 1.08542, ask: 1.08545, spread: 3, current_session: 'LONDON', latest_tick_time: new Date().toISOString(), latest_m1_candle_id: 1001, latest_h1_candle_id: 5001, latest_h8_candle_id: 8001, latest_h12_candle_id: 12001, data_health_status: 'DATA_VALID', tradable_status: 'TRADABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, symbol_id: 2, bid: 1.25430, ask: 1.25435, spread: 5, current_session: 'LONDON', latest_tick_time: new Date().toISOString(), latest_m1_candle_id: 1002, latest_h1_candle_id: 5002, latest_h8_candle_id: 8002, latest_h12_candle_id: 12002, data_health_status: 'DATA_VALID', tradable_status: 'TRADABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, symbol_id: 3, bid: 2341.50, ask: 2341.65, spread: 15, current_session: 'LONDON', latest_tick_time: new Date().toISOString(), latest_m1_candle_id: 1003, latest_h1_candle_id: 5003, latest_h8_candle_id: 8003, latest_h12_candle_id: 12003, data_health_status: 'DATA_WARNING', tradable_status: 'TRADABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  candle_rebuild_logs: [
    { id: 1, symbol_id: 1, timeframe: 'H1', start_time: new Date(Date.now() - 86400000).toISOString(), end_time: new Date().toISOString(), rebuild_reason: 'Missing M1 data gap filled', source_used: 'FIX_API', records_rebuilt: 24, records_failed: 0, triggered_by: 'SystemAutoRebuild', status: 'SUCCESS', created_at: new Date().toISOString() }
  ],
  symbol_masters: [
    { id: 1, symbol_code: 'EURUSD', display_name: 'Euro vs US Dollar', asset_class: 'FOREX', base_currency: 'EUR', quote_currency: 'USD', profit_currency: 'USD', margin_currency: 'EUR', pip_size: 0.0001, point_size: 0.00001, tick_size: 0.00001, tick_value: 1, digits: 5, contract_size: 100000, min_lot: 0.01, max_lot: 100, lot_step: 0.01, typical_spread: 2, max_allowed_spread: 20, min_stop_distance: 10, freeze_level: 0, analysis_enabled: 1, trading_enabled: 1, backtesting_enabled: 1, status: 'CONFIG_COMPLETE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, symbol_code: 'GBPUSD', display_name: 'British Pound vs US Dollar', asset_class: 'FOREX', base_currency: 'GBP', quote_currency: 'USD', profit_currency: 'USD', margin_currency: 'GBP', pip_size: 0.0001, point_size: 0.00001, tick_size: 0.00001, tick_value: 1, digits: 5, contract_size: 100000, min_lot: 0.01, max_lot: 100, lot_step: 0.01, typical_spread: 3, max_allowed_spread: 30, min_stop_distance: 15, freeze_level: 0, analysis_enabled: 1, trading_enabled: 1, backtesting_enabled: 1, status: 'CONFIG_COMPLETE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, symbol_code: 'USDJPY', display_name: 'US Dollar vs Japanese Yen', asset_class: 'FOREX', base_currency: 'USD', quote_currency: 'JPY', profit_currency: 'JPY', margin_currency: 'USD', pip_size: 0.01, point_size: 0.001, tick_size: 0.001, tick_value: 1000, digits: 3, contract_size: 100000, min_lot: 0.01, max_lot: 100, lot_step: 0.01, typical_spread: 2.5, max_allowed_spread: 25, min_stop_distance: 10, freeze_level: 0, analysis_enabled: 1, trading_enabled: 1, backtesting_enabled: 1, status: 'CONFIG_COMPLETE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 4, symbol_code: 'XAUUSD', display_name: 'Gold vs US Dollar', asset_class: 'COMMODITY', base_currency: 'XAU', quote_currency: 'USD', profit_currency: 'USD', margin_currency: 'USD', pip_size: 0.1, point_size: 0.01, tick_size: 0.01, tick_value: 1, digits: 2, contract_size: 100, min_lot: 0.01, max_lot: 50, lot_step: 0.01, typical_spread: 15, max_allowed_spread: 50, min_stop_distance: 30, freeze_level: 0, analysis_enabled: 1, trading_enabled: 1, backtesting_enabled: 1, status: 'CONFIG_COMPLETE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  asset_class_defaults: [],
  broker_symbol_mappings: [
    { id: 1, broker_id: 1, broker_name: 'Broker A', broker_server: 'Live1', internal_symbol_id: 1, broker_symbol: 'EURUSD', data_sync_enabled: 1, execution_enabled: 1, last_verified_at: new Date().toISOString(), mapping_status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  symbol_strategy_permissions: [
    { id: 1, symbol_id: 1, strategy_engine_id: 'LIQUIDITY', analysis_enabled: 1, signal_enabled: 1, assisted_execution_enabled: 1, auto_execution_enabled: 0, backtesting_enabled: 1, minimum_setup_score: 80, max_daily_trades: 3, max_open_positions: 1, allowed_timeframes_json: '["H1", "H4"]', allowed_sessions_json: '["LONDON", "NEW_YORK"]', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  symbol_sessions: [
    { id: 1, symbol_id: 1, session_name: 'LONDON', start_time_utc: '08:00', end_time_utc: '16:00', broker_start_time: '10:00', broker_end_time: '18:00', is_active: 1, volatility_expectation: 'HIGH', spread_expectation: 'NORMAL', execution_allowed: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  symbol_spread_rules: [
    { id: 1, symbol_id: 1, session_name: 'LONDON', typical_spread: 2, warning_spread: 8, max_tradable_spread: 15, news_max_spread: 50, rollover_max_spread: 100, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  symbol_news_sensitivities: [
    { id: 1, symbol_id: 1, affected_currencies_json: '["EUR", "USD"]', high_impact_block_minutes_before: 30, high_impact_block_minutes_after: 60, critical_block_minutes_before: 60, critical_block_minutes_after: 120, auto_trade_allowed_during_news: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  symbol_validation_statuses: [
    { id: 1, symbol_id: 1, validation_status: 'VALID', missing_fields_json: '[]', last_validated_at: new Date().toISOString(), validated_by: 'System', notes: 'All rules passed', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  candles: [
    { id: 1, symbol_id: 1, source_id: 1, timeframe: 'M1', open_time: new Date(Date.now() - 60000).toISOString(), close_time: new Date().toISOString(), open_price: 1.08540, high_price: 1.08545, low_price: 1.08535, close_price: 1.08542, tick_volume: 120, real_volume: 0, spread: 3, broker_time: new Date(Date.now() - 60000).toISOString(), utc_time: new Date(Date.now() - 60000).toISOString(), candle_direction: 'BULLISH', body_size: 0.00002, upper_wick_size: 0.00003, lower_wick_size: 0.00005, total_range: 0.00010, body_to_range_ratio: 0.2, upper_wick_ratio: 0.3, lower_wick_ratio: 0.5, candle_strength_score: 45, status: 'CLOSED', is_synthetic: 0, is_rebuilt: 0, source_candle_ids_json: '[]', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  candle_build_jobs: [
    { id: 1, job_type: 'AGGREGATION', symbol_id: 1, timeframe: 'H1', start_time: new Date(Date.now() - 3600000*24).toISOString(), end_time: new Date().toISOString(), source_timeframe: 'M1', status: 'COMPLETED', records_processed: 1440, records_created: 24, records_updated: 0, records_failed: 0, error_message: null, started_at: new Date(Date.now() - 60000).toISOString(), completed_at: new Date().toISOString(), created_at: new Date().toISOString() }
  ],
  candle_anomalies: [
    { id: 1, symbol_id: 1, timeframe: 'M1', candle_time: new Date(Date.now() - 3600000).toISOString(), anomaly_type: 'MISSING_SOURCE_CANDLE', severity: 'HIGH', description: 'Missing sequence gap detected in ticks', resolution_status: 'OPEN', created_at: new Date().toISOString(), resolved_at: null }
  ],
  tick_ingestion_logs: [
     { id: 1, symbol_id: 1, source_id: 1, ticks_received: 5000, ticks_valid: 4990, ticks_rejected: 10, start_time: new Date(Date.now() - 86400000).toISOString(), end_time: new Date().toISOString(), status: 'ACTIVE', created_at: new Date().toISOString() }
  ],
  synthetic_candles: [
    { id: 1, symbol_id: 1, timeframe: 'H8', block_name: 'London', block_sequence: 2, open_time: new Date(Date.now() - 8*3600000).toISOString(), close_time: new Date().toISOString(), open_price: 1.0800, high_price: 1.0900, low_price: 1.0750, close_price: 1.0890, tick_volume: 125000, average_spread: 2.1, candle_direction: 'BULLISH', body_size: 0.0090, upper_wick_size: 0.0010, lower_wick_size: 0.0050, total_range: 0.0150, body_to_range_ratio: 0.6, candle_strength_score: 85, institutional_behavior_type: 'LONDON_SWEEP_ASIAN_LOW_BULLISH_EXPANSION', interpretation: 'The London H8 candle swept the Asian low, rejected below the Asian range, and closed bullish above the Asian midpoint. This suggests that London may have performed a sell-side liquidity sweep followed by bullish expansion.', source_candle_ids_json: '[101,102,103,104,105,106,107,108]', source_integrity_status: 'COMPLETE', status: 'COMPLETE', is_rebuilt: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  synthetic_candle_build_jobs: [
    { id: 1, symbol_id: 1, timeframe: 'H8', build_type: 'HISTORICAL_GENERATION', start_date: new Date(Date.now() - 30*24*3600000).toISOString(), end_date: new Date().toISOString(), status: 'COMPLETED', records_created: 90, records_updated: 0, records_failed: 0, error_message: null, started_at: new Date(Date.now() - 60000).toISOString(), completed_at: new Date().toISOString(), created_at: new Date().toISOString() }
  ],
  synthetic_candle_interpretations: [
    { id: 1, synthetic_candle_id: 1, interpretation_type: 'LONDON_BEHAVIOR', interpretation_summary: 'London bullish expansion after sweeping Asian low', supporting_evidence_json: '{"asian_low_swept": true, "close_above_midpoint": true}', confidence_score: 92, created_at: new Date().toISOString() }
  ],
  session_block_configurations: [
    { id: 1, symbol_id: 1, block_type: 'H8', block_name: 'Asian', block_sequence: 1, start_time_utc: '00:00', end_time_utc: '08:00', broker_start_time: '02:00', broker_end_time: '10:00', timezone_rule: 'EET', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, symbol_id: 1, block_type: 'H8', block_name: 'London', block_sequence: 2, start_time_utc: '08:00', end_time_utc: '16:00', broker_start_time: '10:00', broker_end_time: '18:00', timezone_rule: 'EET', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, symbol_id: 1, block_type: 'H8', block_name: 'New York', block_sequence: 3, start_time_utc: '16:00', end_time_utc: '24:00', broker_start_time: '18:00', broker_end_time: '02:00', timezone_rule: 'EET', is_active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  market_sessions: [
    { id: 1, symbol_id: 1, session_name: 'London', session_date: new Date().toISOString().split('T')[0], start_time_utc: new Date(Date.now() - 8*3600000).toISOString(), end_time_utc: new Date().toISOString(), broker_start_time: new Date(Date.now() - 8*3600000).toISOString(), broker_end_time: new Date().toISOString(), open_price: 1.0800, high_price: 1.0900, low_price: 1.0780, close_price: 1.0890, midpoint_price: 1.0840, session_range: 0.0120, body_size: 0.0090, upper_wick_size: 0.0010, lower_wick_size: 0.0020, direction: 'BULLISH', strength_score: 85, average_spread: 2.1, maximum_spread: 5.0, tick_volume: 125000, behavior_type: 'LONDON_SWEEP_ASIAN_LOW', session_score: 92, status: 'CLOSED', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  session_liquidity_levels: [
    { id: 1, market_session_id: 1, symbol_id: 1, level_type: 'SESSION_LOW', price_level: 1.0780, strength_score: 80, status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  session_behavior_events: [
    { id: 1, market_session_id: 1, symbol_id: 1, event_type: 'LIQUIDITY_SWEEP', event_time: new Date(Date.now() - 6*3600000).toISOString(), event_price: 1.0780, related_level_id: 1, confidence_score: 90, interpretation: 'London swept Asian Low', created_at: new Date().toISOString() }
  ],
  session_relationships: [
    { id: 1, symbol_id: 1, session_date: new Date().toISOString().split('T')[0], source_session: 'Asian', target_session: 'London', relationship_type: 'LONDON_SWEEP_ASIAN_LOW_BULLISH_EXPANSION', summary: 'London swept Asian low and expanded bullish', confidence_score: 95, created_at: new Date().toISOString() }
  ],
  data_quality_events: [
    { id: 1, symbol_id: 1, timeframe: 'M1', event_type: 'MISSING_CANDLES', severity: 'HIGH', description: 'Missing sequence of M1 candles detected', affected_start_time: new Date(Date.now() - 2*3600000).toISOString(), affected_end_time: new Date(Date.now() - 3600000).toISOString(), affected_modules_json: '["SYNTHETIC_CANDLE_ENGINE", "SESSION_INTELLIGENCE"]', trading_permission_impact: 'DATA_PERMISSION_BLOCK_AUTO', resolution_status: 'OPEN', created_at: new Date().toISOString(), resolved_at: null }
  ],
  data_health_snapshots: [
    { id: 1, symbol_id: 1, timeframe: 'M1', health_score: 82, health_status: 'WARNING', tick_freshness_status: 'EXCELLENT', candle_completeness_status: 'DEGRADED', ohlc_validity_status: 'EXCELLENT', spread_status: 'NORMAL', timestamp_alignment_status: 'EXCELLENT', synthetic_integrity_status: 'GOOD', trading_permission: 'DATA_PERMISSION_WARNING', created_at: new Date().toISOString() }
  ],
  data_validation_results: [
    { id: 1, entity_type: 'CANDLE', entity_id: 1, validation_type: 'OHLC_INTEGRITY', validation_status: 'FAILED', error_code: 'HIGH_LESS_THAN_OPEN', error_message: 'High price is less than open price', severity: 'CRITICAL', created_at: new Date().toISOString() }
  ],
  data_recovery_logs: [
    { id: 1, data_quality_event_id: 1, recovery_type: 'MT5_HISTORY_SYNC', source_used: 'MT5_TERMINAL_1', records_requested: 60, records_recovered: 60, records_failed: 0, recovery_status: 'COMPLETED', notes: 'Successfully recovered missing M1 candles', started_at: new Date(Date.now() - 3600000).toISOString(), completed_at: new Date(Date.now() - 3500000).toISOString() }
  ],
  bias_states: [
    { id: 1, symbol_id: 1, timeframe: 'D1', bias_state: 'BULLISH', confidence_score: 76, trade_permission: 'BUY_PREFERRED', supporting_factors_json: '["Higher Highs", "Respects Discount Zone"]', conflicting_factors_json: '["W1 rejection weak"]', explanation: 'Daily bias is bullish because price has continued to respect higher lows, the previous daily low remains protected, and the most recent daily candle closed above its midpoint with strong body dominance.', calculated_at: new Date().toISOString(), created_at: new Date().toISOString() },
    { id: 2, symbol_id: 1, timeframe: 'H4', bias_state: 'PULLBACK', confidence_score: 64, trade_permission: 'WAIT_FOR_CONFIRMATION', supporting_factors_json: '["Entering Discount"]', conflicting_factors_json: '["Lower Highs"]', explanation: 'Tactical bias is corrective because price is pulling back against the higher timeframe bullish trend, but the protected daily higher low has not been broken.', calculated_at: new Date().toISOString(), created_at: new Date().toISOString() },
    { id: 3, symbol_id: 1, timeframe: 'M15', bias_state: 'NEUTRAL', confidence_score: 46, trade_permission: 'WAIT_FOR_CONFIRMATION', supporting_factors_json: '[]', conflicting_factors_json: '["Trapped in range"]', explanation: 'Execution bias is not ready because M15 has not yet produced bullish structure shift after the current pullback, and M5 remains trapped inside a small corrective range.', calculated_at: new Date().toISOString(), created_at: new Date().toISOString() }
  ],
  bias_matrix_snapshots: [
    { id: 1, symbol_id: 1, strategic_bias: 'BULLISH', strategic_confidence: 82, tactical_bias: 'PULLBACK', tactical_confidence: 66, execution_bias: 'WAIT_FOR_CONFIRMATION', execution_confidence: 48, final_bias: 'BULLISH', final_confidence: 65, final_permission: 'BUY_PREFERRED_WAIT', bias_conflict_type: 'HTF_BULLISH_LTF_BEARISH_PULLBACK', explanation: 'Higher timeframe remains bullish, but lower timeframe execution confirmation is not yet present. Buy setups are preferred only after lower-timeframe bullish confirmation.', created_at: new Date().toISOString() }
  ],
  bias_invalidation_events: [
    { id: 1, symbol_id: 1, timeframe: 'H1', previous_bias: 'BULLISH', new_bias: 'NEUTRAL', invalidation_reason: 'Opposite BOS occurs with displacement', related_event_type: 'STRUCTURE_SHIFT', related_event_id: 42, explanation: 'H1 bullish bias invalidated due to strong bearish displacement breaking the local higher low.', created_at: new Date(Date.now() - 4000000).toISOString() }
  ],
  swing_points: [
    { id: 1, symbol_id: 1, timeframe: 'H4', swing_type: 'SWING_LOW', price: 1.08500, candle_id: 101, candle_time: new Date(Date.now() - 86400000).toISOString(), strength_score: 85, is_internal: false, is_external: true, is_protected: true, is_weak: false, is_strong: true, created_liquidity: true, swept_at: null, status: 'RESPECTED', created_at: new Date().toISOString(), updated_at: null },
    { id: 2, symbol_id: 1, timeframe: 'H4', swing_type: 'SWING_HIGH', price: 1.09200, candle_id: 105, candle_time: new Date(Date.now() - 43200000).toISOString(), strength_score: 70, is_internal: true, is_external: false, is_protected: false, is_weak: true, is_strong: false, created_liquidity: true, swept_at: null, status: 'TARGET', created_at: new Date().toISOString(), updated_at: null }
  ],
  structure_events: [
    { id: 1, symbol_id: 1, timeframe: 'H4', event_type: 'BREAK_OF_STRUCTURE', direction: 'BULLISH', price_level: 1.09000, candle_id: 108, event_time: new Date(Date.now() - 21600000).toISOString(), strength_score: 88, related_swing_id: 2, validity_status: 'CONFIRMED', confirmation_type: 'DISPLACEMENT', explanation: 'Strong bullish BOS confirmed by 40-pip displacement breaking previous weak high.', created_at: new Date().toISOString() }
  ],
  structure_states: [
    { id: 1, symbol_id: 1, timeframe: 'H4', current_state: 'BULLISH_STRUCTURE', current_direction: 'BULLISH', protected_high: null, protected_low: 1.08500, last_bos_event_id: 1, last_choch_event_id: null, confidence_score: 92, trade_permission: 'BUY_PREFERRED', explanation: 'H4 structure remains bullish because price has continued to protect the most recent higher low at 1.08500, the latest bullish BOS closed above the previous swing high, and the current pullback remains above the protected structural low.', updated_at: new Date().toISOString() }
  ],
  structure_transitions: [
    { id: 1, symbol_id: 1, timeframe: 'H4', previous_state: 'BEARISH_STRUCTURE', new_state: 'BULLISH_STRUCTURE', transition_type: 'REVERSAL', supporting_events_json: '["BULLISH_CHOCH", "LIQUIDITY_SWEEP", "BULLISH_BOS"]', confidence_score: 85, explanation: 'Full reversal confirmed: Bearish structure swept sell-side liquidity, followed by a bullish CHoCH and strong bullish BOS.', created_at: new Date(Date.now() - 172800000).toISOString() }
  ],
  dealing_ranges: [
    { id: 1, symbol_id: 1, timeframe: 'H4', range_type: 'SWING_RANGE', range_high: 1.09200, range_low: 1.08500, equilibrium_price: 1.08850, premium_zone_start: 1.08850, discount_zone_start: 1.08850, current_price_location: 'DISCOUNT', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  liquidity_pools: [
    { id: 1, symbol_id: 1, timeframe: 'H1', liquidity_type: 'EQUAL_HIGH_LIQUIDITY', price_level: 1.09250, strength_score: 85, touch_count: 3, is_internal: false, is_external: true, is_active: true, created_at: new Date().toISOString(), updated_at: null },
    { id: 2, symbol_id: 1, timeframe: 'M15', liquidity_type: 'SESSION_LOW_LIQUIDITY', price_level: 1.08650, strength_score: 70, touch_count: 1, is_internal: true, is_external: false, is_active: true, created_at: new Date().toISOString(), updated_at: null }
  ],
  liquidity_events: [
    { id: 1, symbol_id: 1, timeframe: 'H1', event_type: 'SELL_SIDE_SWEEP', liquidity_pool_id: null, event_price: 1.08450, event_time: new Date(Date.now() - 3600000).toISOString(), event_strength: 90, confirmation_status: 'CONFIRMED_SWEEP', post_sweep_behavior: 'SWEEP_AND_REVERSAL', explanation: 'Price swept sell-side liquidity below the Asian low and quickly rejected, closing bullish above the range. This indicates a potential liquidity grab followed by bullish expansion.', created_at: new Date().toISOString() }
  ],
  liquidity_maps: [
    { id: 1, symbol_id: 1, timeframe: 'H1', nearest_buy_liquidity: 1.09250, nearest_sell_liquidity: 1.08650, strong_liquidity_levels_json: '[{"price": 1.09250, "type": "EQUAL_HIGHS"}]', weak_liquidity_levels_json: '[{"price": 1.08650, "type": "INTERNAL_LOW"}]', recently_swept_levels_json: '[{"price": 1.08450, "time": "2h ago"}]', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  inducement_events: [
    { id: 1, symbol_id: 1, timeframe: 'M15', inducement_type: 'FAKE_BREAKOUT', price_level: 1.08900, confirmation_status: 'INDUCEMENT_CONFIRMED', explanation: 'Minor bullish CHoCH formed inside discount zone, acting as inducement before sweeping the true external low.', created_at: new Date().toISOString() }
  ],
  institutional_zones: [
    { id: 1, symbol_id: 1, timeframe: 'H1', zone_type: 'BULLISH_FAIR_VALUE_GAP', direction: 'BULLISH', zone_high: 1.08750, zone_low: 1.08600, origin_candle_id: 108, related_liquidity_event_id: 1, related_structure_event_id: null, related_session_id: null, quality_score: 85, status: 'ACTIVE', fill_percentage: 20, freshness_status: 'PARTIALLY_MITIGATED', created_at: new Date(Date.now() - 7200000).toISOString(), updated_at: new Date().toISOString() },
    { id: 2, symbol_id: 1, timeframe: 'H4', zone_type: 'BEARISH_ORDER_BLOCK', direction: 'BEARISH', zone_high: 1.09400, zone_low: 1.09200, origin_candle_id: 95, related_liquidity_event_id: null, related_structure_event_id: null, related_session_id: null, quality_score: 70, status: 'ACTIVE', fill_percentage: 50, freshness_status: 'PARTIALLY_MITIGATED', created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString() }
  ],
  zone_mitigation_events: [
    { id: 1, zone_id: 1, mitigation_type: 'TAPPED', mitigation_price: 1.08700, mitigation_time: new Date(Date.now() - 3600000).toISOString(), fill_percentage: 20, reaction_score: 65, held_or_failed: 'HELD', related_setup_id: null, created_at: new Date().toISOString() }
  ],
  premium_discount_ranges: [
    { id: 1, symbol_id: 1, timeframe: 'H4', range_type: 'SWING_RANGE', range_high: 1.09500, range_low: 1.08500, equilibrium_price: 1.09000, premium_start: 1.09000, discount_start: 1.09000, current_price_location: 'DISCOUNT', related_structure_id: null, related_channel_id: null, created_at: new Date().toISOString(), updated_at: null }
  ],
  zone_quality_scores: [
    { id: 1, zone_id: 1, score_value: 85, score_breakdown_json: '{"liquidity": 20, "displacement": 20, "structure": 15, "bias": 15, "location": 10, "freshness": 5}', classification: 'HIGH_QUALITY_ZONE', positive_factors_json: '["Swept Asian Low", "Created with displacement", "Discount zone"]', negative_factors_json: '["Partially mitigated"]', explanation: 'A bullish fair value gap was created on H1 after London swept sell-side liquidity below the Asian low and produced strong bullish displacement. The zone remains partially unfilled, aligns with daily bullish bias, and is located in discount, making it a valid potential retracement area.', created_at: new Date().toISOString() }
  ],
  opposing_zone_warnings: [
    { id: 1, setup_id: null, symbol_id: 1, zone_id: 2, warning_type: 'OPPOSING_ZONE_NEARBY', severity: 'HIGH', distance_to_zone: 0.00350, recommendation: 'TRADE_TARGET_RESTRICTED', explanation: 'The Channel Strategy breakout buy setup is approaching a strong H4 supply zone. The setup should be downgraded or require stronger confirmation before execution.', created_at: new Date().toISOString() }
  ],
  channels: [
    { id: 1, symbol_id: 1, timeframe: 'H4', channel_type: 'BULLISH_CHANNEL', direction: 'UPWARD_CHANNEL', slope: 0.0015, upper_boundary_line: 'y = 0.0015x + 1.0900', lower_boundary_line: 'y = 0.0015x + 1.0850', midline: 'y = 0.0015x + 1.0875', touch_count_upper: 3, touch_count_lower: 2, strength_score: 85, status: 'ACTIVE', parent_channel_id: null, explanation: 'Established H4 bullish channel with clean bounces off both boundaries. Currently in discount territory.', created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date().toISOString() },
    { id: 2, symbol_id: 1, timeframe: 'M15', channel_type: 'CORRECTIVE_CHANNEL', direction: 'DOWNWARD_CHANNEL', slope: -0.0008, upper_boundary_line: 'y = -0.0008x + 1.0920', lower_boundary_line: 'y = -0.0008x + 1.0890', midline: 'y = -0.0008x + 1.0905', touch_count_upper: 2, touch_count_lower: 2, strength_score: 70, status: 'ACTIVE', parent_channel_id: 1, explanation: 'A bearish corrective channel has formed on M15 within the bullish H4 trend. Price is approaching the lower boundary for the third touch.', created_at: new Date(Date.now() - 14400000).toISOString(), updated_at: new Date().toISOString() }
  ],
  channel_touches: [
    { id: 1, channel_id: 2, touch_type: 'SECOND_TOUCH', touch_price: 1.0895, touch_time: new Date(Date.now() - 7200000).toISOString(), rejection_strength: 78, candle_id: 88, created_at: new Date().toISOString() }
  ],
  channel_breakouts: [
    { id: 1, channel_id: 1, breakout_type: 'BODY_BREAKOUT', breakout_direction: 'BULLISH', breakout_price: 1.0965, breakout_time: new Date(Date.now() - 86400000).toISOString(), confirmation_status: 'CONFIRMED', strength_score: 80, created_at: new Date().toISOString() }
  ],
  channel_retests: [
    { id: 1, channel_id: 1, retest_status: 'RETEST_CONFIRMED', retest_price: 1.0940, retest_time: new Date(Date.now() - 43200000).toISOString(), confirmation_strength: 85, created_at: new Date().toISOString() }
  ],
  channel_lifecycle: [
    { id: 1, channel_id: 2, previous_state: 'FORMING', current_state: 'ACTIVE', transition_reason: 'Second confirmation touch on lower boundary.', created_at: new Date(Date.now() - 7200000).toISOString() }
  ],
  liquidity_setups: [
    { id: 1, symbol_id: 1, timeframe: 'M15', setup_type: 'BUY_AFTER_SELL_SIDE_SWEEP', direction: 'BULLISH', liquidity_event_id: 1, structure_event_id: 1, zone_id: 1, entry_zone_high: 1.0875, entry_zone_low: 1.0860, entry_price: 1.0870, stop_loss: 1.0850, take_profit_targets_json: '[1.0920, 1.0950]', risk_reward_ratio: 2.5, setup_score: 92, confidence_level: 'A+', status: 'WAITING_CONFIRMATION', explanation: 'Sell-side liquidity below the Asian low was swept during the London session, followed by a bullish CHoCH and strong displacement. Price is now retracing into a bullish fair value gap located in discount. Waiting for M5 micro CHoCH confirmation.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  setup_lifecycle: [
    { id: 1, setup_id: 1, previous_status: 'VALIDATED', new_status: 'WAITING_CONFIRMATION', transition_reason: 'Zone identified, waiting for lower timeframe confirmation', created_at: new Date().toISOString() }
  ],
  setup_validation_logs: [
    { id: 1, setup_id: 1, validation_type: 'LIQUIDITY_SWEEP', result: 'PASS', details: 'Valid sell-side sweep detected', created_at: new Date().toISOString() },
    { id: 2, setup_id: 1, validation_type: 'STRUCTURE_SHIFT', result: 'PASS', details: 'Bullish CHoCH confirmed with displacement', created_at: new Date().toISOString() }
  ],
  channel_strategy_setups: [
    { id: 1, strategy_version_id: null, channel_id: 1, parent_channel_id: null, child_channel_id: 2, symbol_id: 1, timeframe: 'M15', setup_type: 'THIRD_TOUCH_BUY', direction: 'BULLISH', setup_stage: 'WAITING_FOR_REJECTION', entry_zone_high: 1.0895, entry_zone_low: 1.0885, proposed_entry_price: 1.0890, proposed_stop_loss: 1.0870, take_profit_targets_json: '[1.0920, 1.0950]', risk_reward_ratio: 2.5, channel_strength_score: 85, touch_quality_score: 80, breakout_quality_score: null, retest_quality_score: null, bias_context_json: '{"bias": "BULLISH"}', structure_context_json: '{}', liquidity_context_json: '{}', zone_context_json: '{}', session_context_json: '{}', status: 'WAITING_FOR_REJECTION', explanation: 'A third-touch buy setup has formed on EURUSD M15 because price reached the lower boundary of a validated ascending channel. Waiting for bullish rejection.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  channel_setup_lifecycle_events: [
    { id: 1, setup_id: 1, previous_stage: 'WAITING_FOR_TOUCH', new_stage: 'WAITING_FOR_REJECTION', transition_reason: 'Price reached lower boundary', created_at: new Date().toISOString() }
  ],
  channel_setup_validation_logs: [
    { id: 1, setup_id: 1, validation_type: 'CHANNEL_TOUCH', validation_result: 'PASS', details_json: '{"touch_count": 3}', created_at: new Date().toISOString() }
  ]
};

// Open and auto-initialize
export async function openDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    const parsed = JSON.parse(data) as DatabaseStructure;
    
    // Auto-migrate tables if missing
    if (!parsed.system_services) parsed.system_services = defaultData.system_services;
    if (!parsed.system_events) parsed.system_events = defaultData.system_events;
    if (!parsed.service_health_snapshots) parsed.service_health_snapshots = defaultData.service_health_snapshots;
    if (!parsed.system_environments) parsed.system_environments = defaultData.system_environments;
    if (!parsed.feature_flags) parsed.feature_flags = defaultData.feature_flags;
    if (!parsed.runtime_configurations) parsed.runtime_configurations = defaultData.runtime_configurations;
    if (!parsed.configuration_change_logs) parsed.configuration_change_logs = defaultData.configuration_change_logs;
    if (!parsed.configuration_approval_requests) parsed.configuration_approval_requests = defaultData.configuration_approval_requests;
    if (!parsed.compliance_documents) parsed.compliance_documents = defaultData.compliance_documents;
    if (!parsed.compliance_acceptances) parsed.compliance_acceptances = defaultData.compliance_acceptances;
    if (!parsed.compliance_status_snapshots) parsed.compliance_status_snapshots = defaultData.compliance_status_snapshots;
    if (!parsed.compliance_reacceptance_requests) parsed.compliance_reacceptance_requests = defaultData.compliance_reacceptance_requests;
    if (!parsed.market_data_sources) parsed.market_data_sources = defaultData.market_data_sources;
    if (!parsed.symbols) parsed.symbols = defaultData.symbols;
    if (!parsed.market_snapshots) parsed.market_snapshots = defaultData.market_snapshots;
    if (!parsed.candle_rebuild_logs) parsed.candle_rebuild_logs = defaultData.candle_rebuild_logs;
    if (!parsed.symbol_masters) parsed.symbol_masters = defaultData.symbol_masters;
    if (!parsed.asset_class_defaults) parsed.asset_class_defaults = defaultData.asset_class_defaults;
    if (!parsed.broker_symbol_mappings) parsed.broker_symbol_mappings = defaultData.broker_symbol_mappings;
    if (!parsed.symbol_strategy_permissions) parsed.symbol_strategy_permissions = defaultData.symbol_strategy_permissions;
    if (!parsed.symbol_sessions) parsed.symbol_sessions = defaultData.symbol_sessions;
    if (!parsed.symbol_spread_rules) parsed.symbol_spread_rules = defaultData.symbol_spread_rules;
    if (!parsed.symbol_news_sensitivities) parsed.symbol_news_sensitivities = defaultData.symbol_news_sensitivities;
    if (!parsed.symbol_validation_statuses) parsed.symbol_validation_statuses = defaultData.symbol_validation_statuses;
    if (!parsed.candles) parsed.candles = defaultData.candles;
    if (!parsed.candle_build_jobs) parsed.candle_build_jobs = defaultData.candle_build_jobs;
    if (!parsed.candle_anomalies) parsed.candle_anomalies = defaultData.candle_anomalies;
    if (!parsed.tick_ingestion_logs) parsed.tick_ingestion_logs = defaultData.tick_ingestion_logs;
    if (!parsed.synthetic_candles) parsed.synthetic_candles = defaultData.synthetic_candles;
    if (!parsed.synthetic_candle_build_jobs) parsed.synthetic_candle_build_jobs = defaultData.synthetic_candle_build_jobs;
    if (!parsed.synthetic_candle_interpretations) parsed.synthetic_candle_interpretations = defaultData.synthetic_candle_interpretations;
    if (!parsed.session_block_configurations) parsed.session_block_configurations = defaultData.session_block_configurations;
    if (!parsed.market_sessions) parsed.market_sessions = defaultData.market_sessions;
    if (!parsed.session_liquidity_levels) parsed.session_liquidity_levels = defaultData.session_liquidity_levels;
    if (!parsed.session_behavior_events) parsed.session_behavior_events = defaultData.session_behavior_events;
    if (!parsed.session_relationships) parsed.session_relationships = defaultData.session_relationships;
    if (!parsed.data_quality_events) parsed.data_quality_events = defaultData.data_quality_events;
    if (!parsed.data_health_snapshots) parsed.data_health_snapshots = defaultData.data_health_snapshots;
    if (!parsed.data_validation_results) parsed.data_validation_results = defaultData.data_validation_results;
    if (!parsed.data_recovery_logs) parsed.data_recovery_logs = defaultData.data_recovery_logs;
    if (!parsed.bias_states) parsed.bias_states = defaultData.bias_states;
    if (!parsed.bias_matrix_snapshots) parsed.bias_matrix_snapshots = defaultData.bias_matrix_snapshots;
    if (!parsed.bias_invalidation_events) parsed.bias_invalidation_events = defaultData.bias_invalidation_events;
    if (!parsed.swing_points) parsed.swing_points = defaultData.swing_points;
    if (!parsed.structure_events) parsed.structure_events = defaultData.structure_events;
    if (!parsed.structure_states) parsed.structure_states = defaultData.structure_states;
    if (!parsed.structure_transitions) parsed.structure_transitions = defaultData.structure_transitions;
    if (!parsed.dealing_ranges) parsed.dealing_ranges = defaultData.dealing_ranges;
    if (!parsed.liquidity_pools) parsed.liquidity_pools = defaultData.liquidity_pools;
    if (!parsed.liquidity_events) parsed.liquidity_events = defaultData.liquidity_events;
    if (!parsed.liquidity_maps) parsed.liquidity_maps = defaultData.liquidity_maps;
    if (!parsed.inducement_events) parsed.inducement_events = defaultData.inducement_events;
    if (!parsed.institutional_zones) parsed.institutional_zones = defaultData.institutional_zones;
    if (!parsed.zone_mitigation_events) parsed.zone_mitigation_events = defaultData.zone_mitigation_events;
    if (!parsed.premium_discount_ranges) parsed.premium_discount_ranges = defaultData.premium_discount_ranges;
    if (!parsed.zone_quality_scores) parsed.zone_quality_scores = defaultData.zone_quality_scores;
    if (!parsed.opposing_zone_warnings) parsed.opposing_zone_warnings = defaultData.opposing_zone_warnings;
    if (!parsed.channels) parsed.channels = defaultData.channels;
    if (!parsed.channel_touches) parsed.channel_touches = defaultData.channel_touches;
    if (!parsed.channel_breakouts) parsed.channel_breakouts = defaultData.channel_breakouts;
    if (!parsed.channel_retests) parsed.channel_retests = defaultData.channel_retests;
    if (!parsed.channel_lifecycle) parsed.channel_lifecycle = defaultData.channel_lifecycle;
    if (!parsed.liquidity_setups) parsed.liquidity_setups = defaultData.liquidity_setups;
    if (!parsed.setup_lifecycle) parsed.setup_lifecycle = defaultData.setup_lifecycle;
    if (!parsed.setup_validation_logs) parsed.setup_validation_logs = defaultData.setup_validation_logs;
    if (!parsed.channel_strategy_setups) parsed.channel_strategy_setups = defaultData.channel_strategy_setups;
    if (!parsed.channel_setup_lifecycle_events) parsed.channel_setup_lifecycle_events = defaultData.channel_setup_lifecycle_events;
    if (!parsed.channel_setup_validation_logs) parsed.channel_setup_validation_logs = defaultData.channel_setup_validation_logs;
    
    return parsed;
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(dbPath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    throw err;
  }
}

export async function saveDb(data: DatabaseStructure) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

// Emulate SQLite queries
// dbMock and all mock data usage removed. Only live data should be used henceforth.

export const db = {
  insertAuditLog: async (action: string, resource: string, resource_id: string, details: string, user: string) => {
    const db = await openDb();
    db.audit_logs.push({
      id: db.audit_logs.length + 1,
      action,
      resource,
      resource_id,
      details,
      user,
      created_at: new Date().toISOString()
    });
    await saveDb(db);
  },
  getFlag: async (flagKey: string) => {
    const db = await openDb();
    return db.feature_flags.find(f => f.flag_key === flagKey);
  },
  updateFlag: async (flagKey: string, isEnabled: number, currentValue: number) => {
    const db = await openDb();
    const flagIndex = db.feature_flags.findIndex(f => f.flag_key === flagKey);
    if (flagIndex > -1) {
      db.feature_flags[flagIndex].is_enabled = isEnabled;
      db.feature_flags[flagIndex].current_value = currentValue;
      db.feature_flags[flagIndex].updated_at = new Date().toISOString();
      await saveDb(db);
    }
  },
  getConfig: async (configKey: string) => {
    const db = await openDb();
    return db.runtime_configurations.find(c => c.config_key === configKey);
  },
  updateConfig: async (configKey: string, configValue: string) => {
    const db = await openDb();
    const configIndex = db.runtime_configurations.findIndex(c => c.config_key === configKey);
    if (configIndex > -1) {
      db.runtime_configurations[configIndex].config_value = configValue;
      db.runtime_configurations[configIndex].updated_at = new Date().toISOString();
      await saveDb(db);
    }
  },
  insertConfigChangeLog: async (config_key: string, previous_value: string, new_value: string, changed_by: string, environment: string, change_reason: string, approval_required: number, approval_status: string) => {
     const db = await openDb();
     const logEntry: ConfigChangeLog = {
         id: db.configuration_change_logs.length + 1,
         config_key,
         previous_value,
         new_value,
         changed_by,
         environment,
         change_reason,
         approval_required,
         approval_status,
         created_at: new Date().toISOString()
     };
     db.configuration_change_logs.push(logEntry);
     await saveDb(db);
     return logEntry;
  },
  insertConfigApprovalRequest: async (config_key: string, requested_value: string, requested_by: string, request_reason: string) => {
     const db = await openDb();
     const reqEntry: ConfigApprovalRequest = {
         id: db.configuration_approval_requests.length + 1,
         config_key,
         requested_value,
         requested_by,
         reviewed_by: null,
         approval_status: 'PENDING_APPROVAL',
         request_reason,
         review_comment: null,
         requested_at: new Date().toISOString(),
         reviewed_at: null
     };
     db.configuration_approval_requests.push(reqEntry);
     await saveDb(db);
     return reqEntry;
  },
  updateApprovalRequest: async (id: number, approval_status: string, reviewed_by: string, review_comment: string) => {
    const db = await openDb();
    const reqIndex = db.configuration_approval_requests.findIndex(r => r.id === id);
    if (reqIndex > -1) {
      db.configuration_approval_requests[reqIndex].approval_status = approval_status;
      db.configuration_approval_requests[reqIndex].reviewed_by = reviewed_by;
      db.configuration_approval_requests[reqIndex].review_comment = review_comment;
      db.configuration_approval_requests[reqIndex].reviewed_at = new Date().toISOString();
      await saveDb(db);
      return db.configuration_approval_requests[reqIndex];
    }
    return null;
  },
  insertEvent: async (eventData: Omit<SystemEvent, 'id' | 'created_at' | 'processed_at' | 'status'>) => {
    const db = await openDb();
    const newEvent: SystemEvent = {
        id: db.system_events.length + 1,
        ...eventData,
        status: 'PENDING',
        created_at: new Date().toISOString(),
        processed_at: null
    };
    db.system_events.push(newEvent);
    await saveDb(db);
    return newEvent;
  }
};

