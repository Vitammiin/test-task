"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { postEmail } from "@/api/apiEmail";

const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Form() {
  const [email, setEmail] = useState("");
  const [isLogIn, setLogIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("Invalid email address");
      return;
    }

    const data = await postEmail(email);

    if (data) {
      sessionStorage.setItem("token", data.token);
      if (data.message === "Email already exists") {
        alert(`Your email ${email} exists.`);
      } else {
        alert(`Your email ${email} has been sent.`);
        setEmail("");
      }
    }
  };

  return (
    <div
      className="flex min-h-[264px] min-w-[384px] flex-col items-center justify-center rounded-[14px]"
      style={{
        boxShadow: `
         0px 0px 1px 0px rgba(255, 255, 255, 0.15) inset,
         0px 2px 10px 0px rgba(0, 0, 0, 0.2),
         0px 0px 5px 0px rgba(0, 0, 0, 0.05)
        `,
        background: "rgba(24, 24, 27, 1)",
      }}
    >
      <div className="w-[320px] text-left">
        {isLogIn ? "Log in" : "Sign Up"}
      </div>
      <form
        onSubmit={handleSubmit}
        className="font-inter w-[320px] flex flex-col items-center gap-4"
        style={{
          fontFamily: "Iner",
          fontWeight: "400",
          fontSize: "14px",
          lineHeight: "20px",
        }}
      >
        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="font-inter w-full h-[56px] mb-2 mt-[26px] p-2 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <Button
          type="submit"
          className="font-inter w-full h-10 pointer text-[14px] text-default-400 bg-customBlue rounded-xl  hover:bg-blue-700 transition-all"
        >
          Continue with Email
        </Button>
      </form>
      <div>
        Already have an account?
        <button
          className="text-customBlue mt-4 ml-1 pointer hover:text-blue-700 transition-all"
          onClick={() => setLogIn((prev) => !prev)}
        >
          {isLogIn ? "Sign Up" : "Log in"}
        </button>
      </div>
    </div>
  );
}
