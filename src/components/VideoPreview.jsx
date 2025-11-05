import { useEffect, useRef } from "react";

export default function VideoPreview({ stream }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream || null;
    }
  }, [stream]);

  return (
    <div
      style={{
        width: "100%",
        background: "#000",
        borderRadius: "10px",
        overflow: "hidden",
        minHeight: "260px",
      }}
    >
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: "100%", borderRadius: "10px" }}
        />
      ) : (
        <div
          style={{
            color: "#888",
            textAlign: "center",
            padding: "4rem 1rem",
          }}
        >
          No video feed active
        </div>
      )}
    </div>
  );
}
