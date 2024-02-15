import type { SupabaseServerConfig } from '../supabase';
import { PostgresDBConfig } from './postgres';

/**
 * Gets a PGConfig for Supabase. Supabase is postgres, just the way to get the
 * Database URL is different. The reason to not just use DATABASE_URL is
 * because the Supabase integration for Vercel sets the NEXT_PUBLIC_SUPABASE_URL
 * env var automatically. We prefer to derive the database URL from that plus
 * the password to reduce setup work the user would have to do (going and
 * finding the config vars would otherwise be a minor pain).
 */
export function supabaseDBConfig(config: SupabaseServerConfig) {
  // The Supabase URL env var is the URL to access the Supabase REST API,
  // which looks like: https://pfdhjzsdkvlmuyvttfvt.supabase.co.
  // We need to convert it into the Postgres connection string.
  const { url, dbpass } = config;
  const host = new URL(url).hostname;
  const id = host.split('.')[0];
  return new PostgresDBConfig(`postgres://postgres.${id}:${dbpass}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`);
}
