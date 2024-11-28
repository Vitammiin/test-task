"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { Player } from "@lottiefiles/react-lottie-player";
import { useWebSocket } from "../hooks/useWebSocket";
<<<<<<< HEAD
=======
import { getAudio } from "@/api/apiAudio";
>>>>>>> 6942a21e16f9939721cc71e7aa7eaea6e50d0864

const animationData =
  "https://lottie.host/e0a3a47e-56a1-4902-889f-e06fcc5d536e/f93zpjYihw.json";

const animationDataRed =
  "https://lottie.host/d2a1472e-0f79-4137-8883-1aec2ff52cde/7a2QEiE7s8.json";

const animationAudio =
  "https://lottie.host/331d3bcf-25ef-47fb-8528-804bb39d357c/YOqGGFW2Tp.json";

const Audio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const recorderControls = useVoiceVisualizer();
  const { recordedBlob, error } = recorderControls;

  const audioRef = useRef<HTMLAudioElement | null>(null);
<<<<<<< HEAD
  const { sendMessage } = useWebSocket("ws://localhost:5000");
=======
  const { sendMessage } = useWebSocket("ws://localhost:5000/chat");
>>>>>>> 6942a21e16f9939721cc71e7aa7eaea6e50d0864

  const [hasSentAudio, setHasSentAudio] = useState(false);

  const toggleRecording = async () => {
    if (isRecording) {
      recorderControls.stopRecording();
      sendMessage("stop");
      setHasSentAudio(false);

      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        setMediaStream(null);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setMediaStream(stream);
        recorderControls.startRecording();
        sendMessage("start");
      } catch (err) {
        console.error("Ошибка доступа к микрофону:", err);
      }
    }
    setIsRecording((prev) => !prev);
  };

  const sendAudioBlob = useCallback(
    (blob: Blob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        if (arrayBuffer instanceof ArrayBuffer) {
          const base64String = btoa(
            String.fromCharCode(...new Uint8Array(arrayBuffer))
          );
          sendMessage(base64String);
          setHasSentAudio(true);
        }
      };
      reader.readAsArrayBuffer(blob);
    },
    [sendMessage]
  );

  useEffect(() => {
    if (!recordedBlob || hasSentAudio || !audioRef.current) return;

    const audioUrl = URL.createObjectURL(recordedBlob);
<<<<<<< HEAD

    const handleEnded = () => {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        audioRef.current.play();
      }
    };

    const currentAudioRef = audioRef.current;

    if (currentAudioRef.paused) {
      handleEnded();
    } else {
      currentAudioRef.addEventListener("ended", handleEnded);
    }

    sendAudioBlob(recordedBlob);

    return () => {
      if (currentAudioRef) {
        currentAudioRef.removeEventListener("ended", handleEnded);
      }
    };
  }, [recordedBlob, error, sendAudioBlob, hasSentAudio]);

  useEffect(() => {
    if (error) {
      console.error("Ошибка записи:", error);
    }
  }, [error]);

=======
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }

    sendAudioBlob(recordedBlob);
  }, [recordedBlob, error, sendAudioBlob, hasSentAudio]);

  useEffect(() => {
    if (!error) return;
    console.error(error);
  }, [error]);

  useEffect(() => {
    getAudio();
  }, []);

>>>>>>> 6942a21e16f9939721cc71e7aa7eaea6e50d0864
  return (
    <div
      className="min-h-[264px] min-w-[384px] m-auto flex flex-col justify-center items-center text-center rounded-[14px]"
      style={{
<<<<<<< HEAD
        boxShadow: `0px 0px 1px 0px rgba(255, 255, 255, 0.15) inset, 0px 2px 10px 0px rgba(0, 0, 0, 0.2), 0px 0px 5px 0px rgba(0, 0, 0, 0.05)`,
=======
        boxShadow: `
         0px 0px 1px 0px rgba(255, 255, 255, 0.15) inset,
         0px 2px 10px 0px rgba(0, 0, 0, 0.2),
         0px 0px 5px 0px rgba(0, 0, 0, 0.05)
        `,
>>>>>>> 6942a21e16f9939721cc71e7aa7eaea6e50d0864
        background: "rgba(24, 24, 27, 1)",
      }}
    >
      <div
        onClick={toggleRecording}
        className={
          isRecording
            ? "flex flex-col justify-center text-center w-auto h-auto text-xs cursor-pointer font-bold text-red-600 p-4 rounded-3xl border-black bg-[rgba(23, 23, 23, 1)]"
            : "flex flex-col justify-center text-center w-auto h-auto text-xs cursor-pointer font-bold text-white p-4 rounded-3xl border-black bg-[rgba(23, 23, 23, 1)]"
        }
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          fontWeight: "600",
          lineHeight: "14.52px",
          textAlign: "center",
          textUnderlinePosition: "from-font",
          textDecorationSkipInk: "none",
          width: "552px",
          minHeight: "313px",
        }}
      >
        {isRecording ? (
          <Player
            loop={true}
            autoplay={isRecording}
            src={animationAudio}
            style={{ height: "185px", width: "300px" }}
          />
        ) : null}
        <Player
          loop={true}
          autoplay={isRecording}
          src={isRecording ? animationDataRed : animationData}
          style={{ height: "185px", width: "176px" }}
        />
      </div>
      {isRecording && !isRecording && (
        <div>
          <VoiceVisualizer controls={recorderControls} />
        </div>
      )}
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
};

export default Audio;
