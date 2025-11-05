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
        maxWidth: "500px",
        aspectRatio: "16 / 9",
        background: "#000",
        borderRadius: "10px",
        overflow: "hidden",
        position: "relative",
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
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      ) : (
        <div
          style={{
            color: "#888",
            textAlign: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          No video feed active
        </div>
      )}
    </div>
  );
}
