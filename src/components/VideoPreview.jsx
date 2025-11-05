import { useEffect, useRef, useState } from "react";

export default function VideoPreview() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("unknown");

  // Request permission and start camera
  async function requestCameraAccess() {
    setError(null);

    try {
      // Ask explicitly for permission
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(newStream);
      setPermissionStatus("granted");
    } catch (err) {
      console.error("Error starting camera:", err);
      setPermissionStatus("denied");
      setError(err.message);
    }
  }

  // Set video stream once available
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (videoRef.current) videoRef.current.srcObject = null;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

  // Optional: Check permission status (modern browsers)
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "camera" })
        .then((status) => setPermissionStatus(status.state))
        .catch(() => {});
    }
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🎥 Camera & Mic Test</h2>

      {permissionStatus === "denied" && (
        <p style={{ color: "red" }}>
          Camera permission denied. Please allow access in your browser settings.
        </p>
      )}

      {!stream && permissionStatus !== "granted" && (
        <button
          onClick={requestCameraAccess}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Request Camera Access
        </button>
      )}

      {stream && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "320px",
            height: "240px",
            background: "#000",
            borderRadius: "8px",
            marginTop: "1rem",
          }}
        />
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
