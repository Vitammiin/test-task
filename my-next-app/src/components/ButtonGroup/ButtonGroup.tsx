"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import Left from "../../styles/images/left.png";
import Image from "next/image";
import Right from "../../styles/images/right.png";
import Center from "../../styles/images/center.png";
=======
>>>>>>> 6942a21e16f9939721cc71e7aa7eaea6e50d0864

function ButtonGroup({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const getHoverStyle = (button: string) => {
    switch (button) {
      case "audio":
        return hoveredButton === "audio"
          ? { color: "rgba(255, 110, 253, 1)" }
          : { color: "rgba(255, 255, 255, 1)" };
      case "form":
        return hoveredButton === "form"
          ? { color: "rgba(93, 223, 255, 1)" }
          : { color: "rgba(255, 255, 255, 1)" };
      case "stock":
        return hoveredButton === "stock"
          ? { color: "rgba(93, 223, 255, 1)" }
          : { color: "rgba(255, 255, 255, 1)" };
      default:
        return { color: "rgba(255, 255, 255, 1)" };
    }
  };

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="flex flex-row justify-center items-center space-x-4 mb-16">
<<<<<<< HEAD
        <div
          style={{
            position: "relative",
            display: "inline-block",
            cursor: "pointer",
            height: "32.98px",
            width: "98.95px",
            top: "-0.3px",
          }}
        >
          <Image
            onClick={() => {
              router.push("/");
            }}
            onMouseEnter={() => setHoveredButton("audio")}
            onMouseLeave={() => setHoveredButton(null)}
            src={Left}
            alt="logo"
            style={{ display: "block" }}
          />
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "16px",
              textShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
              pointerEvents: "none",
              fontFamily: "var(--font-inter)",
              ...getHoverStyle("audio"),
              transition: "color 0.3s ease",
            }}
          >
            audio
          </span>
        </div>
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginLeft: "-1.5px",
            cursor: "pointer",
            height: "32.98px",
            width: "98.95px",
          }}
        >
          <Image
            onClick={() => {
              router.push("/form");
            }}
            onMouseEnter={() => setHoveredButton("form")}
            onMouseLeave={() => setHoveredButton(null)}
            src={Center}
            alt="logo"
            style={{ display: "block" }}
          />
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "16px",
              textShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
              pointerEvents: "none",
              fontFamily: "var(--font-inter)",
              ...getHoverStyle("form"),
              transition: "color 0.3s ease",
            }}
          >
            form
          </span>
        </div>

        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginLeft: "-1.5px",
            cursor: "pointer",
            height: "32.98px",
            width: "98.95px",
            top: "-0.1px",
          }}
        >
          <Image
            onClick={() => {
              router.push("/stock");
            }}
            onMouseEnter={() => setHoveredButton("stock")}
            onMouseLeave={() => setHoveredButton(null)}
            src={Right}
            alt="logo"
            style={{ display: "block" }}
          />
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "16px",
              textShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
              pointerEvents: "none",
              fontFamily: "var(--font-inter)",
              ...getHoverStyle("stock"),
              transition: "color 0.3s ease",
            }}
          >
            stock
          </span>
        </div>
=======
        <button
          onClick={() => {
            router.push("/");
          }}
          onMouseEnter={() => setHoveredButton("audio")}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            margin: "0",
            border: "1.5px solid transparent",
            borderImage:
              "linear-gradient(90.99deg, #FF1CF7 -1.01%, #00F0FF 306.2%)",
            borderImageSlice: 1,
            width: "98.95px",
            height: "32.98px",
            gap: "0px",
            opacity: "1",
            fontFamily: "var(--font-inter)",
            ...getHoverStyle("audio"),
            transition: "color 0.3s ease",
          }}
        >
          audio
        </button>
        <button
          onClick={() => {
            router.push("/form");
          }}
          onMouseEnter={() => setHoveredButton("form")}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            margin: "0",
            border: "1.5px solid transparent",
            borderImage:
              "linear-gradient(91.61deg, #FF1CF7 -18.95%, #00F0FF 103.49%)",
            borderImageSlice: 1,
            width: "98.95px",
            height: "32.98px",
            gap: "0px",
            opacity: "1",
            fontFamily: "var(--font-inter)",
            ...getHoverStyle("form"),
            transition: "color 0.3s ease",
          }}
        >
          form
        </button>
        <button
          onClick={() => {
            router.push("/stock");
          }}
          onMouseEnter={() => setHoveredButton("stock")}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            margin: "0",
            border: "1.5px solid transparent",
            borderImage:
              "linear-gradient(94.65deg, #FF1CF7 -196.33%, #00F0FF 22.49%)",
            borderImageSlice: 1,
            width: "98.95px",
            height: "32.98px",
            gap: "0px",
            opacity: "1",
            fontFamily: "var(--font-inter)",
            ...getHoverStyle("stock"),
            transition: "color 0.3s ease",
          }}
        >
          stock
        </button>
>>>>>>> 6942a21e16f9939721cc71e7aa7eaea6e50d0864
      </div>
      <div className="min-h-[264px] min-w-[384px] flex items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

export default ButtonGroup;
