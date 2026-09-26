import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { PoolClient } from 'pg'
import { randomUUID } from 'node:crypto'
import {
  getTestClient,
  truncateTestDatabase,
} from '../../test-db-utils'
import { insertUserMedia, listUserLibraryMedia } from '@/infrastructure/persistence/user-media'
import { insertMedia } from '@/infrastructure/persistence/media'
import { ensureDevelopmentUser } from '@/infrastructure/persistence/users'
import type { MediaType } from '@/domain/media'

describe('User Media Persistence', () => {
  let client: PoolClient
  let userId: string
  let mediaId: string

  beforeEach(async () => {
    await truncateTestDatabase()
    client = await getTestClient()

    // Setup test data
    const user = await ensureDevelopmentUser(client)
    userId = user.id

    mediaId = randomUUID()
    await insertMedia(client, {
      id: mediaId,
      title: 'Test Media',
      description: null,
      type: 'movie' as MediaType,
      releaseDate: null,
      coverUrl: null,
    })
  })

  afterEach(() => {
    if (client) {
      client.release()
    }
  })

  describe('insertUserMedia', () => {
    it('should insert user media with planned status without error', async () => {
      await expect(
        insertUserMedia(client, {
          userId,
          mediaId,
          status: 'planned',
          thoughts: undefined,
          rating: undefined,
          startedAt: null,
          completedAt: null,
        })
      ).resolves.toBeUndefined()
    })

    it('should insert user media with completed status and metadata', async () => {
      await expect(
        insertUserMedia(client, {
          userId,
          mediaId,
          status: 'completed',
          thoughts: 'Amazing movie!',
          rating: 5,
          startedAt: null,
          completedAt: new Date(),
        })
      ).resolves.toBeUndefined()
    })

    it('should support all status types without error', async () => {
      const statuses = ['planned', 'in_progress', 'completed', 'dropped'] as const

      for (const status of statuses) {
        const testMediaId = randomUUID()
        await insertMedia(client, {
          id: testMediaId,
          title: `Test ${status}`,
          description: null,
          type: 'movie' as MediaType,
          releaseDate: null,
          coverUrl: null,
        })

        await expect(
          insertUserMedia(client, {
            userId,
            mediaId: testMediaId,
            status,
            thoughts: undefined,
            rating: undefined,
            startedAt: null,
            completedAt: null,
          })
        ).resolves.toBeUndefined()
      }
    })
  })

  describe('listUserLibraryMedia', () => {
    it('should return user library without error', async () => {
      const library = await listUserLibraryMedia(userId, client)
      expect(Array.isArray(library)).toBe(true)
    })

    it('should return empty array for user with no media', async () => {
      const newUser = await ensureDevelopmentUser(client)
      const library = await listUserLibraryMedia(newUser.id, client)
      expect(Array.isArray(library)).toBe(true)
      expect(library.length).toBe(0)
    })
  })
})
