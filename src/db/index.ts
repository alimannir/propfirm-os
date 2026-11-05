import { createClient, Client } from '@libsql/client';
import path from 'path';

let clientInstance: Client | null = null;

export function getDb(): Client {
  if (!clientInstance) {
    const dbPath = process.env.DATABASE_URL || `file:${path.join(process.cwd(), 'propfirmai.db')}`;
    clientInstance = createClient({
      url: dbPath,
    });
  }
  return clientInstance;
}

export async function initializeDatabase(): Promise<void> {
  const db = getDb();

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS firms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      api_key TEXT NOT NULL UNIQUE,
      hmac_secret TEXT NOT NULL,
      webhook_url TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS traders (
      id TEXT PRIMARY KEY,
      firm_id TEXT NOT NULL,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      preferred_name TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS trader_memories (
      id TEXT PRIMARY KEY,
      trader_id TEXT NOT NULL UNIQUE,
      challenges_attempted INTEGER NOT NULL DEFAULT 1,
      months_with_firm INTEGER NOT NULL DEFAULT 1,
      favorite_pairs TEXT NOT NULL, -- JSON array
      usual_session_time TEXT NOT NULL,
      usual_lot_size REAL NOT NULL DEFAULT 1.0,
      known_strengths TEXT NOT NULL, -- JSON array
      known_kryptonite TEXT NOT NULL, -- JSON array
      past_incidents TEXT NOT NULL, -- JSON array
      buddy_notebook TEXT NOT NULL, -- JSON array
      updated_at TEXT NOT NULL,
      FOREIGN KEY (trader_id) REFERENCES traders(id)
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      trader_id TEXT NOT NULL,
      firm_name TEXT NOT NULL,
      account_number TEXT NOT NULL UNIQUE,
      platform TEXT NOT NULL,
      server_name TEXT NOT NULL,
      plan_size REAL NOT NULL,
      starting_balance REAL NOT NULL,
      current_balance REAL NOT NULL,
      current_equity REAL NOT NULL,
      daily_starting_balance REAL NOT NULL,
      daily_loss_limit_pct REAL NOT NULL,
      max_loss_limit_pct REAL NOT NULL,
      profit_target_pct REAL NOT NULL,
      status TEXT NOT NULL, -- 'ACTIVE', 'WARNING', 'CRITICAL', 'BREACHED', 'PASSED'
      breach_reason TEXT,
      breached_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (trader_id) REFERENCES traders(id)
    );

    CREATE TABLE IF NOT EXISTS positions (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      symbol TEXT NOT NULL,
      side TEXT NOT NULL,
      lots REAL NOT NULL,
      open_price REAL NOT NULL,
      current_price REAL NOT NULL,
      sl REAL,
      tp REAL,
      floating_pnl REAL NOT NULL,
      open_time TEXT NOT NULL,
      implied_risk_usd REAL NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    );

    CREATE TABLE IF NOT EXISTS trades (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      symbol TEXT NOT NULL,
      side TEXT NOT NULL,
      lots REAL NOT NULL,
      open_price REAL NOT NULL,
      close_price REAL NOT NULL,
      pnl REAL NOT NULL,
      open_time TEXT NOT NULL,
      close_time TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      spread_pips REAL NOT NULL,
      market_mid_price REAL NOT NULL,
      fill_slippage_pips REAL NOT NULL,
      flags TEXT, -- JSON array
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    );

    CREATE TABLE IF NOT EXISTS audits (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      account_number TEXT NOT NULL,
      breach_rule TEXT NOT NULL,
      breach_timestamp TEXT NOT NULL,
      fairness_score REAL NOT NULL,
      broker_fill_price REAL NOT NULL,
      independent_l1_mid REAL NOT NULL,
      broker_spread_pips REAL NOT NULL,
      independent_spread_pips REAL NOT NULL,
      spread_deviation_pips REAL NOT NULL,
      verdict TEXT NOT NULL,
      verdict_summary TEXT NOT NULL,
      signature_hash TEXT NOT NULL,
      loss_attribution TEXT NOT NULL, -- JSON
      counterfactual_sim TEXT NOT NULL, -- JSON
      created_at TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    );

    CREATE TABLE IF NOT EXISTS retention_offers (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      account_number TEXT NOT NULL,
      archetype_id TEXT NOT NULL,
      coupon_code TEXT NOT NULL,
      discount_pct REAL NOT NULL,
      original_price_usd REAL NOT NULL,
      discounted_price_usd REAL NOT NULL,
      status TEXT NOT NULL, -- 'PROVISIONED', 'VIEWED', 'CONVERTED'
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id)
    );

    CREATE TABLE IF NOT EXISTS ai_settings (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL, -- 'GEMINI', 'OPENAI', 'GROQ', 'LOCAL_FALLBACK'
      api_key TEXT,
      model_name TEXT NOT NULL,
      temperature REAL NOT NULL DEFAULT 0.7,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS api_logs (
      id TEXT PRIMARY KEY,
      endpoint TEXT NOT NULL,
      status INTEGER NOT NULL,
      latency_ms REAL NOT NULL,
      platform TEXT,
      account_number TEXT,
      payload_preview TEXT,
      created_at TEXT NOT NULL
    );
  `);
}

