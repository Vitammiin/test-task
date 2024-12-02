"use client"

import React from "react";
import MicrophoneButton from "../../components/MicrophoneButton";

const AudioPage = () => {
    return (
        <div className="box-container">
            <div className="flex flex-col align-center justify-center text-center bg-gray-800 p-16 rounded-2xl">
                <MicrophoneButton/>
            </div>
        </div>
    );
};

export default AudioPage;
