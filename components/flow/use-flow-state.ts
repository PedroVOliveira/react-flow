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

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges<Node<TData>>(changes as any, nds)),
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
      data: { 
        label: '', 
        isNew: true,
      } as TData,
    };
    setNodes((nds) => [...nds, newNode]);
    return id;
  }, []);

  const autoSpawn = useCallback((sourceId: string, direction: 'top' | 'bottom' | 'left' | 'right') => {
    const sourceNode = nodes.find((n) => n.id === sourceId);
    if (!sourceNode) return;

    const spacing = 250;
    const existingEdgesCount = edges.filter(
      (e) => e.source === sourceId && e.sourceHandle === direction
    ).length;

    const offsetMultiplier = Math.ceil(existingEdgesCount / 2);
    const offsetDirection = existingEdgesCount % 2 === 0 ? 1 : -1;
    const offsetValue = offsetMultiplier * 200 * offsetDirection;

    const positionMap = {
      top: { x: sourceNode.position.x + offsetValue, y: sourceNode.position.y - spacing },
      bottom: { x: sourceNode.position.x + offsetValue, y: sourceNode.position.y + spacing },
      left: { x: sourceNode.position.x - spacing, y: sourceNode.position.y + offsetValue },
      right: { x: sourceNode.position.x + spacing, y: sourceNode.position.y + offsetValue },
    };

    const newNodeId = `node-${Date.now()}`;
    const newNode: Node<TData> = {
      id: newNodeId,
      type: 'custom',
      position: positionMap[direction],
      data: { 
        label: '', 
        isNew: true,
      } as TData,
    };

    const targetHandleMap = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    };

    const newEdge: Edge = {
      id: `e-${sourceId}-${newNodeId}`,
      source: sourceId,
      target: newNodeId,
      sourceHandle: direction,
      targetHandle: targetHandleMap[direction],
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  }, [nodes, edges]);

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    editNode,
    autoSpawn,
  };
}
