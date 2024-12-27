export const adjustSamplingRate = (audio, srcRate, destRate) => {
  if (srcRate === destRate) return audio;

  const scale = srcRate / destRate;
  const newSize = Math.round(audio.length / scale);
  const output = new Float32Array(newSize);

  for (let n = 0; n < newSize; n++) {
    const pos = n * scale;
    const idx = Math.floor(pos);
    const frac = pos - idx;

    output[n] =
      idx + 1 < audio.length
        ? audio[idx] * (1 - frac) + audio[idx + 1] * frac
        : audio[idx];
  }

  return output;
};

export const convertToInt16 = (floatData, originalRate = 48000) => {
  const adjusted = adjustSamplingRate(floatData, originalRate, 24000);

  return new Int16Array(
    adjusted.map((sample) => {
      const clamped = Math.max(-1, Math.min(1, sample));
      return clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    }),
  );
};

export const toMonoChannel = (audioChannels) => {
  if (audioChannels.length === 1) return audioChannels[0];

  const monoTrack = new Float32Array(audioChannels[0].length);
  for (let i = 0; i < monoTrack.length; i++) {
    monoTrack[i] =
      audioChannels.reduce((sum, channel) => sum + channel[i], 0) /
      audioChannels.length;
  }
  return monoTrack;
};

export const prepareAudioForAI = (audioInput, sampleFreq) => {
  const singleChannel = Array.isArray(audioInput)
    ? toMonoChannel(audioInput)
    : audioInput;
  const processedAudio = convertToInt16(singleChannel, sampleFreq);

  const minSamples = Math.ceil(24000 * 0.01);
  if (processedAudio.length < minSamples) {
    const paddedAudio = new Int16Array(minSamples);
    paddedAudio.set(processedAudio);
    return Buffer.from(paddedAudio.buffer).toString('base64');
  }

  return Buffer.from(processedAudio.buffer).toString('base64');
};
