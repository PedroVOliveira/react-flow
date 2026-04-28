'use client'
import { InlineEdit } from '../inline-edit';
import { useNodeContext } from './context';

export const Content = () => {
  const { data, id, isEditingExt, setIsEditingExt } = useNodeContext();
  
  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <InlineEdit
        initialValue={data.label}
        onSave={(val) => data.onEdit?.(id, val)}
        isNew={data.isNew}
        isEditingExt={isEditingExt}
        onEditEnd={() => setIsEditingExt(false)}
      >
        <InlineEdit.Preview className="font-semibold text-gray-700 text-sm leading-relaxed" />
        <InlineEdit.Input className="font-semibold text-gray-700 text-sm" />
      </InlineEdit>
    </div>
  );
};
