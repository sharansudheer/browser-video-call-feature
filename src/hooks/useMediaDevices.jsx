import { useEffect, useState } from "react";
import { listDevices, getMediaStream } from "../controllers/DeviceController";

export default function useMediaDevices() {
  const [devices, setDevices] = useState({ cameras: [], microphones: [], speakers: [] });
  const [selected, setSelected] = useState({ camera: "", mic: "", speaker: "" });
  const [stream, setStream] = useState(null);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  // 🔹 Refresh device list
  const refreshDevices = async () => {
    try {
      const allDevices = await listDevices();
      setDevices(allDevices);

      setSelected((prev) => ({
        camera: prev.camera || allDevices.cameras[0]?.deviceId || "",
        mic: prev.mic || allDevices.microphones[0]?.deviceId || "",
        speaker: prev.speaker || allDevices.speakers[0]?.deviceId || "",
      }));
    } catch (err) {
      console.error("Failed to refresh devices:", err);
    }
  };

  // 🔹 Handle device changes (e.g., plug/unplug)
  useEffect(() => {
    navigator.mediaDevices.addEventListener("devicechange", refreshDevices);
    return () => navigator.mediaDevices.removeEventListener("devicechange", refreshDevices);
  }, []);

  // 🔹 Request permissions separately
  const requestCameraAccess = async () => {
    try {
      const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(camStream);
      setIsVideoActive(true);
      await refreshDevices();
    } catch (err) {
      console.warn("Camera access denied:", err);
    }
  };

  const requestMicAccess = async () => {
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(micStream);
      setIsAudioActive(true);
      await refreshDevices();
    } catch (err) {
      console.warn("Microphone access denied:", err);
    }
  };

  // 🔹 Select device and restart stream if needed
  const selectDevice = async (type, id) => {
    setSelected((prev) => ({ ...prev, [type]: id }));

    if (type === "camera" && id) {
      const newStream = await getMediaStream(id, selected.mic);
      setStream(newStream);
      setIsVideoActive(true);
    }

    if (type === "mic" && id) {
      const newStream = await getMediaStream(selected.camera, id);
      setStream(newStream);
      setIsAudioActive(true);
    }
  };

  // 🔹 Start combined call
  const startCall = async () => {
    try {
      const newStream = await getMediaStream(selected.camera, selected.mic);
      setStream(newStream);
      setIsVideoActive(true);
      setIsAudioActive(true);
    } catch (err) {
      console.error("Error starting stream:", err);
      alert("Failed to start media stream. Check permissions.");
    }
  };

  // 🔹 Stop video completely
  const stopVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => track.stop());
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
      setIsVideoActive(false);
      setSelected((prev) => ({ ...prev, camera: "" }));
    }
  };

  // 🔹 Stop audio completely
  const stopAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => track.stop());
      setIsAudioActive(false);
      setSelected((prev) => ({ ...prev, mic: "" }));
    }
  };

  return {
    devices,
    selected,
    selectDevice,
    stream,
    isVideoActive,
    isAudioActive,
    requestCameraAccess,
    requestMicAccess,
    startCall,
    stopVideo,
    stopAudio,
  };
}
