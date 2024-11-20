'use client'
import React from "react";
import { Button, Input, Link, Tooltip } from "@nextui-org/react";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { Icon } from "@iconify/react";
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6002';

export default function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const [isEmailValid, setIsEmailValid] = React.useState(true);
    const [isPasswordValid, setIsPasswordValid] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            setIsEmailValid(!!email);
            setIsPasswordValid(!!password);
            setError("Please fill in all fields");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);

            router.push('/user');

        } catch (error: any) {
            console.error('Login error:', error.message);
            setError(error.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
            <div className="flex w-full max-w-sm flex-col gap-4 overflow-hidden rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
                <LazyMotion features={domAnimation}>
                    {error && (
                        <m.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-sm"
                        >
                            {error}
                        </m.div>
                    )}
                    <m.form
                        animate="center"
                        className="flex flex-col gap-3"
                        initial="enter"
                        transition={{ duration: 0.2 }}
                        onSubmit={handleSubmit}
                    >
                        <Input
                            autoFocus
                            isRequired
                            label="Email Address"
                            name="email"
                            type="email"
                            validationState={isEmailValid ? "valid" : "invalid"}
                            value={email}
                            onValueChange={(value) => {
                                setIsEmailValid(true);
                                setEmail(value);
                                setError(null);
                            }}
                        />
                        <Input
                            autoFocus
                            isRequired
                            endContent={
                                <button type="button" onClick={togglePasswordVisibility}>
                                    <Icon
                                        className="pointer-events-none text-2xl text-default-400"
                                        icon={isPasswordVisible ? "solar:eye-closed-linear" : "solar:eye-bold"}
                                    />
                                </button>
                            }
                            label="Password"
                            name="password"
                            type={isPasswordVisible ? "text" : "password"}
                            validationState={isPasswordValid ? "valid" : "invalid"}
                            value={password}
                            onValueChange={(value) => {
                                setIsPasswordValid(true);
                                setPassword(value);
                                setError(null);
                            }}
                        />
                        <Button
                            fullWidth
                            color="primary"
                            type="submit"
                            isLoading={isLoading}
                            isDisabled={isLoading}
                        >
                            Log In
                        </Button>
                    </m.form>
                </LazyMotion>
                <p className="text-center text-small">
                    Don't have an account?&nbsp;
                    <Link href="/form" size="sm">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
