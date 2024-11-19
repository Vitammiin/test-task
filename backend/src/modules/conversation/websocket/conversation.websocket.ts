import { FastifyInstance } from "fastify";
import { ConversationService } from "../services/conversation.service";
// import decodeAudio from "audio-decode";

export const conversationWebSocket = (app: FastifyInstance) => {
  const conversationService = new ConversationService(
    process.env.OPENAI_API_KEY as string
  );

  app.get("/ws", { websocket: true }, (connection, req) => {
    let isConversationActive = false;

    connection.on("message", async (message: string) => {
      try {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "start_conversation") {
          console.log("Starting conversation...");
          isConversationActive = true;
          const userMessage = parsedMessage.message || "Hello!";
          const response = await conversationService.startConversation(
            userMessage
          );
          connection.send(JSON.stringify({ type: "response", data: response }));
        } else if (parsedMessage.type === "end_conversation") {
          console.log("Ending conversation...");
          isConversationActive = false;
          conversationService.endConversation();
          connection.send(
            JSON.stringify({
              type: "response",
              data: "Conversation ended. Feel free to start a new one!",
            })
          );
        } else if (
          parsedMessage.type === "input_audio_stream" &&
          isConversationActive
        ) {
          const audioBuffer = Buffer.from(parsedMessage.audio, "base64");
          // const decodedAudio = await decodeAudio(audioBuffer);
          // const channelData = decodedAudio.getChannelData(0);
          // const base64Audio = base64EncodeAudio(channelData);

          connection.send(
            JSON.stringify({
              type: "audio_chunk_received",
              audio: "base64Audio",
            })
          );
        }
      } catch (err) {
        console.error("Error processing WebSocket message:", err);
        connection.send(
          JSON.stringify({ error: "Error processing your request" })
        );
      }
    });

    connection.on("close", () => {
      console.log("Client disconnected");
    });
  });
};

function base64EncodeAudio(float32Array: Float32Array): string {
  const arrayBuffer = floatTo16BitPCM(float32Array);
  let binary = "";
  let bytes = new Uint8Array(arrayBuffer);
  const chunkSize = 0x8000; // 32KB chunk size
  for (let i = 0; i < bytes.length; i += chunkSize) {
    let chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

// Convert Float32Array to 16-bit PCM (necessary for audio processing)
function floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}
