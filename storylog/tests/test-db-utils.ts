import { Pool, PoolClient } from 'pg'

// Load test environment
const TEST_DB_URL = process.env.TEST_DATABASE_URL || 'postgresql:///storylog_test?host=/tmp'

let testPool: Pool | null = null

export async function setupTestDatabase(): Promise<void> {
  // Test database should already be created by setup-test-db.mjs
  // This ensures the pool can connect to it
  const pool = await getTestDatabase()
  
  // Test connection
  const client = await pool.connect()
  try {
    await client.query('SELECT 1')
  } finally {
    client.release()
  }
}

export async function getTestDatabase(): Promise<Pool> {
  if (testPool) {
    return testPool
  }

  testPool = new Pool({
    connectionString: TEST_DB_URL,
  })

  return testPool
}

export async function runTestMigrations(): Promise<void> {
  const pool = await getTestDatabase()
  const client = await pool.connect()

  try {
    // Read and execute the migration
    const fs = await import('fs')
    const path = await import('path')
    const migrationPath = path.resolve(
      new URL(import.meta.url).pathname,
      '../../infrastructure/persistence/schema/001_init.sql'
    )

    const sql = fs.readFileSync(migrationPath, 'utf-8')
    await client.query(sql)
  } finally {
    client.release()
  }
}

export async function truncateTestDatabase(): Promise<void> {
  const pool = await getTestDatabase()
  const client = await pool.connect()

  try {
    await client.query('TRUNCATE user_media, media, users CASCADE')
  } finally {
    client.release()
  }
}

export async function closeTestDatabase(): Promise<void> {
  if (testPool) {
    await testPool.end()
    testPool = null
  }
}

export async function getTestClient(): Promise<PoolClient> {
  const pool = await getTestDatabase()
  return pool.connect()
}
