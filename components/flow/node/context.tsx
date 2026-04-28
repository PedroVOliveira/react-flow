'use client'
import { createContext, useContext } from 'react';

export type CustomNodeData = {
  label: string;
  isNew?: boolean;
  onEdit?: (id: string, newLabel: string) => void;
  onDelete?: (id: string) => void;
  onAutoSpawn?: (id: string, direction: 'top' | 'bottom' | 'left' | 'right') => void;
};

export type NodeContextType = {
  id: string;
  data: CustomNodeData;
  selected: boolean;
  hoveredDir: string | null;
  setHoveredDir: (dir: string | null) => void;
  isEditingExt: boolean;
  setIsEditingExt: (val: boolean) => void;
};

export const NodeContext = createContext<NodeContextType | null>(null);

export const useNodeContext = () => {
  const ctx = useContext(NodeContext);
  if (!ctx) throw new Error('useNodeContext must be used within FlowNode');
  return ctx;
};
