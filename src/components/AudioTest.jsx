import { useEffect, useRef, useState } from "react";

export default function AudioTest({ outputDeviceId }) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const rafIdRef = useRef(null);
  const streamRef = useRef(null); 


  useEffect(() => {
    async function initAudio() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setPermissionGranted(true);

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);
        analyserRef.current = analyser;

        const updateVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setVolume(avg);
          rafIdRef.current = requestAnimationFrame(updateVolume);
        };
        updateVolume();
      } catch (err) {
        setError(err.message);
        setPermissionGranted(false);
      }
    }

    initAudio();

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (analyserRef.current) analyserRef.current.disconnect();
    };
  }, []);

  const playTestSound = () => {
    const audio = new Audio("/test-tone.mp3"); // add a small tone file or use oscillator below
    if (outputDeviceId && audio.setSinkId) {
      audio.setSinkId(outputDeviceId).catch(console.warn);
    }
    audio.play();
  };

  return (
    <div className="audio-test">
      <h2>Microphone Test</h2>
      {!permissionGranted && !error && <p>Waiting for mic permission...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {permissionGranted && (
        <>
          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#333",
              borderRadius: "4px",
              marginTop: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(volume, 100)}%`,
                height: "100%",
                background: volume > 50 ? "#4caf50" : "#00bfff",
                transition: "width 0.1s",
              }}
            />
          </div>

          <button
            onClick={playTestSound}
            style={{
              marginTop: "1rem",
              background: "#4f8cff",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
          </button>
        </>
      )}
    </div>
  );
}
