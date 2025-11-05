// src/controllers/DeviceController.js
export async function listDevices() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return {
      cameras: devices.filter(d => d.kind === 'videoinput'),
      microphones: devices.filter(d => d.kind === 'audioinput'),
      speakers: devices.filter(d => d.kind === 'audiooutput'),
    };
  } catch (err) {
    console.error('Error listing devices:', err);
    return { cameras: [], microphones: [], speakers: [] };
  }
}

export async function getMediaStream(cameraId, micId) {
  try {
    const constraints = {
      video: cameraId ? { deviceId: { exact: cameraId } } : true,
      audio: micId ? { deviceId: { exact: micId } } : true,
    };
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (err) {
    console.error('Error getting media stream:', err);
    return null;
  }
}
