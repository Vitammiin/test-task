export function resampleAudio(audioData: Float32Array, fromSampleRate: number, toSampleRate: number): Float32Array {
    if (fromSampleRate === toSampleRate) {
        return audioData;
    }

    const ratio = fromSampleRate / toSampleRate;
    const newLength = Math.round(audioData.length / ratio);
    const result = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
        const position = i * ratio;
        const index = Math.floor(position);
        const fraction = position - index;

        if (index + 1 < audioData.length) {
            result[i] = audioData[index] * (1 - fraction) + audioData[index + 1] * fraction;
        } else {
            result[i] = audioData[index];
        }
    }

    return result;
}

export function floatTo16BitPCM(float32Array: Float32Array, sampleRate: number = 48000): Int16Array {

    const resampledData = resampleAudio(float32Array, sampleRate, 24000);

    const int16Array = new Int16Array(resampledData.length);
    for (let i = 0; i < resampledData.length; i++) {
        const s = Math.max(-1, Math.min(1, resampledData[i]));
        int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16Array;
}

export function convertToMono(audioData: Float32Array[]): Float32Array {
    if (audioData.length === 1) return audioData[0];

    const monoData = new Float32Array(audioData[0].length);
    for (let i = 0; i < monoData.length; i++) {
        let sum = 0;
        for (let channel = 0; channel < audioData.length; channel++) {
            sum += audioData[channel][i];
        }
        monoData[i] = sum / audioData.length;
    }
    return monoData;
}

export function processAudioForOpenAI(audioData: Float32Array | Float32Array[], sampleRate: number): string {

    const monoData = Array.isArray(audioData) ? convertToMono(audioData) : audioData;

    const pcm16Data = floatTo16BitPCM(monoData, sampleRate);

    return Buffer.from(pcm16Data.buffer).toString('base64');
}