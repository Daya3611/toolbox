import axios from "axios";

export async function getElevenLabsTTS(text: string): Promise<Blob | null> {
  const apiKey = process.env.NEXT_PUBLIC_ELEVEN_API_KEY;
  const voiceId = "m5qndnI7u4OAdXhH0Mr5"; // Default ElevenLabs voice

  if (!apiKey) {
    console.error("❌ Missing ElevenLabs API key. Check .env.local configuration.");
    return null;
  }

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: "eleven_monolingual_v1", // Optional: default model
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.7,
        },
      },
      {
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        responseType: "blob", // required for audio
      }
    );

    if (response.status === 200 && response.data) {
      return response.data as Blob;
    } else {
      console.warn("⚠️ Unexpected response from ElevenLabs:", response);
      return null;
    }
  } catch (error: any) {
    if (error.response) {
      console.error("❌ ElevenLabs API error:", error.response.status, error.response.data);
    } else {
      console.error("❌ ElevenLabs TTS request failed:", error.message);
    }
    return null;
  }
}
