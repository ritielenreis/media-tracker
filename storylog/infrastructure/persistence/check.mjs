import pg from "pg"
import nextEnv from "@next/env"

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Add it to storylog/.env.local before running db:check.")
}

const { Client } = pg
const client = new Client({ connectionString: databaseUrl })

const requiredTables = ["users", "media", "user_media"]
const requiredEnums = ["media_type", "user_media_status"]

try {
  await client.connect()

  const tableResult = await client.query(
    `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ANY($1::text[])
    `,
    [requiredTables]
  )

  const enumResult = await client.query(
    `
      SELECT typname
      FROM pg_type
      WHERE typname = ANY($1::text[])
    `,
    [requiredEnums]
  )

  const presentTables = new Set(tableResult.rows.map((row) => row.table_name))
  const presentEnums = new Set(enumResult.rows.map((row) => row.typname))

  const missingTables = requiredTables.filter((tableName) => !presentTables.has(tableName))
  const missingEnums = requiredEnums.filter((enumName) => !presentEnums.has(enumName))

  if (missingTables.length > 0 || missingEnums.length > 0) {
    throw new Error(
      `Schema validation failed. Missing tables: ${missingTables.join(", ") || "none"}; missing enums: ${missingEnums.join(", ") || "none"}.`
    )
  }

  console.log("Schema validation passed.")
} finally {
  await client.end()
}
