"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Tabs() {
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const tabs = [
        { name: 'audio', href: '/audio' },
        { name: 'form', href: '/form' },
        { name: 'stock', href: '/stock' }
    ];

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2">
            <div className="flex p-1 bg-gray-900/50 rounded-full backdrop-blur-sm">
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={`px-4 py-1 rounded-full transition-colors ${
                            pathname === tab.href
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {tab.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}
