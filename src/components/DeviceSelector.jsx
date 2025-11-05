export default function DeviceSelector({ label, type, devices = [], selectedId, onSelect }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label style={{ fontWeight: "600" }}>{label}</label>
      <select
        value={selectedId || ""}
        onChange={(e) => onSelect(type, e.target.value)}
        style={{
          padding: "0.5rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      >
        <option value="">Select {label} source</option>
        {devices.length > 0 ? (
          devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || `${label} ${d.deviceId}`}
            </option>
          ))
        ) : (
          <option disabled>No {label.toLowerCase()} found</option>
        )}
      </select>
    </div>
  );
}
