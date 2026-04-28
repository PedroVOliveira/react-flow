'use client'
import { NodeToolbar, Position } from '@xyflow/react';
import { useNodeContext } from './context';

export const Toolbar = () => {
  const { selected, data, id, setIsEditingExt } = useNodeContext();
  
  return (
    <NodeToolbar isVisible={selected} position={Position.Top}>
      <div className="flex gap-2 bg-white shadow-lg border border-gray-100 p-1.5 rounded-lg mb-6">
        <button
          data-testid="edit-node-btn"
          onClick={() => setIsEditingExt(true)}
          className="p-1 px-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
        >
          ✏️
        </button>
        <button
          data-testid="delete-node-btn"
          onClick={() => data.onDelete?.(id)}
          className="p-1 px-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded transition-colors"
        >
          🗑️
        </button>
      </div>
    </NodeToolbar>
  );
};
