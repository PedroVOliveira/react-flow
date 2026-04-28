import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

type InlineEditContextType = {
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  value: string;
  setValue: (val: string) => void;
  onSave: (val: string) => void;
  onCancel: () => void;
  initialValue: string;
};

const InlineEditContext = createContext<InlineEditContextType | null>(null);

type InlineEditProps = {
  initialValue: string;
  onSave: (val: string) => void;
  isNew?: boolean;
  isEditingExt?: boolean;
  onEditEnd?: () => void;
  children: ReactNode;
};

export const InlineEdit = ({ initialValue, onSave, isNew = false, isEditingExt, onEditEnd, children }: InlineEditProps) => {
  const [isEditing, setIsEditing] = useState(isNew || !!isEditingExt);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isEditingExt) {
      setIsEditing(true);
      setValue(initialValue);
    }
  }, [isEditingExt, initialValue]);

  useEffect(() => {
    if (!isEditing) {
      setValue(initialValue);
    }
  }, [initialValue, isEditing]);

  const handleSave = (newVal: string) => {
    onSave(newVal);
    setIsEditing(false);
    onEditEnd?.();
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
    onEditEnd?.();
  };

  return (
    <InlineEditContext.Provider value={{
      isEditing,
      setIsEditing,
      value,
      setValue,
      onSave: handleSave,
      onCancel: handleCancel,
      initialValue
    }}>
      <div className="w-full flex flex-col items-center">
        {children}
      </div>
    </InlineEditContext.Provider>
  );
};

const Preview = ({ onDoubleClick, className }: { onDoubleClick?: () => void, className?: string }) => {
  const ctx = useContext(InlineEditContext);
  if (!ctx || ctx.isEditing) return null;

  const displayValue = ctx.value.trim() === '' ? 'Add text...' : ctx.value;
  const isEmpty = ctx.value.trim() === '';

  return (
    <div
      onDoubleClick={(e) => {
        ctx.setIsEditing(true);
        onDoubleClick?.();
      }}
      className={`nodrag cursor-text min-h-[24px] w-full flex items-center justify-center text-center select-none ${isEmpty ? 'text-gray-300 italic' : 'text-gray-800'} ${className || ''}`}
      style={{ textAlign: 'center' }}
    >
      {displayValue}
    </div>
  );
};

const Input = ({ className }: { className?: string }) => {
  const ctx = useContext(InlineEditContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ctx?.isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [ctx?.isEditing]);

  if (!ctx || !ctx.isEditing) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      ctx.onSave(ctx.value);
    }
    if (e.key === 'Escape') {
      ctx.onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      value={ctx.value}
      onChange={(e) => ctx.setValue(e.target.value)}
      onBlur={() => ctx.onSave(ctx.value)}
      onKeyDown={handleKeyDown}
      className={`nodrag bg-transparent outline-none border-none text-center m-0 p-0 shadow-none ring-0 w-full font-semibold ${className || ''}`}
      style={{ textAlign: 'center' }}
    />
  );
};

InlineEdit.Preview = Preview;
InlineEdit.Input = Input;
