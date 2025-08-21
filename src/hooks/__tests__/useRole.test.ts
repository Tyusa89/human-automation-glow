import { describe, it, expect } from 'vitest'
import { isAdminLike } from '../useRole'

describe('useRole', () => {
  describe('isAdminLike', () => {
    it('returns true for owner role', () => {
      expect(isAdminLike('owner')).toBe(true)
    })

    it('returns true for admin role', () => {
      expect(isAdminLike('admin')).toBe(true)
    })

    it('returns false for user role', () => {
      expect(isAdminLike('user')).toBe(false)
    })

    it('returns false for null role', () => {
      expect(isAdminLike(null)).toBe(false)
    })
  })
})