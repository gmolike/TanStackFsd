import React, { createContext, useContext } from 'react';

type LabelContextType = {
  labels: Record<string, string>;
  getLabel: (key: string) => string;
};

const LabelContext = createContext<LabelContextType | null>(null);

export function LabelProvider({
  children,
  labels,
}: {
  children: React.ReactNode;
  labels: Record<string, string>;
}) {
  const getLabel = (key: string) => labels[key] || key;

  return <LabelContext.Provider value={{ labels, getLabel }}>{children}</LabelContext.Provider>;
}

export function useLabel(key: string): string {
  const context = useContext(LabelContext);
  if (!context) {
    throw new Error('useLabel must be used within LabelProvider');
  }
  return context.getLabel(key);
}
