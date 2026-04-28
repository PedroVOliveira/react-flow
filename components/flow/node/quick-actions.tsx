'use client'
import { useNodeContext } from './context';

export const QuickActions = () => {
  const { id, data, setHoveredDir } = useNodeContext();

  const directions: ('top' | 'bottom' | 'left' | 'right')[] = ['top', 'bottom', 'left', 'right'];
  const positions = {
    top: '-top-8 left-1/2 -translate-x-1/2',
    bottom: '-bottom-8 left-1/2 -translate-x-1/2',
    left: '-left-8 top-1/2 -translate-y-1/2',
    right: '-right-8 top-1/2 -translate-y-1/2',
  };

  return (
    <>
      {directions.map((dir) => (
        <button
          key={dir}
          data-testid={`quick-add-${dir}`}
          onClick={(e) => { e.stopPropagation(); data.onAutoSpawn?.(id, dir); }}
          onMouseEnter={() => setHoveredDir(dir)}
          onMouseLeave={() => setHoveredDir(null)}
          className={`
            absolute ${positions[dir]} z-50
            w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center
            shadow-lg hover:bg-blue-600 hover:scale-110 transition-all duration-200
            opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      ))}
    </>
  );
};
