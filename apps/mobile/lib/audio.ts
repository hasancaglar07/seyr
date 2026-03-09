import { Audio } from "expo-av";

let activeSound: Audio.Sound | null = null;

export async function configureAudioMode() {
  await Audio.setAudioModeAsync({
    staysActiveInBackground: true,
    interruptionModeAndroid: 1,
    interruptionModeIOS: 1,
    shouldDuckAndroid: true,
    playsInSilentModeIOS: true,
    playThroughEarpieceAndroid: false,
  });
}

export async function playStream(url: string) {
  await configureAudioMode();

  if (activeSound) {
    await activeSound.unloadAsync();
    activeSound = null;
  }

  const { sound } = await Audio.Sound.createAsync(
    { uri: url },
    { shouldPlay: true, progressUpdateIntervalMillis: 1000 },
  );

  activeSound = sound;
  return sound;
}

export async function stopStream() {
  if (!activeSound) return;
  await activeSound.stopAsync();
}