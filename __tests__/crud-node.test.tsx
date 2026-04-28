import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import React, { useState } from 'react'
import { ReactFlow, ReactFlowProvider, Node, Edge } from '@xyflow/react'
import Home from '../app/page'
import { FlowNode as CustomNode } from '../components/flow/node'

// Mocking nodeTypes for the computing test
const nodeTypes = { custom: CustomNode }

const ComputingTestFlow = () => {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 'node-1',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: { label: 'Source Node', isNew: false }
    },
    {
      id: 'node-2',
      type: 'custom',
      position: { x: 0, y: 200 },
      data: { label: 'Target Node', isNew: false }
    }
  ])

  const [edges] = useState<Edge[]>([
    { id: 'e1-2', source: 'node-1', target: 'node-2' }
  ])

  return (
    <div style={{ width: 800, height: 600 }}>
      {/* ReactFlowProvider is required for useNodeConnections / useNodesData */}
      <ReactFlowProvider>
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} />
      </ReactFlowProvider>
    </div>
  )
}

describe('React Flow - Comprehensive Node Operations', () => {

  it('Should perform Add, Edit and Delete operations successfully', async () => {
    render(<Home />)
    
    // Check initial absence
    expect(screen.queryByTestId('flow-node')).not.toBeInTheDocument()

    // Add Node
    const addButton = screen.getByTestId('add-node-btn')
    fireEvent.click(addButton)
    
    // Wait for the node to appear
    const node = await screen.findByTestId('flow-node')
    expect(node).toBeInTheDocument()

    // It should be in edit mode (textbox exists)
    const inputField = screen.getByRole('textbox')
    expect(inputField).toBeInTheDocument()

    // Save
    fireEvent.change(inputField, { target: { value: 'Test Node' } })
    fireEvent.blur(inputField)

    // Wait for text to update in preview mode
    await waitFor(() => {
        expect(screen.getByText('Test Node')).toBeInTheDocument()
    })

    // Delete
    fireEvent.click(node) // Select to show toolbar
    const deleteBtn = await screen.findByTestId('delete-node-btn')
    fireEvent.click(deleteBtn)

    // Verify deletion
    await waitFor(() => {
        expect(screen.queryByTestId('flow-node')).not.toBeInTheDocument()
    })
  })

  it('Should display upstream data in the downstream node (Computing Flows)', async () => {
    render(<ComputingTestFlow />)

    // Wait for React Flow to process connections and hooks
    await waitFor(() => {
        // The Target Node should show "Source Node" in its Inputs section
        // We expect two occurrences: Node-1 label and Node-2 input-badge
        const elements = screen.getAllByText('Source Node')
        expect(elements.length).toBe(2)
    }, { timeout: 2000 })
    
    expect(screen.getByText('Inputs')).toBeInTheDocument()
  })
})
