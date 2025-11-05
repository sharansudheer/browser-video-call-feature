import { useEffect, useRef } from "react";

export default function VideoPreview({ stream }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={{ marginTop: "1rem" }}>
      <h2>📸 Video Preview</h2>
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "320px",
            height: "240px",
            borderRadius: "8px",
            background: "#000",
          }}
        />
      ) : (
        <p>No video stream active</p>
      )}
    </div>
  );
}
