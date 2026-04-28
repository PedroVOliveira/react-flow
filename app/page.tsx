'use client'
import { useMemo, useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'
import { Flow } from '@/components/flow'
import { CustomNodeData } from '@/components/flow/node'

function FlowContainer() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    editNode,
    autoSpawn,
  } = Flow.useFlowState<CustomNodeData>();

  const { fitView } = useReactFlow();

  // Função auxiliar para adicionar e focar
  const handleAddNode = useCallback(() => {
    const id = addNode();
    window.requestAnimationFrame(() => {
      fitView({ nodes: [{ id }], duration: 800, padding: 0.2 });
    });
  }, [addNode, fitView]);

  // Função auxiliar para ramificar e focar
  const handleAutoSpawn = useCallback((sourceId: string, direction: 'top' | 'bottom' | 'left' | 'right') => {
    const id = autoSpawn(sourceId, direction);
    if (id) {
      window.requestAnimationFrame(() => {
        fitView({ nodes: [{ id }], duration: 800, padding: 0.2 });
      });
    }
  }, [autoSpawn, fitView]);

  const enrichedNodes = useMemo(() => 
    nodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        onEdit: editNode,
        onDelete: deleteNode,
        onAutoSpawn: handleAutoSpawn // Usando a versão com fitView
      }
    })), 
  [nodes, editNode, deleteNode, handleAutoSpawn]);

  return (
    <Flow.Canvas
      nodes={enrichedNodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <Flow.Background />
      <Flow.Controls />
      <Flow.Panel position="bottom-right" className="m-4">
        <button
          data-testid="add-node-btn"
          onClick={handleAddNode}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm shadow-lg rounded-full cursor-pointer hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <span className="text-lg">+</span>
          Adicionar Novo Nó
        </button>
      </Flow.Panel>
    </Flow.Canvas>
  );
}

export default function Home() {
  return (
    <Flow.Root>
      <FlowContainer />
    </Flow.Root>
  );
}
