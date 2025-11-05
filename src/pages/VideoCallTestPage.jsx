import { useEffect, useState } from 'react';
import { listDevices, getMediaStream } from '../controllers/DeviceController';
import DeviceSelector from '../components/DeviceSelector';
import VideoPreview from '../components/VideoPreview';
import AudioTest from '../components/AudioTest';

export default function MediaTestPage() {
  const [devices, setDevices] = useState({ cameras: [], microphones: [], speakers: [] });
  const [selected, setSelected] = useState({});
  const [stream, setStream] = useState(null);

  useEffect(() => {
    listDevices().then(setDevices);
  }, []);

  useEffect(() => {
    if (selected.camera || selected.mic)
      getMediaStream(selected.camera, selected.mic).then(setStream);
  }, [selected]);

  const handleSelect = (type, id) => setSelected(prev => ({ ...prev, [type]: id }));

  return (
    <div className="p-4">
      <h1>🎥 Media Test Page</h1>
      <DeviceSelector devices={devices} onSelect={handleSelect} />
      <VideoPreview stream={stream} />
      <AudioTest outputId={selected.speaker} />
    </div>
  );
}
