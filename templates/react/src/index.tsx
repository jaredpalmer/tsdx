import type { ReactNode } from 'react';

export interface ThingProps {
  children?: ReactNode;
}

export const Thing = ({ children }: ThingProps) => {
  return (
    <div>
      {children ?? 'the snozzberries taste like snozzberries'}
    </div>
  );
};
