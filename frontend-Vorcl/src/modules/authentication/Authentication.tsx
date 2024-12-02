'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { registerUser } from '../../services/commonAPI';

import { validationSchemaEmail } from '@/shared/helpers/validation-schema';

import Section from '@/shared/components/Section';
import FormItem from '@/shared/components/FormItem';
import Button from '@/shared/components/Button';

interface FormDataProps {
  email: string;
}

export default function Authentication({}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(validationSchemaEmail()),
  });

  const onSubmit: SubmitHandler<FormDataProps> = async ({ email }) => {
    try {
      if (!email) {
        throw new Error('Email is required');
      }
      const response = await registerUser(email);
      toast.success(response);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset, errors]);

  return (
    <Section styles="min-w-[384px] pt-[26px] px-8 pb-10">
      <h1 className="mb-[26px] font-Inter-500 font-medium text-xl text-customGrey-100">
        Sign Up
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[8px] mb-4"
        noValidate
      >
        <FormItem
          type="email"
          name="email"
          placeholder="mail &#42;"
          register={register}
          error={errors.email}
          styles="px-[13px] py-[22px]"
        />

        <Button type="submit">
          Continue with <br /> Email
        </Button>
      </form>

      <div className="flex justify-center items-end gap-[6px] font-Inter-400 font-normal text-sm">
        <p className="text-customGrey-100">Already have an account? </p>
        <Link className="text-customBlue-200" href="#">
          Log In
        </Link>
      </div>
    </Section>
  );
}
