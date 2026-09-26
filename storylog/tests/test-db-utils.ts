import { Pool, PoolClient } from 'pg'

const TEST_DB_NAME = 'storylog_test'
const TEST_DB_URL = `postgresql://deck@/tmp/${TEST_DB_NAME}`

let testPool: Pool | null = null

export async function setupTestDatabase(): Promise<void> {
  // Connect to default postgres database to create test database
  const adminPool = new Pool({
    host: '/tmp',
    user: 'deck',
    database: 'postgres',
  })

  try {
    // Check if test database exists
    const result = await adminPool.query(
      `SELECT datname FROM pg_database WHERE datname = $1`,
      [TEST_DB_NAME]
    )

    if (result.rows.length === 0) {
      await adminPool.query(`CREATE DATABASE ${TEST_DB_NAME}`)
    }
  } finally {
    await adminPool.end()
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
    await client.query('TRUNCATE user_media CASCADE')
    await client.query('TRUNCATE media CASCADE')
    await client.query('TRUNCATE users CASCADE')
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
