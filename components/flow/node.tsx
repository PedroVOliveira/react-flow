import React, { useState } from 'react';
import { Handle, Position, NodeToolbar, useNodeConnections, useNodesData, Node, NodeProps } from '@xyflow/react';
import { InlineEdit } from './inline-edit';

export type CustomNodeData = {
  label: string;
  isNew?: boolean;
  onEdit?: (id: string, newLabel: string) => void;
  onDelete?: (id: string) => void;
};

export const FlowNode = ({ id, data, selected }: NodeProps<Node<CustomNodeData>>) => {
  const [isEditingExt, setIsEditingExt] = useState(false);

  const connections = useNodeConnections({
    handleType: 'target',
  });

  const nodesData = useNodesData<Node<CustomNodeData>>(connections.map((c) => c.source));

  return (
    <>
      <NodeToolbar isVisible={selected} position={Position.Top}>
        <div className="flex gap-2 bg-white shadow-md border border-gray-200 p-1.5 rounded-md">
          <button
            data-testid="edit-node-btn"
            onClick={() => setIsEditingExt(true)}
            className="px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            ✏️ Edit
          </button>
          <button
            data-testid="delete-node-btn"
            onClick={() => data.onDelete && data.onDelete(id)}
            className="px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
      </NodeToolbar>
      <div
        data-testid="flow-node"
        className={`px-4 py-2 shadow-md rounded-md bg-white border ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
      >
        <Handle type="target" position={Position.Top} className="bg-gray-400" />

        <InlineEdit
          initialValue={data.label}
          onSave={(newVal: string) => data.onEdit && data.onEdit(id, newVal)}
          isNew={data.isNew}
          isEditingExt={isEditingExt}
          onEditEnd={() => setIsEditingExt(false)}
        >
          <InlineEdit.Preview className="font-semibold text-gray-800 text-sm" />
          <InlineEdit.Input className="font-semibold text-gray-800 text-sm" />
        </InlineEdit>

        {nodesData.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mb-1">Inputs</p>
            <div className="flex flex-col gap-1">
              {nodesData.map((upstreamData, index) => (
                <div key={index} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded truncate max-w-[120px]">
                  {upstreamData?.data?.label || 'Empty'}
                </div>
              ))}
            </div>
          </div>
        )}

        <Handle type="source" position={Position.Bottom} className="bg-gray-400" />
      </div>
    </>
  );
};
