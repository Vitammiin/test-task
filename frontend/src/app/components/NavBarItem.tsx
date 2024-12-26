import React from 'react';
import Link from 'next/link';

export interface NavBarItemProps {
  pathname: string;
  children: React.ReactNode;
}

export default function NavBarItem({ pathname, children }: NavBarItemProps) {
  return (
    <li>
      <Link href={pathname} className="flex items-center h-9 mx-1 gap-4">
        <span className="text-sky-200 hover:bg-purple-800 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">
          {children}
        </span>
      </Link>
    </li>
  );
}
