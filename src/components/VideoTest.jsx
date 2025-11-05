import React, { useEffect, useRef, useState, useCallback } from "react";

export default function VideoTest({ onStream = () => {} }) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  // ✅ Request permission for camera
  const requestPermission = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissionGranted(true);
      // Stop preview stream after permission granted (we’ll re-open properly)
      s.getTracks().forEach((t) => t.stop());
      await enumerateDevices();
    } catch (err) {
      console.error("Camera permission denied:", err);
      setError("Camera permission denied or unavailable.");
      setPermissionGranted(false);
    }
  }, []);

  // ✅ Enumerate available cameras
  const enumerateDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter((d) => d.kind === "videoinput");
      setCameras(cams);
      if (!selectedCamera && cams.length > 0) {
        setSelectedCamera(cams[0].deviceId);
      }
    } catch (err) {
      console.error("Error listing devices:", err);
      setError("Could not list cameras.");
    }
  }, [selectedCamera]);

  // ✅ Handle permission state when component mounts
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "camera" })
        .then((status) => {
          if (status.state === "granted") {
            setPermissionGranted(true);
            enumerateDevices();
          } else if (status.state === "prompt") {
            setPermissionGranted(false);
          } else if (status.state === "denied") {
            setError("Camera access denied. Check browser settings.");
          }
        })
        .catch(() => {
          // Fallback — permissions API not supported
          setPermissionGranted(false);
        });
    } else {
      setPermissionGranted(false);
    }
  }, [enumerateDevices]);

  // ✅ Start selected camera stream
  const startCamera = async () => {
    if (!selectedCamera) return;

    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedCamera } },
        audio: false,
      });
      if (stream) stream.getTracks().forEach((t) => t.stop());
      setStream(s);
      videoRef.current.srcObject = s;
      onStream(s);
      setError(null);
    } catch (err) {
      console.error("Error starting camera:", err);
      setError("Could not start camera.");
    }
  };

  // ✅ Stop current stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
      onStream(null);
    }
  };

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

  // ✅ Re-enumerate when devices change
  useEffect(() => {
    const handler = () => enumerateDevices();
    navigator.mediaDevices.addEventListener("devicechange", handler);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handler);
    };
  }, [enumerateDevices]);

  // 🧱 UI rendering
  if (!permissionGranted) {
    return (
      <div style={{ padding: 16, background: "#101826", color: "#eee", borderRadius: 8 }}>
        <h2>🎥 Camera Test</h2>
        <p>Camera access not yet granted.</p>
        {error && <p style={{ color: "salmon" }}>{error}</p>}
        <button
          onClick={requestPermission}
          style={{
            padding: "8px 12px",
            background: "#06b6d4",
            border: "none",
            borderRadius: 6,
            color: "#001",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Grant Camera Access
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, background: "#101826", color: "#eee", borderRadius: 8 }}>
      <h2>📸 Video Test</h2>

      <div style={{ marginBottom: 12 }}>
        <label>
          Select Camera:
          <select
            style={{ marginLeft: 8, padding: 4, borderRadius: 4 }}
            value={selectedCamera || ""}
            onChange={(e) => setSelectedCamera(e.target.value)}
          >
            {cameras.length === 0 && <option>No cameras found</option>}
            {cameras.map((cam) => (
              <option key={cam.deviceId} value={cam.deviceId}>
                {cam.label || `Camera ${cam.deviceId}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginBottom: 12 }}>
        {!stream ? (
          <button
            onClick={startCamera}
            style={{
              padding: "8px 12px",
              background: "#06b6d4",
              border: "none",
              borderRadius: 6,
              color: "#001",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Start Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            style={{
              padding: "8px 12px",
              background: "#ef4444",
              border: "none",
              borderRadius: 6,
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Stop Camera
          </button>
        )}
      </div>

      {error && <p style={{ color: "salmon" }}>{error}</p>}

      <div>
        {stream ? (
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
            }}
          />
        ) : (
          <div
            style={{
              width: "320px",
              height: "240px",
              background: "#000",
              borderRadius: "8px",
              color: "#888",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            No video stream active
          </div>
        )}
      </div>
    </div>
  );
}
