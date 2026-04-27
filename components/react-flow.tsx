'use client'
import { useState, useCallback } from 'react'
import { ReactFlow, Background, Controls, applyEdgeChanges, applyNodeChanges, addEdge, Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from '@xyflow/react'

const initialNodes: Node[] = [
  { id: 'n1', position: { x: 0, y: 50 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 480, y: 50 }, data: { label: 'Node 2' } },
  { id: 'n3', position: { x: 100, y: 100 }, data: { label: 'Node 3' } },
];
const initialEdges: Edge[] = [{ id: 'n1-n2', source: 'n1', target: 'n2' }, { id: 'n1-n3', source: 'n1', target: 'n3' }];


export type FlowTypes = {
  nodes: Node[],
  edges: Edge[],
  onNodesChange: OnNodesChange,
  onEdgesChange: OnEdgesChange,
  onConnect: OnConnect
}

const FlowComponent = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect }: FlowTypes) => {

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default FlowComponent;