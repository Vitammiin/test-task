"use client";

import React from "react";
import {Button, Tooltip} from "@nextui-org/react";
import {AnimatePresence, domAnimation, LazyMotion, m} from "framer-motion";
import {Icon} from "@iconify/react";

export default function Component() {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [[page, direction], setPage] = React.useState([0, 0]);
    const [isEmailValid, setIsEmailValid] = React.useState(true);
    const [isPasswordValid, setIsPasswordValid] = React.useState(true);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = React.useState(true);
    const [message, setMessage] = React.useState("");

    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
    const toggleConfirmPasswordVisibility = () =>
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

    const Title = React.useCallback(
        (props: React.PropsWithChildren<{}>) => (
            <m.h1
                animate={{opacity: 1, x: 0}}
                className="text-xl font-medium"
                exit={{opacity: 0, x: -10}}
                initial={{opacity: 0, x: -10}}
            >
                {props.children}
            </m.h1>
        ),
        [page],
    );

    const titleContent = React.useMemo(() => {
        return page === 0 ? "Sign Up" : page === 1 ? "Enter Password" : "Confirm Password";
    }, [page]);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    const handleEmailSubmit = () => {
        if (!email.length) {
            setIsEmailValid(false);
            return;
        }
        setIsEmailValid(true);
        paginate(1);
    };

    const handlePasswordSubmit = () => {
        if (!password.length) {
            setIsPasswordValid(false);
            return;
        }
        setIsPasswordValid(true);
        paginate(1);
    };

    const handleConfirmPasswordSubmit = async () => {
        if (!confirmPassword.length || confirmPassword !== password) {
            setIsConfirmPasswordValid(false);
            return;
        }
        setIsConfirmPasswordValid(true);

        try {
            const response = await fetch("http://localhost:4000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
            } else {
                setMessage(data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            setMessage("Error connecting to the server.");
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        switch (page) {
            case 0:
                handleEmailSubmit();
                break;
            case 1:
                handlePasswordSubmit();
                break;
            case 2:
                handleConfirmPasswordSubmit();
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex w-full max-w-sm flex-col min-w-6 gap-3 overflow-hidden rounded-2xl bg-gray-800 px-6 pb-8 pt-6 shadow-md">
                <LazyMotion features={domAnimation}>
                    <m.div className="flex items-center gap-1 pb-4">
                        <AnimatePresence initial={false} mode="popLayout">
                            {page >= 1 && (
                                <m.div
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    initial={{ opacity: 0, x: -10 }}
                                >
                                    <Tooltip content="Go back" delay={3000}>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="flat"
                                            onPress={() => paginate(-1)}
                                        >
                                            <Icon
                                                className="text-gray-400"
                                                icon="solar:alt-arrow-left-linear"
                                                width={16}
                                            />
                                        </Button>
                                    </Tooltip>
                                </m.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence custom={direction} initial={false} mode="wait">
                            <h2 className="text-center text-lg font-semibold text-white">
                                {titleContent}
                            </h2>
                        </AnimatePresence>
                    </m.div>
                    <AnimatePresence custom={direction} initial={false} mode="wait">
                        <m.form
                            key={page}
                            animate="center"
                            className="flex flex-col gap-3"
                            custom={direction}
                            exit="exit"
                            initial="enter"
                            transition={{duration: 0.2}}
                            variants={variants}
                            onSubmit={handleSubmit}
                        >
                            {/* Email Field */}
                            {page === 0 && (
                                <div className="relative">
                                    <input
                                        autoFocus
                                        required
                                        className={`w-full rounded-lg border ${
                                            isEmailValid
                                                ? "border-gray-600"
                                                : "border-red-500"
                                        } bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none`}
                                        placeholder="Email Address"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setIsEmailValid(true);
                                            setEmail(e.target.value);
                                        }}
                                    />
                                    {!isEmailValid && (
                                        <p className="mt-1 text-sm text-red-500">
                                            Please enter a valid email address.
                                        </p>
                                    )}
                                </div>
                            )}
                            {/* Password Field */}
                            {page === 1 && (
                                <div className="relative">
                                    <input
                                        autoFocus
                                        required
                                        className={`w-full rounded-lg border ${
                                            isPasswordValid
                                                ? "border-gray-600"
                                                : "border-red-500"
                                        } bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none`}
                                        placeholder="Password"
                                        name="password"
                                        type={isPasswordVisible ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => {
                                            setIsPasswordValid(true);
                                            setPassword(e.target.value);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-3"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {isPasswordVisible ? (
                                            <Icon
                                                className="text-gray-400"
                                                icon="solar:eye-closed-linear"
                                                width={20}
                                            />
                                        ) : (
                                            <Icon
                                                className="text-gray-400"
                                                icon="solar:eye-bold"
                                                width={20}
                                            />
                                        )}
                                    </button>
                                    {!isPasswordValid && (
                                        <p className="mt-1 text-sm text-red-500">
                                            Password must be at least 8 characters long.
                                        </p>
                                    )}
                                </div>
                            )}
                            {/* Confirm Password Field */}
                            {page === 2 && (
                                <div className="relative">
                                    <input
                                        autoFocus
                                        required
                                        className={`w-full rounded-lg border ${
                                            isConfirmPasswordValid
                                                ? "border-gray-600"
                                                : "border-red-500"
                                        } bg-gray-800 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none`}
                                        placeholder="Confirm Password"
                                        name="confirmPassword"
                                        type={isConfirmPasswordVisible ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setIsConfirmPasswordValid(true);
                                            setConfirmPassword(e.target.value);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-3"
                                        onClick={toggleConfirmPasswordVisibility}
                                    >
                                        {isConfirmPasswordVisible ? (
                                            <Icon
                                                className="text-gray-400"
                                                icon="solar:eye-closed-linear"
                                                width={20}
                                            />
                                        ) : (
                                            <Icon
                                                className="text-gray-400"
                                                icon="solar:eye-bold"
                                                width={20}
                                            />
                                        )}
                                    </button>
                                    {!isConfirmPasswordValid && (
                                        <p className="mt-1 text-sm text-red-500">
                                            Passwords do not match.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                className="w-full rounded-lg bg-blue-500 py-3 text-white transition-colors hover:bg-blue-600"
                                color="primary"
                                type="submit"
                                size="lg"
                            >
                                {page === 0
                                    ? "Continue with Email"
                                    : page === 1
                                        ? "Enter Password"
                                        : "Confirm Password"}
                            </Button>

                            <p className="text-center text-sm text-gray-400">
                                Already have an account?&nbsp;
                                <a href="#" className="text-blue-400 hover:underline">
                                    Log In
                                </a>
                            </p>

                            {/* Message from API */}
                            {message && (
                                <p className="mt-3 text-center text-sm text-gray-400">
                                    {message}
                                </p>
                            )}
                        </m.form>
                    </AnimatePresence>
                </LazyMotion>
            </div>
        </div>
    );
}
