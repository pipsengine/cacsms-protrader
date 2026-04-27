import { NextResponse } from 'next/server';

export async function GET() {
  const architecture = {
    environments: ['DEVELOPMENT', 'STAGING', 'DEMO_TRADING', 'PRODUCTION_LIVE'],
    currentEnvironment: 'DEVELOPMENT',
    executionMode: 'MANUAL', // AUTO disabled by default per architecture bounds
    strategyEngines: [
      { id: 'LIQUIDITY_ENGINE', status: 'ACTIVE', directExecution: false },
      { id: 'CHANNEL_ENGINE', status: 'ACTIVE', directExecution: false }
    ],
    sharedDataLayer: {
      status: 'ONLINE',
      components: ['Candle Data', 'Session Data', 'News Data', 'Data Quality Engine']
    },
    centralizedRiskEngine: {
      status: 'ONLINE',
      enforcements: ['Global Max Positions', 'Position Sizing Rule', 'No-Forced Trade Filter']
    },
    mt5Bridge: {
      status: 'DISCONNECTED',
      mode: 'READ_ONLY'
    }
  };

  return NextResponse.json({ data: architecture });
}
