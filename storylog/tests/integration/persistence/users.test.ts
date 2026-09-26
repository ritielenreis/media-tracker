import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { PoolClient } from 'pg'
import {
  getTestClient,
  truncateTestDatabase,
} from '../../test-db-utils'
import { ensureDevelopmentUser } from '@/infrastructure/persistence/users'

describe('Users Persistence', () => {
  let client: PoolClient

  beforeEach(async () => {
    await truncateTestDatabase()
    client = await getTestClient()
  })

  afterEach(() => {
    if (client) {
      client.release()
    }
  })

  describe('ensureDevelopmentUser', () => {
    it('should return a development user without error', async () => {
      const user = await ensureDevelopmentUser(client)

      expect(user).toBeDefined()
      expect(user.id).toBeDefined()
      expect(typeof user.id).toBe('string')
      expect(user.username).toBe('local-dev-user')
    })
  })
})
