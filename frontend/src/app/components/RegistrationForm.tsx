'use client';
import React from 'react';
import { Button, Input, Link, Tooltip } from '@nextui-org/react';
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion';
import { Icon } from '@iconify/react';
import { registerUser } from '@/api/apiRegistration';
import toast, { Toaster } from 'react-hot-toast';

const RegistrationForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [[page, direction], setPage] = React.useState([0, 0]);
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [isPasswordValid, setIsPasswordValid] = React.useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] =
    React.useState(true);
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const Title = React.useCallback(
    (props: React.PropsWithChildren<{}>) => (
      <m.h1
        animate={{ opacity: 1, x: 0 }}
        className="text-xl font-medium text-custom-light-gray"
        exit={{ opacity: 0, x: -10 }}
        initial={{ opacity: 0, x: -10 }}
      >
        {props.children}
      </m.h1>
    ),
    [page],
  );

  const titleContent = React.useMemo(() => {
    return page === 0
      ? 'Sign Up'
      : page === 1
        ? 'Enter Password'
        : 'Confirm Password';
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

  const showError = (error: number) =>
    toast.error(
      error === 409
        ? 'This email is already registered'
        : error === 400
          ? 'Invalid input data'
          : 'Something went wrong',
    );

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.length) {
      setEmailError('Email is required');
      return false;
    }
    if (!re.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailSubmit = () => {
    if (validateEmail(email)) {
      setIsEmailValid(true);
      paginate(1);
    } else {
      setIsEmailValid(false);
    }
  };

  const handlePasswordSubmit = () => {
    if (validatePassword(password)) {
      setIsPasswordValid(true);
      paginate(1);
    } else {
      setIsPasswordValid(false);
    }
  };

  const handleConfirmPasswordSubmit = async () => {
    if (!confirmPassword.length || confirmPassword !== password) {
      setIsConfirmPasswordValid(false);
      return;
    }
    setIsConfirmPasswordValid(true);

    try {
      const result = await registerUser(email, password);
      if (result.success) {
        toast.success('Registration successful!');
      } else {
        if (Number(result.error) === 409) {
          showError(409);
        } else {
          showError(500);
        }
      }
    } catch (error) {
      showError(500);
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
    <div className="min-w-[384px] pt-[26px] px-8 pb-10 flex flex-col gap-3 overflow-hidden rounded-[14px] bg-custom-gray shadow-lg">
      <LazyMotion features={domAnimation}>
        <m.div className="flex min-h-[40px] items-start">
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
                    className="bg-gray-200 hover:bg-gray-300 mt-1.5 mr-1.5"
                    onPress={() => paginate(-1)}
                  >
                    <Icon
                      className="text-gray-800"
                      icon="solar:alt-arrow-left-linear"
                      width={16}
                    />
                  </Button>
                </Tooltip>
              </m.div>
            )}
          </AnimatePresence>
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <Title>{titleContent}</Title>
          </AnimatePresence>
        </m.div>
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <m.form
            key={page}
            animate="center"
            className="flex flex-col gap-5"
            custom={direction}
            exit="exit"
            initial="enter"
            method="post"
            transition={{ duration: 0.2 }}
            variants={variants}
            onSubmit={handleSubmit}
          >
            {page === 0 && (
              <Input
                autoFocus
                isRequired
                name="email"
                type="email"
                placeholder="mail &#42;"
                className="w-full"
                classNames={{
                  input:
                    'bg-input-dark-gray border border-gray-500 hover:border-blue-500 focus-visible:border-blue-600 text-white text-sm rounded-xl focus:ring-blue-500 block w-[335px] -ml-2.5 my-2 px-3 py-4 transition-colors duration-200',
                  errorMessage: 'text-red-500',
                }}
                validationState={isEmailValid ? 'valid' : 'invalid'}
                errorMessage={emailError}
                value={email}
                onValueChange={(value) => {
                  setIsEmailValid(true);
                  setEmail(value);
                }}
              />
            )}
            {page === 1 && (
              <Input
                autoFocus
                isRequired
                endContent={
                  <button type="button" onClick={togglePasswordVisibility}>
                    {isPasswordVisible ? (
                      <Icon
                        className="pointer-events-none text-2xl text-gray-400"
                        icon="solar:eye-closed-linear"
                      />
                    ) : (
                      <Icon
                        className="pointer-events-none text-2xl text-gray-400"
                        icon="solar:eye-bold"
                      />
                    )}
                  </button>
                }
                name="password"
                placeholder="password &#42;"
                type={isPasswordVisible ? 'text' : 'password'}
                className="w-full"
                classNames={{
                  input:
                    'bg-input-dark-gray border border-gray-500 hover:border-blue-500 focus-visible:border-blue-600 text-white text-sm rounded-xl focus:ring-blue-500 block w-[335px] -ml-2.5 my-2 px-3 py-4 transition-colors duration-200',
                  errorMessage: 'text-red-500',
                }}
                validationState={isPasswordValid ? 'valid' : 'invalid'}
                errorMessage={passwordError}
                value={password}
                onValueChange={(value) => {
                  setIsPasswordValid(true);
                  setPassword(value);
                }}
              />
            )}
            {page === 2 && (
              <Input
                autoFocus
                isRequired
                endContent={
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {isConfirmPasswordVisible ? (
                      <Icon
                        className="pointer-events-none text-2xl text-gray-400"
                        icon="solar:eye-closed-linear"
                      />
                    ) : (
                      <Icon
                        className="pointer-events-none text-2xl text-gray-400"
                        icon="solar:eye-bold"
                      />
                    )}
                  </button>
                }
                errorMessage={
                  !isConfirmPasswordValid ? 'Passwords do not match' : undefined
                }
                name="confirmPassword"
                type={isConfirmPasswordVisible ? 'text' : 'password'}
                placeholder="repeat your password &#42;"
                className="w-full"
                classNames={{
                  input:
                    'bg-input-dark-gray border border-gray-500 hover:border-blue-500 focus-visible:border-blue-600 text-white text-sm rounded-xl focus:ring-blue-500 block w-[335px] -ml-2.5 my-2 px-3 py-4 transition-colors duration-200',
                  errorMessage: 'text-red-500',
                }}
                validationState={isConfirmPasswordValid ? 'valid' : 'invalid'}
                value={confirmPassword}
                onValueChange={(value) => {
                  setIsConfirmPasswordValid(true);
                  setConfirmPassword(value);
                }}
              />
            )}
            <Button
              fullWidth
              color="primary"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded-xl transition duration-300"
            >
              {page === 0
                ? 'Continue with Email'
                : page === 1
                  ? 'Enter Password'
                  : 'Confirm Password'}
            </Button>
          </m.form>
        </AnimatePresence>
      </LazyMotion>
      <p className="text-center text-sm text-custom-light-gray">
        Already have an account?&nbsp;
        <Link href="#" className="text-blue-600 hover:underline">
          Log In
        </Link>
      </p>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default RegistrationForm;
