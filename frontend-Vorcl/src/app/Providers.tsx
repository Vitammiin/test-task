'use client';

import { ToastContainer, Slide } from 'react-toastify';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer autoClose={2000} transition={Slide} />
    </>
  );
}
