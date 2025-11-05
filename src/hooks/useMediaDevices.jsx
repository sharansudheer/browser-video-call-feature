import { useEffect, useState } from "react";
import { listDevices, getMediaStream } from "../controllers/DeviceController";

export default function useMediaDevices() {
  const [devices, setDevices] = useState({ cameras: [], microphones: [], speakers: [] });
  const [selected, setSelected] = useState({ camera: "", mic: "", speaker: "" });
  const [stream, setStream] = useState(null);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  // 🔹 Refresh available devices
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

  // 🔹 Request permissions sequentially (camera → mic)
  const requestPermissionsSequentially = async () => {
    try {
      // Ask for camera access first
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("Camera permission granted");

      // Ask for microphone access next
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted");

      // Merge both streams
      const combined = new MediaStream([
        ...videoStream.getTracks(),
        ...audioStream.getTracks(),
      ]);

      setStream(combined);
      setIsVideoActive(true);
      setIsAudioActive(true);

      await refreshDevices();
    } catch (err) {
      console.warn("Permission denied or failed:", err);
    }
  };

  useEffect(() => {
    requestPermissionsSequentially();
    navigator.mediaDevices.addEventListener("devicechange", refreshDevices);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", refreshDevices);
    };
  }, []);

  // 🔹 Device selection: restart stream if changed
  const selectDevice = async (type, id) => {
    setSelected((prev) => ({ ...prev, [type]: id }));
    if (type === "camera" || type === "mic") {
      const newStream = await getMediaStream(
        type === "camera" ? id : selected.camera,
        type === "mic" ? id : selected.mic
      );
      setStream(newStream);
      setIsVideoActive(true);
      setIsAudioActive(true);
    }
  };

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

  // 🔹 Stop camera fully
  const stopVideo = () => {
  if (stream) {
    // Stop and remove all video tracks
    stream.getVideoTracks().forEach(track => {
      track.stop();
      stream.removeTrack(track);
    });

    // If no audio tracks remain, clear the entire stream
    const remainingTracks = stream.getTracks();
    if (remainingTracks.length === 0) {
      setStream(null);
    } else {
      setStream(new MediaStream(remainingTracks));
    }
  }

  // Mark video as inactive
  setIsVideoActive(false);

  // Also clear the video element manually (extra safety)
  const videos = document.querySelectorAll("video");
  videos.forEach(v => {
    v.srcObject = null;
  });
  setIsVideoActive(false);
};

  // 🔹 Stop microphone fully
  const stopAudio = () => {
  if (stream) {
    stream.getAudioTracks().forEach(track => {
      track.stop();
      stream.removeTrack(track);
    });
    setStream(prev => {
      const newStream = new MediaStream(prev?.getVideoTracks() || []);
      return newStream.getTracks().length ? newStream : null;
    });
  }
  setIsAudioActive(false);
};

  return {
    devices,
    selected,
    selectDevice,
    stream,
    isVideoActive,
    isAudioActive,
    startCall,
    stopVideo,
    stopAudio,
  };
}
