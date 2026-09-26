import { describe, it, expect } from 'vitest'
import { validateMediaDraft } from '@/domain/media'

describe('validateMediaDraft', () => {
  it('should accept valid media draft', () => {
    const errors = validateMediaDraft({
      title: 'Test Movie',
      type: 'movie',
    })
    expect(errors).toEqual({})
  })

  it('should reject empty title', () => {
    const errors = validateMediaDraft({
      title: '',
      type: 'movie',
    })
    expect(errors.title).toBeDefined()
  })

  it('should reject missing type', () => {
    const errors = validateMediaDraft({
      title: 'Test',
      type: '',
    })
    expect(errors.type).toBeDefined()
  })

  it('should reject invalid rating', () => {
    const errors = validateMediaDraft({
      title: 'Test',
      type: 'movie',
      rating: 10,
    })
    expect(errors.rating).toBeDefined()
  })

  it('should accept valid rating 0-5', () => {
    for (let rating = 0; rating <= 5; rating++) {
      const errors = validateMediaDraft({
        title: 'Test',
        type: 'movie',
        rating,
      })
      expect(errors.rating).toBeUndefined()
    }
  })
})
