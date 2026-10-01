import { render, screen, fireEvent } from '@testing-library/react'
import UrlEncoderTool from './page'

describe('UrlEncoderTool', () => {
  it('encodes and decodes correctly', () => {
    render(<UrlEncoderTool />)

    // Wait for initial render
    const inputArea = screen.getByPlaceholderText(/Enter text to encode/i)
    fireEvent.change(inputArea, { target: { value: 'hello world' } })

    const encodeBtn = screen.getByRole('button', { name: 'Encode URL' })
    fireEvent.click(encodeBtn)

    // Wait for state update and check output
    const outputAreas = document.querySelectorAll('textarea')
    expect(outputAreas.length).toBe(2)
    expect(outputAreas[1].value).toBe('hello%20world')
  })

  it('displays an error message when decoding malformed URL text', () => {
    render(<UrlEncoderTool />)

    // Switch to decode mode
    const swapBtn = screen.getByRole('button', { name: /Swap/i })
    fireEvent.click(swapBtn)

    // Check we are in decode mode
    expect(screen.getByText('Mode: decode')).toBeInTheDocument()

    // Find input area and set to malformed URL encoding
    const inputArea = screen.getByPlaceholderText(/Enter text to decode/i)
    fireEvent.change(inputArea, { target: { value: '%E0%A4%A' } })

    // Click decode
    const decodeBtn = screen.getByRole('button', { name: 'Decode URL' })
    fireEvent.click(decodeBtn)

    // Error message should appear
    expect(screen.getByText('Invalid input for URL decode')).toBeInTheDocument()
  })
})
