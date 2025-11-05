import { useState, useEffect, useCallback } from 'react';

export default function useMediaDevices() {
  const [devices, setDevices] = useState({
    cameras: [],
    microphones: [],
    speakers: []
  });

  const [selected, setSelected] = useState({
    camera: null,
    microphone: null,
    speaker: null
  });

  const [stream, setStream] = useState(null);

  // 🔍 Enumerate devices
  const loadDevices = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices({
        cameras: allDevices.filter(d => d.kind === 'videoinput'),
        microphones: allDevices.filter(d => d.kind === 'audioinput'),
        speakers: allDevices.filter(d => d.kind === 'audiooutput')
      });
    } catch (err) {
      console.error('Failed to list devices:', err);
    }
  }, []);

  // 🎥 Get new media stream when selected devices change
  const updateStream = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) return;

    const constraints = {
      video: selected.camera ? { deviceId: { exact: selected.camera } } : true,
      audio: selected.microphone ? { deviceId: { exact: selected.microphone } } : true
    };

    try {
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
    } catch (err) {
      console.error('Error accessing media:', err);
    }
  }, [selected.camera, selected.microphone]);

  // 📡 Select a device
  const selectDevice = useCallback((type, deviceId) => {
    setSelected(prev => ({ ...prev, [type]: deviceId }));
  }, []);

  // 🔄 Load devices on mount
  useEffect(() => {
    loadDevices();

    // Listen for hardware changes (e.g. plugging in a webcam)
    navigator.mediaDevices.addEventListener('devicechange', loadDevices);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', loadDevices);
    };
  }, [loadDevices]);

  // 🎛️ Update stream when selections change
  useEffect(() => {
    updateStream();
    // Cleanup old stream when switching
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [updateStream]);

  return {
    devices,
    selected,
    stream,
    selectDevice
  };
}


/* 
Why "useMediaDevice.jsx"

A) List of available devices
B) A selected device state
C) Stream management (camera/mic preview)
D) automatic refresh when devices change (e.g. plug in a webcam)
*/