'use client'
import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type DefaultEdgeOptions,
  Background,
  Controls,
  Panel,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider,
  ConnectionMode,
} from '@xyflow/react';

const initialNodes: Node[] = [
  { id: '1', type: 'textUpdater', data: { label: 'Início' }, position: { x: 250, y: 250 } },
];

const initialEdges: Edge[] = [];
const fitViewOptions: FitViewOptions = { padding: 0.2 };
const defaultEdgeOptions: DefaultEdgeOptions = { animated: true, style: { strokeWidth: 2 } };

const CustomNode = ({ data, id, selected }: any) => {
  const { setNodes } = useReactFlow();

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, label: value } };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  return (
    <div className={`transition-all duration-200 ${selected ? 'ring-2 ring-blue-500 ring-offset-4 rounded-sm' : ''}`}>
      <div className="bg-white border border-gray-200 rounded-sm py-2 px-4 shadow-sm flex flex-col items-center min-w-[150px] hover:border-gray-300">
        <Handle type="target" position={Position.Top} id="t-t" className="!bg-gray-400 !w-1.5 !h-1.5" />
        <Handle type="source" position={Position.Top} id="t-s" className="!bg-gray-400 !w-1.5 !h-1.5" />
        <Handle type="target" position={Position.Bottom} id="b-t" className="!bg-gray-400 !w-1.5 !h-1.5" />
        <Handle type="source" position={Position.Bottom} id="b-s" className="!bg-gray-400 !w-1.5 !h-1.5" />
        <Handle type="target" position={Position.Left} id="l-t" className="!bg-gray-400 !w-1.5 !h-1.5" />
        <Handle type="source" position={Position.Left} id="l-s" className="!bg-gray-400 !w-1.5 !h-1.5" />
        <Handle type="target" position={Position.Right} id="r-t" className="!bg-gray-400 !w-1.5 !h-1.5" />
        <Handle type="source" position={Position.Right} id="r-s" className="!bg-gray-400 !w-1.5 !h-1.5" />
        <div className="w-full">
          <input
            defaultValue={data.label}
            onChange={onChange}
            className="nodrag w-full bg-transparent border-none outline-none text-center text-xs font-medium text-gray-800 focus:ring-0"
          />
        </div>
      </div>
    </div>
  );
};

function FlowInner() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [showMenu, setShowMenu] = useState(false);

  const nodeTypes = useMemo(() => ({
    textUpdater: CustomNode,
  }), []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const { fitView } = useReactFlow();

  const onAddNode = useCallback((direction: 'top' | 'bottom' | 'left' | 'right') => {

    const selectedNode = nodes.find((n) => n.selected);
    const baseNode = selectedNode || nodes[nodes.length - 1];

    if (!baseNode) return;


    const nextId = `node_${Date.now()}`;
    const OFFSET = 250;

    const configs = {
      top: { x: 0, y: -OFFSET, source: 't-s', target: 'b-t' },
      bottom: { x: 0, y: OFFSET, source: 'b-s', target: 't-t' },
      left: { x: -OFFSET, y: 0, source: 'l-s', target: 'r-t' },
      right: { x: OFFSET, y: 0, source: 'r-s', target: 'l-t' },
    };

    const config = configs[direction];
    
    // REGRA DE OURO: Detecção de Colisão (Smart Placement)
    let finalX = baseNode.position.x + config.x;
    let finalY = baseNode.position.y + config.y;

    const isOccupied = (x: number, y: number) => 
      nodes.some(n => Math.abs(n.position.x - x) < 180 && Math.abs(n.position.y - y) < 100);

    // Se a posição estiver ocupada, o sistema "procura" o próximo espaço livre
    let attempts = 0;
    while (isOccupied(finalX, finalY) && attempts < 10) {
      if (direction === 'left' || direction === 'right') {
        finalY += 120; // Se estiver indo pros lados, desvia pra baixo
      } else {
        finalX += 200; // Se estiver indo pra cima/baixo, desvia pro lado
      }
      attempts++;
    }

    const newNode: Node = {
      id: nextId,
      type: 'textUpdater',
      data: { label: `Novo Nó` },
      position: { x: finalX, y: finalY },
    };

    const newEdge: Edge = {
      id: `e-${baseNode.id}-${nextId}`,
      source: baseNode.id,
      target: nextId,
      sourceHandle: config.source,
      targetHandle: config.target,
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    setShowMenu(false);

    window.requestAnimationFrame(() => {
      fitView({ nodes: [{ id: nextId }], duration: 800 });
    });
  }, [nodes, fitView, setNodes, setEdges]);

  return (
    <div className='w-full h-screen'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <Background />
        <Controls />
        <Panel position="bottom-right" className="p-4 flex flex-col items-end gap-2">
          {showMenu && (
            <div className="bg-white p-3 rounded-xl shadow-2xl border border-gray-100 flex flex-col gap-2 mb-2 min-w-[140px] animate-in fade-in zoom-in-95 duration-200">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">Direção</p>
              <div className="grid grid-cols-1 gap-1">
                <button onClick={() => onAddNode('top')} className="flex items-center justify-between px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 font-medium transition-all">Para Cima <span className="opacity-50">↑</span></button>
                <button onClick={() => onAddNode('bottom')} className="flex items-center justify-between px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 font-medium transition-all">Para Baixo <span className="opacity-50">↓</span></button>
                <button onClick={() => onAddNode('left')} className="flex items-center justify-between px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 font-medium transition-all">Esquerda <span className="opacity-50">←</span></button>
                <button onClick={() => onAddNode('right')} className="flex items-center justify-between px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-600 font-medium transition-all">Direita <span className="opacity-50">→</span></button>
              </div>
            </div>
          )}
          <button
            className={`px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg flex items-center gap-2 ${showMenu ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5'}`}
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? (
              <span>Fechar</span>
            ) : (
              <>
                <span className="text-lg">+</span>
                <span>Adicionar</span>
              </>
            )}
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function Flow() {
  return (
    <ReactFlowProvider>
      <FlowInner />
    </ReactFlowProvider>
  );
}