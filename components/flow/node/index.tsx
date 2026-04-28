'use client'
import React, { useState, ReactNode } from 'react';
import { Handle, Position, Node, NodeProps } from '@xyflow/react';
import { NodeContext, CustomNodeData } from './context';
import { Toolbar } from './toolbar';
import { QuickActions } from './quick-actions';
import { GhostPreview } from './ghost-preview';
import { Content } from './content';

export const FlowNode = ({ id, data, selected }: NodeProps<Node<CustomNodeData>>) => {
  const [hoveredDir, setHoveredDir] = useState<string | null>(null);
  const [isEditingExt, setIsEditingExt] = useState(false);

  return (
    <NodeContext.Provider value={{ id, data, selected, hoveredDir, setHoveredDir, isEditingExt, setIsEditingExt }}>
      <div className="group relative">
        <Toolbar />
        <Container>
          <QuickActions />
          <GhostPreview />
          <Content />
        </Container>
      </div>
    </NodeContext.Provider>
  );
};

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div
      data-testid="flow-node"
      className={`
        w-40 h-40 p-4 shadow-xl flex flex-col items-center justify-center relative transition-all duration-200
        group-hover:shadow-2xl bg-[#fff9c4] rounded-sm border border-yellow-200
      `}
    >
      <Handle id="top" type="source" position={Position.Top} className="w-2 h-2 !bg-gray-400 border-2 border-white" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-400 border-2 border-white" />
      <Handle id="left" type="source" position={Position.Left} className="w-2 h-2 !bg-gray-400 border-2 border-white" />
      <Handle id="right" type="source" position={Position.Right} className="w-2 h-2 !bg-gray-400 border-2 border-white" />
      {children}
    </div>
  );
};

FlowNode.Container = Container;
FlowNode.Toolbar = Toolbar;
FlowNode.QuickActions = QuickActions;
FlowNode.GhostPreview = GhostPreview;
FlowNode.Content = Content;

export { type CustomNodeData };
