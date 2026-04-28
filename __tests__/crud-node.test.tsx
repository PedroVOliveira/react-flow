import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import Home from '../app/page'

describe('React Flow - Isolated CRUD Operations', () => {

  it('Should create a new node when clicking Adicionar button', async () => {
    render(<Home />)
    
    expect(screen.queryByTestId('flow-node')).not.toBeInTheDocument()

    const addButton = screen.getByTestId('add-node-btn')
    fireEvent.click(addButton)
    
    const node = await screen.findByTestId('flow-node')
    expect(node).toBeInTheDocument()
    expect(screen.getByTestId('inline-edit-input')).toBeInTheDocument()
  })

  it('Should update node label correctly', async () => {
    render(<Home />)
    
    fireEvent.click(screen.getByTestId('add-node-btn'))
    const inputField = await screen.findByTestId('inline-edit-input')

    fireEvent.change(inputField, { target: { value: 'Refactored Label' } })
    fireEvent.blur(inputField)

    await waitFor(() => {
        expect(screen.getByTestId('inline-edit-preview')).toHaveTextContent('Refactored Label')
    })
  })

  it('Should remove node when clicking delete button', async () => {
    render(<Home />)
    
    fireEvent.click(screen.getByTestId('add-node-btn'))
    const node = await screen.findByTestId('flow-node')

    fireEvent.click(node) 
    const deleteBtn = await screen.findByTestId('delete-node-btn')
    fireEvent.click(deleteBtn)

    await waitFor(() => {
        expect(screen.queryByTestId('flow-node')).not.toBeInTheDocument()
    })
  })

  it('Should spawn a new connected node in a direction on click', async () => {
    render(<Home />)
    
    fireEvent.click(screen.getByTestId('add-node-btn'))
    const node = await screen.findByTestId('flow-node')
    
    fireEvent.click(node);
    const quickAddRight = await screen.findByTestId('quick-add-right');
    fireEvent.click(quickAddRight);

    await waitFor(() => {
        const nodes = screen.getAllByTestId('flow-node');
        expect(nodes.length).toBe(2);
    });
  })
})
