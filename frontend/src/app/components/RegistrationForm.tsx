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
        className="text-2xl font-bold text-gray-800"
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
        // Перенаправление на страницу успешной регистрации
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
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-93 max-w-md flex-col gap-5 overflow-hidden rounded-xl bg-white px-12 py-10 shadow-lg">
        <LazyMotion features={domAnimation}>
          <m.div className="flex min-h-[40px] items-center gap-4 mb-1">
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
                      className="bg-gray-200 hover:bg-gray-300"
                      onPress={() => paginate(-1)}
                    >
                      <Icon
                        className="text-gray-600"
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
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full"
                  classNames={{
                    input:
                      'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3 mt-3',
                    label: 'text-sm font-medium text-gray-700',
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
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  className="w-full"
                  classNames={{
                    input:
                      'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3 mt-3',
                    label: 'text-sm font-medium text-gray-700',
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
                    !isConfirmPasswordValid
                      ? 'Passwords do not match'
                      : undefined
                  }
                  label="Confirm Password"
                  name="confirmPassword"
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  className="w-full"
                  classNames={{
                    input:
                      'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3 mt-3',
                    label: 'text-sm font-medium text-gray-700',
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
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
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
        <p className="text-center text-sm text-gray-600">
          Already have an account?&nbsp;
          <Link href="#" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </div>
  );
};

export default RegistrationForm;
