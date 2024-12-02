import { ReactNode } from 'react';

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 md:px-8 xl:px-20">{children}</div>
  );
}
