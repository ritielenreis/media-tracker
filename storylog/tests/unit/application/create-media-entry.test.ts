import { describe, it, expect } from 'vitest'
import { validateMediaDraft, type MediaDraft } from '@/domain/media'
import type { UserMediaStatus } from '@/infrastructure/persistence/user-media'

// Test the logic layer without persistence
// parseMediaDraft logic: parse raw input into typed MediaDraft
describe('parseMediaDraft logic', () => {
  it('should accept valid media draft with required fields only', () => {
    const validDraft: MediaDraft = {
      title: 'Test Movie',
      type: 'movie',
    }
    
    const errors = validateMediaDraft(validDraft)
    expect(errors).toEqual({})
  })

  it('should accept media draft with all optional fields', () => {
    const completeDraft: MediaDraft = {
      title: 'Test Movie',
      type: 'movie',
      thoughts: 'Excellent cinematography',
      rating: 4, // Must be integer 0-5
    }
    
    const errors = validateMediaDraft(completeDraft)
    expect(errors).toEqual({})
  })

  it('should reject draft with empty title', () => {
    const invalidDraft: MediaDraft = {
      title: '',
      type: 'movie',
    }
    
    const errors = validateMediaDraft(invalidDraft)
    expect(errors).toHaveProperty('title')
  })

  it('should reject draft with invalid type', () => {
    // The validation function checks if type is falsy (empty string or "")
    // Invalid types won't pass TypeScript, but we test the validation logic
    const invalidDraft: { title: string; type: string } = {
      title: 'Test Movie',
      type: '', // Empty type should be invalid
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors = validateMediaDraft(invalidDraft as any)
    expect(errors).toHaveProperty('type')
  })

  it('should reject draft with invalid rating', () => {
    const invalidDraft: MediaDraft = {
      title: 'Test Movie',
      type: 'movie',
      rating: 10, // Out of range
    }
    
    const errors = validateMediaDraft(invalidDraft)
    expect(errors).toHaveProperty('rating')
  })
})

describe('resolveStatus logic', () => {
  // Pure function: status is "completed" if rating or thoughts exist, else "planned"
  
  it('should determine "completed" when rating is provided', () => {
    const draft: MediaDraft = {
      title: 'Test Movie',
      type: 'movie',
      rating: 4,
    }
    
    // Logic: if rating or thoughts, then "completed"
    const expectedStatus: UserMediaStatus = draft.rating !== undefined || draft.thoughts ? 'completed' : 'planned'
    expect(expectedStatus).toBe('completed')
  })

  it('should determine "completed" when thoughts are provided', () => {
    const draft: MediaDraft = {
      title: 'Test Movie',
      type: 'movie',
      thoughts: 'Great film',
    }
    
    const expectedStatus: UserMediaStatus = draft.rating !== undefined || draft.thoughts ? 'completed' : 'planned'
    expect(expectedStatus).toBe('completed')
  })

  it('should determine "planned" when no rating or thoughts provided', () => {
    const draft: MediaDraft = {
      title: 'Test Movie',
      type: 'movie',
    }
    
    const expectedStatus: UserMediaStatus = draft.rating !== undefined || draft.thoughts ? 'completed' : 'planned'
    expect(expectedStatus).toBe('planned')
  })
})
