import useMediaDevices from "../hooks/useMediaDevices";
import useWindowSize from "../hooks/useWindowSize";
import DeviceSelector from "../components/DeviceSelector";
import VideoPreview from "../components/VideoPreview";
import AudioTest from "../components/AudioTest";

export default function MediaTestPage() {
  const {
    devices,
    selected,
    selectDevice,
    stream,
    isVideoActive,
    isAudioActive,
    startCall,
    stopVideo,
    stopAudio,
  } = useMediaDevices();

  const { width } = useWindowSize();
  const isNarrow = width < 900;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f9fafb",
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isNarrow ? "1fr" : "1fr 1fr",
          gap: "2rem",
          background: "white",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {/* Left Column — Video */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Live Preview</h2>
          <VideoPreview stream={stream} />
        </div>

        {/* Right Column — Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h1 style={{ textAlign: "center", marginBottom: "0.5rem" }}>Media Test Page</h1>

          <DeviceSelector
            label="Camera"
            type="camera"
            devices={devices.cameras}
            selectedId={selected.camera}
            onSelect={selectDevice}
          />
          <DeviceSelector
            label="Microphone"
            type="mic"
            devices={devices.microphones}
            selectedId={selected.mic}
            onSelect={selectDevice}
          />
          <DeviceSelector
            label="Speaker"
            type="speaker"
            devices={devices.speakers}
            selectedId={selected.speaker}
            onSelect={selectDevice}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "0.5rem",
              marginTop: "1rem",
            }}
          >
            <button
              onClick={startCall}
              style={{
                background: "#22c55e",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                flex: 1,
              }}
            >
              Start Call
            </button>

            <button
              onClick={stopVideo}
              style={{
                background: "#f87171",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                flex: 1,
              }}
              disabled={!isVideoActive}
            >
              Stop Video
            </button>

            <button
              onClick={stopAudio}
              style={{
                background: "#60a5fa",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                flex: 1,
              }}
              disabled={!isAudioActive}
            >
              Stop Audio
            </button>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <AudioTest outputId={selected.speaker} />
          </div>
        </div>
      </div>
    </div>
  );
}
