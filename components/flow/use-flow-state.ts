'use client'
import { useState, useCallback } from 'react'
import { 
  applyEdgeChanges, 
  applyNodeChanges, 
  addEdge, 
  Node, 
  Edge, 
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect 
} from '@xyflow/react'

export function useFlowState<TData extends { label: string; isNew?: boolean }>(
  initialNodes: Node<TData>[] = [],
  initialEdges: Edge[] = []
) {
  const [nodes, setNodes] = useState<Node<TData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const onNodesChange: OnNodesChange<Node<TData>> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const editNode = useCallback((id: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label: newLabel, isNew: false } } : n
      )
    );
  }, []);

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }, []);

  const addNode = useCallback((position = { x: 100, y: 100 }) => {
    const id = `node-${Date.now()}`;
    const newNode: Node<TData> = {
      id,
      type: 'custom',
      position,
      data: { label: '', isNew: true } as TData,
    };
    setNodes((nds) => [...nds, newNode]);
    return id;
  }, []);

  const autoSpawn = useCallback((sourceId: string, direction: 'top' | 'bottom' | 'left' | 'right') => {
    const sourceNode = nodes.find((n) => n.id === sourceId);
    if (!sourceNode) return null;

    const spacing = 250;
    const xLane = nodes.filter(n => Math.abs(n.position.y - sourceNode.position.y) < 100).map(n => n.position.x);
    const yLane = nodes.filter(n => Math.abs(n.position.x - sourceNode.position.x) < 100).map(n => n.position.y);

    const spawnConfig = {
      top:    { x: sourceNode.position.x, y: Math.min(...yLane, sourceNode.position.y) - spacing, targetHandle: 'bottom' },
      bottom: { x: sourceNode.position.x, y: Math.max(...yLane, sourceNode.position.y) + spacing, targetHandle: 'top' },
      left:   { x: Math.min(...xLane, sourceNode.position.x) - spacing, y: sourceNode.position.y, targetHandle: 'right' },
      right:  { x: Math.max(...xLane, sourceNode.position.x) + spacing, y: sourceNode.position.y, targetHandle: 'left' },
    }[direction];

    const newNodeId = `node-${Date.now()}`;
    const newNode: Node<TData> = {
      id: newNodeId,
      type: 'custom',
      position: { x: spawnConfig.x, y: spawnConfig.y },
      data: { label: '', isNew: true } as TData,
    };

    const newEdge: Edge = {
      id: `e-${sourceId}-${newNodeId}`,
      source: sourceId,
      target: newNodeId,
      sourceHandle: direction,
      targetHandle: spawnConfig.targetHandle,
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    
    return newNodeId;
  }, [nodes]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    editNode,
    autoSpawn,
  };
}
