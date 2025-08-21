import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Button } from '../ui/button'

describe('Button Component', () => {
  it('renders with default variant', () => {
    const { container } = render(<Button>Test Button</Button>)
    const button = container.querySelector('button')
    
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Test Button')
  })

  it('renders with primary variant', () => {
    const { container } = render(<Button variant="default">Primary Button</Button>)
    const button = container.querySelector('button')
    
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Primary Button')
  })

  it('can be disabled', () => {
    const { container } = render(<Button disabled>Disabled Button</Button>)
    const button = container.querySelector('button')
    
    expect(button).toBeDisabled()
  })
})