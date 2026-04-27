'use client'
import { useState, useCallback } from 'react'
import { applyEdgeChanges, applyNodeChanges, addEdge, Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react'
import FlowComponent from '@/components/react-flow'

const initialNodes: Node[] = [
  { id: 'n1', position: { x: 0, y: 50 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 480, y: 50 }, data: { label: 'Node 2' } },
  { id: 'n3', position: { x: 100, y: 100 }, data: { label: 'Node 3' } },
];
const initialEdges: Edge[] = [{ id: 'n1-n2', source: 'n1', target: 'n2' }, { id: 'n1-n3', source: 'n1', target: 'n3' }];

export default function Home() {

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
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

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <FlowComponent
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  );
}
