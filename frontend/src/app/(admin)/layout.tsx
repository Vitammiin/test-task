import React from 'react';
import NavBar from '@/app/components/NavBar';

export interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-12">
      <NavBar />
      <div>{children}</div>
    </div>
  );
}
