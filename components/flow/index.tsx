'use client'
import { ReactFlow, Background, Controls, Panel, ReactFlowProvider } from '@xyflow/react'
import { ReactNode } from 'react'
import { FlowNode } from './node'

const nodeTypes = {
  custom: FlowNode,
};

type FlowCanvasProps = {
  nodes: any[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  children?: ReactNode;
};

const FlowCanvas = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect, children }: FlowCanvasProps) => {
  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        {children}
      </ReactFlow>
    </div>
  );
};

export const Flow = {
  Root: ReactFlowProvider,
  Canvas: FlowCanvas,
  Background,
  Controls,
  Panel,
};
