import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { PoolClient } from 'pg'
import { randomUUID } from 'node:crypto'
import {
  getTestClient,
  truncateTestDatabase,
} from '../../test-db-utils'
import { insertMedia } from '@/infrastructure/persistence/media'
import type { MediaType } from '@/domain/media'

describe('Media Persistence', () => {
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

  describe('insertMedia', () => {
    it('should insert media without error', async () => {
      const mediaId = randomUUID()
      const media = {
        id: mediaId,
        title: 'The Matrix',
        description: 'A sci-fi action film',
        type: 'movie' as MediaType,
        releaseDate: '1999-03-31',
        coverUrl: 'https://example.com/matrix.jpg',
      }

      // Should not throw
      await expect(insertMedia(client, media)).resolves.toBeUndefined()
    })

    it('should insert media with null optional fields', async () => {
      const mediaId = randomUUID()
      const media = {
        id: mediaId,
        title: 'Inception',
        description: null,
        type: 'movie' as MediaType,
        releaseDate: null,
        coverUrl: null,
      }

      // Should not throw
      await expect(insertMedia(client, media)).resolves.toBeUndefined()
    })
  })
})
