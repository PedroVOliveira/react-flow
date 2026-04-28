'use client'
import { 
  Node, 
  Edge, 
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect, 
  ReactFlow, 
  Background, 
  Controls, 
  Panel, 
  ReactFlowProvider,
  ConnectionMode
} from '@xyflow/react'
import { ReactNode } from 'react'
import { FlowNode, CustomNodeData } from './node'
import { useFlowState } from './use-flow-state'

const nodeTypes = {
  custom: FlowNode,
};

type FlowCanvasProps = {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
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
        connectionMode={ConnectionMode.Loose}
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
  useFlowState,
};
