// VideoPreview.jsx

import { useEffect, useRef } from "react";

export default function VideoPreview({ stream }) {
  const videoRef = useRef(null);

  // Effect to attach the MediaStream object to the <video> element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream || null;
    }
  }, [stream]);

  return (
    // Container enforces a 16:9 aspect ratio, preventing size jump when stream starts/stops.
    <div
      style={{
        width: "100%", // Takes full width of its parent grid column
        maxWidth: "500px",
        aspectRatio: "16 / 9", // KEY FIX: Maintains dimensions regardless of stream status
        background: "#1a1a1a", // Dark background for inactive state
        borderRadius: "10px",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // Ensures video covers the area without distortion
          }}
        />
      ) : (
        <div
          style={{
            color: "#fff", // White text on dark background
            fontSize: "1rem",
            textAlign: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "1rem",
          }}
        >
          **No video feed active**
          <br />
          <span style={{ fontSize: "0.8rem", color: "#aaa" }}>
            Select a camera and click "Start Call"
          </span>
        </div>
      )}
    </div>
  );
}