export default function PageHeader({ title, children, right }) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        backgroundColor: "#fff",
        zIndex: 100,
        padding: "0 0 10px",
        marginBottom: 20,
        borderBottom: "3px solid #4ea1f3",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            padding: 0,
            fontSize: "28px",
            fontWeight: "700",
            color: "#222",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>
        {children && (
          <div style={{ fontSize: 14, marginTop: 4, color: "#444" }}>
            {children}
          </div>
        )}
      </div>

      {/* Универсальная правая часть */}
      {right && <div style={{ marginLeft: 16 }}>{right}</div>}
    </div>
  );
}
