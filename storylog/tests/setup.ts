import { vi } from 'vitest'
import dotenv from 'dotenv'
import path from 'path'
import { afterAll, beforeAll } from 'vitest'
import { closeTestDatabase } from './test-db-utils'

// Mock server-only BEFORE any other imports
vi.mock('server-only', () => ({}))

// Load test environment variables
dotenv.config({
  path: path.resolve(process.cwd(), '.env.test'),
})

// Mock Next.js router if needed
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

beforeAll(async () => {
  // Test database is created by setup-test-db.mjs before tests run
})

afterAll(async () => {
  await closeTestDatabase()
})

