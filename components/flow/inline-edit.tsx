'use client';

import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  KeyboardEvent,
  ReactNode,
} from 'react';

type InlineEditContextType = {
  isEditing: boolean;
  value: string;
  setValue: (val: string) => void;
  startEditing: () => void;
  stopEditing: () => void;
  save: () => void;
};

const InlineEditContext = createContext<InlineEditContextType | null>(null);

const useInlineEdit = () => {
  const ctx = useContext(InlineEditContext);
  if (!ctx) throw new Error('InlineEdit sub-components must be used within <InlineEdit />');
  return ctx;
};

type InlineEditProps = {
  initialValue: string;
  onSave: (value: string) => void;
  isNew?: boolean;
  isEditingExt?: boolean;
  onEditEnd?: () => void;
  children: ReactNode;
};

export const InlineEdit = ({
  initialValue,
  onSave,
  isNew,
  isEditingExt,
  onEditEnd,
  children,
}: InlineEditProps) => {
  const [isEditing, setIsEditing] = useState(!!isNew || !!isEditingExt);
  const [value, setValue] = useState(initialValue);

  // Sync with external triggers (isNew or Toolbar click)
  useEffect(() => {
    if (isNew || isEditingExt) {
      setIsEditing(true);
    }
  }, [isNew, isEditingExt]);

  const save = () => {
    onSave(value);
    setIsEditing(false);
    onEditEnd?.();
  };

  const stopEditing = () => {
    setValue(initialValue); // Reset on cancel
    setIsEditing(false);
    onEditEnd?.();
  };

  return (
    <InlineEditContext.Provider
      value={{
        isEditing,
        value,
        setValue,
        startEditing: () => setIsEditing(true),
        stopEditing,
        save,
      }}
    >
      <div className="w-full h-full flex items-center justify-center cursor-text nodrag">
        {children}
      </div>
    </InlineEditContext.Provider>
  );
};

const Preview = ({ className = '' }: { className?: string }) => {
  const { isEditing, value, startEditing } = useInlineEdit();
  if (isEditing) return null;

  return (
    <div
      data-testid="inline-edit-preview"
      onClick={startEditing}
      className={`min-w-[20px] min-h-[1em] text-center break-words select-none ${className}`}
    >
      {value || 'Add text...'}
    </div>
  );
};

const Input = ({ className = '' }: { className?: string }) => {
  const { isEditing, value, setValue, save, stopEditing } = useInlineEdit();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  if (!isEditing) return null;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      save();
    }
    if (e.key === 'Escape') {
      stopEditing();
    }
  };

  return (
    <textarea
      data-testid="inline-edit-input"
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={save}
      onKeyDown={handleKeyDown}
      rows={1}
      className={`
        w-full bg-transparent border-none outline-none resize-none
        text-center overflow-hidden p-0 m-0 leading-relaxed
        focus:ring-0 placeholder:text-gray-400/50
        ${className}
      `}
      placeholder="Type something..."
    />
  );
};

InlineEdit.Preview = Preview;
InlineEdit.Input = Input;
