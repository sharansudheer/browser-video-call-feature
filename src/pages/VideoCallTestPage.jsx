// MediaTestPage.jsx (Compact Version)

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
  // New breakpoint: Switch to single column below 700px
  const isNarrow = width < 700; 
  // Very narrow fixed column for controls
  const CONTROL_COLUMN_WIDTH = "280px"; 

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "1rem", // Minimal outer padding
      }}
    >
      <div
        style={{
          display: "grid",
          // Grid definition: 1fr for video + fixed width for controls
          gridTemplateColumns: isNarrow ? "1fr" : `1fr ${CONTROL_COLUMN_WIDTH}`,
          gap: isNarrow ? "1rem" : "1.5rem", // Tighter gap between columns
          background: "white",
          padding: "1.5rem", // Tighter internal padding
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          // KEY CHANGE: Reduced maximum width for a compact, controlled size
          maxWidth: "650px", 
          alignItems: "start",
        }}
      >
        {/* Left Column — Video Preview */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2 style={{ marginBottom: "1rem", fontSize: "1.25rem", color: "#333" }}>Live Preview</h2>
          <VideoPreview stream={stream} />
        </div>

        {/* Right Column — Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}> 
          <h1 style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.25rem", color: "#1f2937" }}>
            Media Setup
          </h1>

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
              style={{ background: "#10b981", color: "white", border: "none", padding: "0.6rem 0.8rem", borderRadius: "6px", cursor: "pointer", flex: 1, fontWeight: "bold", transition: "background 0.3s", fontSize: "0.9rem" }}
            >
              Start Call
            </button>
            <button
              onClick={stopVideo}
              disabled={!isVideoActive}
              style={{ background: "#ef4444", color: "white", border: "none", padding: "0.6rem 0.8rem", borderRadius: "6px", cursor: "pointer", flex: 1, transition: "background 0.3s", fontSize: "0.9rem" }}
            >
              Stop Video
            </button>
            <button
              onClick={stopAudio}
              disabled={!isAudioActive}
              style={{ background: "#3b82f6", color: "white", border: "none", padding: "0.6rem 0.8rem", borderRadius: "6px", cursor: "pointer", flex: 1, transition: "background 0.3s", fontSize: "0.9rem" }}
            >
              Stop Audio
            </button>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h3 style={{ marginBottom: "0.4rem", color: "#333", fontSize: "1rem" }}>Audio Test</h3>
            <AudioTest outputId={selected.speaker} />
          </div>
        </div>
      </div>
    </div>
  );
}