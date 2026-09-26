import "server-only"

import { Pool, type PoolClient } from "pg"

declare global {
  var __storylogPool: Pool | undefined
}

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Add it to storylog/.env.local before using PostgreSQL-backed Storylog."
    )
  }

  return databaseUrl
}

export function getPool() {
  if (!globalThis.__storylogPool) {
    globalThis.__storylogPool = new Pool({
      connectionString: getDatabaseUrl(),
    })
  }

  return globalThis.__storylogPool
}

export type DatabaseClient = Pool | PoolClient

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
) {
  const client = await getPool().connect()

  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}
