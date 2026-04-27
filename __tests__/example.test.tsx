import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
// If you want to test the primary page directly:
// import Page from '../app/page'

describe('Basic Test', () => {
  it('Should run a generic math assertion successfully', () => {
    expect(1 + 1).toBe(2)
  })

  // Exemplo de como testar renderização depois:
  // it('renders the page without crashing', () => {
  //   render(<Page />)
  //   expect(screen.getByRole('heading')).toBeInTheDocument()
  // })
})
