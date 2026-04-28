'use client'
import { useMemo } from 'react'
import { Flow } from '@/components/flow'
import { CustomNodeData } from '@/components/flow/node'

export default function Home() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    editNode,
    autoSpawn,
  } = Flow.useFlowState<CustomNodeData>();

  const enrichedNodes = useMemo(() => 
    nodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        onEdit: editNode,
        onDelete: deleteNode,
        onAutoSpawn: autoSpawn
      }
    })), 
  [nodes, editNode, deleteNode, autoSpawn]);

  return (
    <Flow.Root>
      <Flow.Canvas
        nodes={enrichedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Flow.Background />
        <Flow.Controls />
        <Flow.Panel position="bottom-right" className="m-4">
          <button
            data-testid="add-node-btn"
            onClick={() => addNode()}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 font-semibold text-sm shadow-md border border-gray-200 rounded cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Adicionar
          </button>
        </Flow.Panel>
      </Flow.Canvas>
    </Flow.Root>
  );
}
