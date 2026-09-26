#!/usr/bin/env node

/**
 * Test Database Setup Script
 * 
 * Creates and initializes the storylog_test database with the schema.
 * Usage: node infrastructure/persistence/setup-test-db.mjs
 */

import pg from 'pg'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { Client } = pg

async function setupTestDatabase() {
  // Connect to default postgres database to create test database
  const adminClient = new Client({
    connectionString: 'postgresql:///postgres?host=/tmp',
  })

  try {
    await adminClient.connect()
    console.log('Connected to postgres database')

    // Check if test database exists
    const dbCheckResult = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = 'storylog_test'"
    )

    if (dbCheckResult.rowCount === 0) {
      // Create test database
      await adminClient.query('CREATE DATABASE storylog_test')
      console.log('Created storylog_test database')
    } else {
      console.log('storylog_test database already exists')
    }
  } finally {
    await adminClient.end()
  }

  // Connect to test database and apply schema
  const testClient = new Client({
    connectionString: 'postgresql:///storylog_test?host=/tmp',
  })

  try {
    await testClient.connect()
    console.log('Connected to storylog_test database')

    // Drop existing schema (for clean testing)
    await testClient.query(`
      DROP SCHEMA IF EXISTS public CASCADE;
      CREATE SCHEMA public;
    `)
    console.log('Cleaned test database schema')

    // Apply schema files
    const schemaDirectory = path.join(__dirname, 'schema')
    const schemaFiles = (await readdir(schemaDirectory))
      .filter((file) => file.endsWith('.sql'))
      .sort()

    for (const schemaFile of schemaFiles) {
      const sql = await readFile(path.join(schemaDirectory, schemaFile), 'utf8')
      await testClient.query(sql)
      console.log(`Applied ${schemaFile}`)
    }

    console.log('Test database schema is up to date')
  } finally {
    await testClient.end()
  }
}

setupTestDatabase().catch((error) => {
  console.error('Failed to setup test database:', error)
  process.exit(1)
})
