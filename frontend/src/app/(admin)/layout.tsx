import React from 'react';
// import NavBar from '@/app/components/NavBar';

export interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      {/* <NavBar /> */}
      <div className="ml-60">{children}</div>
    </>
  );
}
