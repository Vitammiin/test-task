import { OpenAI } from "openai";
// import decodeAudio from "audio-decode";

export class ConversationService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
    });
  }

  public async startConversation(message: string): Promise<any> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: message }],
      });
      return response;
    } catch (err) {
      console.error("Error starting conversation:", err);
      throw new Error("Failed to start conversation");
    }
  }

  public async endConversation(): Promise<void> {
    try {
      console.log("Ending conversation...");
    } catch (err) {
      console.error("Error ending conversation:", err);
      throw new Error("Failed to end conversation");
    }
  }

  public async handleAudioStream(audioBuffer: Buffer): Promise<void> {
    try {
      // const decodedAudio = await decodeAudio(audioBuffer);
      // const channelData = decodedAudio.getChannelData(0);

      // const base64Audio = this.base64EncodeAudio(channelData);

      console.log("Audio data processed:", "base64Audio");
    } catch (err) {
      console.error("Error processing audio stream:", err);
    }
  }

  private floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  }

  private base64EncodeAudio(float32Array: Float32Array): string {
    const arrayBuffer = this.floatTo16BitPCM(float32Array);
    let binary = "";
    let bytes = new Uint8Array(arrayBuffer);
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      let chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    return btoa(binary);
  }
}
