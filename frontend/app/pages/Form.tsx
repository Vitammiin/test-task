"use client";
import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import axios from "axios";

const FormComponent = () => {
  const [email, setEmail] = useState("");
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const handleSubmit = async () => {
    if (!email) {
      setIsInvalidEmail(true);
      return;
    }

    setIsInvalidEmail(false);

    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/signup",
        {
          email,
        }
      );

      if (response.status === 201 || response.status === 200) {
        console.log("Successfully signed up");
        alert("Successfully signed up");
      }
    } catch (error: any) {
      alert("Error signing up");
      console.error(
        "Error signing up:",
        error?.data?.message || error?.message
      );
    }
  };

  return (
    <div className="box-container">
      <h6 className="form-title">Sign Up</h6>
      <Input
        type="email"
        label="Mail"
        variant="bordered"
        isRequired
        isInvalid={isInvalidEmail}
        classNames={{
          label: "text-white dark:text-white",
          input: ["!text-white"],
        }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        color="primary"
        variant="solid"
        className="w-full mt-4"
        onClick={handleSubmit}
      >
        Continue with email
      </Button>
      <p className="text-center text-small mt-4">
        Already have an account?&nbsp;
        <Link href="#" className="text-primary">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default FormComponent;
