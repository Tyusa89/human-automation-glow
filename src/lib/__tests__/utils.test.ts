import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('combines class names correctly', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('handles conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden')
      expect(result).toBe('base conditional')
    })

    it('handles empty inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('handles undefined and null values', () => {
      const result = cn('base', undefined, null, 'end')
      expect(result).toBe('base end')
    })
  })
})