'use client'
import { useState, useCallback } from 'react'
import { applyEdgeChanges, applyNodeChanges, addEdge, Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react'
import { Flow } from '@/components/flow'
import { CustomNodeData } from '@/components/flow/node'

const initialNodes: Node<CustomNodeData>[] = [];
const initialEdges: Edge[] = [];

export default function Home() {

  const [nodes, setNodes] = useState<Node<CustomNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges<Node<CustomNodeData>>(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const handleDeleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
  }, []);

  const handleEditNode = useCallback((id: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label: newLabel, isNew: false } } : n
      )
    );
  }, []);

  const handleAddNode = useCallback(() => {
    const newNode: Node<CustomNodeData> = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { 
        x: Math.random() * 200 + 100, 
        y: Math.random() * 200 + 100 
      },
      data: { 
        label: '', 
        isNew: true, 
        onEdit: handleEditNode,
        onDelete: handleDeleteNode
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [handleEditNode, handleDeleteNode]);

  return (
    <Flow.Root>
      <Flow.Canvas
        nodes={nodes}
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
            onClick={handleAddNode}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 font-semibold text-sm shadow-md border border-gray-200 rounded cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add
          </button>
        </Flow.Panel>
      </Flow.Canvas>
    </Flow.Root>
  );
}
