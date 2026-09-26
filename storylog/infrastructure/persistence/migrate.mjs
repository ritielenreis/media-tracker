import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import pg from "pg"
import nextEnv from "@next/env"

const { loadEnvConfig } = nextEnv

loadEnvConfig(process.cwd())

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Add it to storylog/.env.local before running db:migrate.")
}

const { Client } = pg
const client = new Client({ connectionString: databaseUrl })
const schemaDirectory = path.join(process.cwd(), "infrastructure", "persistence", "schema")

const schemaFiles = (await readdir(schemaDirectory))
  .filter((file) => file.endsWith(".sql"))
  .sort()

try {
  await client.connect()

  for (const schemaFile of schemaFiles) {
    const sql = await readFile(path.join(schemaDirectory, schemaFile), "utf8")
    await client.query(sql)
    console.log(`Applied ${schemaFile}`)
  }

  console.log("Database schema is up to date.")
} finally {
  await client.end()
}
