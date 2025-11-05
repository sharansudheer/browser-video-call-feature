export default function DeviceSelector({ devices, onSelect }) {
  return (
    <div className="device-selector">
      <label>Camera:</label>
      <select onChange={e => onSelect('camera', e.target.value)}>
        {devices.cameras.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label}</option>)}
      </select>

      <label>Microphone:</label>
      <select onChange={e => onSelect('mic', e.target.value)}>
        {devices.microphones.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label}</option>)}
      </select>

      <label>Speaker:</label>
      <select onChange={e => onSelect('speaker', e.target.value)}>
        {devices.speakers.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label}</option>)}
      </select>
    </div>
  );
}
