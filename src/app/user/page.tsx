'use client'
import React from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';

export default function User() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
            <div className="flex w-full max-w-sm flex-col gap-4 overflow-hidden rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
                <h1 className="text-xl font-medium">User Page</h1>
                <p>Welcome to your user page!</p>
                <Button fullWidth color="primary" onPress={handleLogout}>
                    Log Out
                </Button>
            </div>
        </div>
    );
}
