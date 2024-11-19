"use client";
import { Button } from "@nextui-org/react";
import Microphone from "./componenets/Microphone";
import FormComponent from "./pages/Form";
import TabsComponent from "./componenets/Tabs";
// import animationData from './testing.json';

export default function Home() {
  return (
    <div className="flex align-items-center">
      {/* <Microphone/> */}
      {/* <DotLottieReact src={animationData} loop autoplay height={100} width={100} color="red"/> */}
      {/* <FormComponent /> */}
      <TabsComponent />
    </div>
  );
}
