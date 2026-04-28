'use client'
import { useNodeContext } from './context';

export const GhostPreview = () => {
  const { hoveredDir } = useNodeContext();
  if (!hoveredDir) return null;

  const offset = 250;
  return (
    <div
      className="absolute pointer-events-none border-2 border-dashed border-blue-300 bg-blue-50/20 rounded-sm animate-pulse"
      style={{
        width: 160,
        height: 160,
        transform: `translate(${
          hoveredDir === 'left' ? `-${offset}px` : hoveredDir === 'right' ? `${offset}px` : '0'
        }, ${
          hoveredDir === 'top' ? `-${offset}px` : hoveredDir === 'bottom' ? `${offset}px` : '0'
        })`
      }}
    />
  );
};
