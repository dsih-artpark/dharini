import React from "react";

interface HelpPanelProps {
  onClose: () => void;
}

export function HelpPanel({ onClose }: HelpPanelProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "60px",
        right: "16px",
        width: "320px",
        maxHeight: "80vh",
        overflowY: "auto",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        zIndex: 3000,
        fontFamily: "'Inter', sans-serif",
        border: "1px solid #e1e2e6",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1a252f 0%, #2c3e50 100%)",
          padding: "14px 18px",
          borderRadius: "12px 12px 0 0",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: "14px", fontWeight: 700 }}>📖 How to Use</div>
          <div style={{ fontSize: "9px", opacity: 0.7, marginTop: "2px" }}>
            Quick guide to GeoLens
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "white",
            borderRadius: "4px",
            cursor: "pointer",
            padding: "2px 8px",
            fontSize: "14px",
          }}
        >
          ✕
        </button>
      </div>
      <div
        style={{
          padding: "14px 18px",
          fontSize: "11px",
          color: "#2c3e50",
          lineHeight: 1.7,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color: "#2980b9",
            marginBottom: "6px",
            fontSize: "12px",
          }}
        >
          🗺 Navigate the Map
        </div>
        <ul style={{ margin: "0 0 12px", paddingLeft: "18px" }}>
          <li>
            <strong>Search bar</strong> — Search any address or city using the
            search bar on the map
          </li>
          <li>
            <strong>Click anywhere</strong> — Click any point on the map to get
            weather, bird data, and nearest wetland info
          </li>
          <li>
            <strong>Zoom</strong> — Use scroll or pinch to zoom in/out
          </li>
        </ul>

        <div
          style={{
            fontWeight: 700,
            color: "#16a085",
            marginBottom: "6px",
            fontSize: "12px",
          }}
        >
          🌊 Wetland Analysis
        </div>
        <ul style={{ margin: "0 0 12px", paddingLeft: "18px" }}>
          <li>
            <strong>Select State</strong> — Choose a state from the dropdown to
            see its wetlands
          </li>
          <li>
            <strong>Select Wetland</strong> — Pick a wetland to fly to it and
            view bird data within the search radius
          </li>
          <li>
            Clicking or searching shows the <strong>nearest wetland</strong>{" "}
            with distance, direction, weather, and bird species
          </li>
        </ul>

        <div
          style={{
            fontWeight: 700,
            color: "#e67e22",
            marginBottom: "6px",
            fontSize: "12px",
          }}
        >
          🔬 Compare Two Sites
        </div>
        <ul style={{ margin: "0 0 12px", paddingLeft: "18px" }}>
          <li>
            Toggle between <strong style={{ color: "#2980b9" }}>Site A</strong>{" "}
            and <strong style={{ color: "#27ae60" }}>Site B</strong> using the
            Compare buttons
          </li>
          <li>
            Select different wetlands or click map locations for each site
          </li>
          <li>
            The bottom-left dashboard shows bird counts, weather, and species
            for both sites side by side
          </li>
        </ul>

        <div
          style={{
            fontWeight: 700,
            color: "#9b59b6",
            marginBottom: "6px",
            fontSize: "12px",
          }}
        >
          🐔 Poultry Farms
        </div>
        <ul style={{ margin: "0 0 12px", paddingLeft: "18px" }}>
          <li>Purple dots on the map represent poultry farms</li>
          <li>
            Click on any farm to select it as a site for bird flu risk analysis
          </li>
          <li>Farms near both Site A and Site B are always visible</li>
        </ul>

        <div
          style={{
            fontWeight: 700,
            color: "#e74c3c",
            marginBottom: "6px",
            fontSize: "12px",
          }}
        >
          🐦 Bird Data
        </div>
        <ul style={{ margin: "0 0 12px", paddingLeft: "18px" }}>
          <li>
            Bird observations come from <strong>eBird</strong> (past 30 days)
          </li>
          <li>
            Adjust the <strong>Radius</strong> slider to widen or narrow the
            search area
          </li>
          <li>
            Use the <strong>Species List</strong> dropdown to view individual
            species and their counts
          </li>
        </ul>

        <div
          style={{
            fontWeight: 700,
            color: "#1a6b9e",
            marginBottom: "6px",
            fontSize: "12px",
          }}
        >
          🌤 Weather
        </div>
        <ul style={{ margin: "0 0 4px", paddingLeft: "18px" }}>
          <li>
            Current weather is shown from <strong>OpenWeatherMap</strong>
          </li>
          <li>
            Historical data (past 30 days max/min, rainfall, humidity) is from{" "}
            <strong>Open-Meteo</strong>
          </li>
        </ul>

        <div
          style={{
            borderTop: "1px solid #ecf0f1",
            paddingTop: "10px",
            marginTop: "10px",
            fontSize: "9px",
            color: "#95a5a6",
            textAlign: "center",
          }}
        >
          Use layer controls (top-right of map) to toggle wetland boundaries,
          poultry farms, heatmap, and species labels.
        </div>
      </div>
    </div>
  );
}

interface MapLegendProps {
  isComparisonActive?: boolean;
}

export function MapLegend({ isComparisonActive }: MapLegendProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      style={{
        position: "absolute",
        background: "rgba(255,255,255,0.95)",
        borderRadius: "10px",
        padding: isOpen ? "10px 14px" : "8px 12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        zIndex: 1500,
        fontFamily: "'Inter', sans-serif",
        fontSize: "10px",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        width: isOpen ? "150px" : "auto",
        ...(isComparisonActive
          ? { bottom: "30px", right: "20px", left: "auto" }
          : { bottom: "30px", left: "20px", right: "auto" }),
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "10px",
          color: "#2c3e50",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
          letterSpacing: "0.3px",
          marginBottom: isOpen ? "8px" : "0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "12px" }}>📊</span>
          <span>LEGEND</span>
        </div>
        <span
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
            fontSize: "10px",
            opacity: 0.6,
          }}
        >
          ▼
        </span>
      </div>

      {isOpen && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            paddingTop: "4px",
            borderTop: "1px solid rgba(0,0,0,0.05)",
            animation: "legendFadeIn 0.2s ease-out",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#e74c3c",
                border: "2px solid white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            />
            <span>Search / Click Pin</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                background: "#2980b9",
              }}
            />
            <span style={{ color: "#2980b9", fontWeight: 600 }}>Site A</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                background: "#27ae60",
              }}
            />
            <span style={{ color: "#27ae60", fontWeight: 600 }}>Site B</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{ fontSize: "16px", lineHeight: 1 }}
              role="img"
              aria-label="Poultry farm"
            >
              🐔
            </span>
            <span>Poultry Farm</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{ fontSize: "16px", lineHeight: 1 }}
              role="img"
              aria-label="Cattle market"
            >
              🐄
            </span>
            <span>Cattle Market</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                background: "#16a085",
              }}
            />
            <span>Nearest Wetland</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                background:
                  "linear-gradient(90deg, blue, cyan, lime, yellow, red)",
              }}
            />
            <span>Bird Heatmap</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "10px",
                height: "4px",
                borderTop: "2px dashed #f39c12",
              }}
            />
            <span>Route to Wetland</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                background: "#add8e6",
                border: "1px solid #3498db",
              }}
            />
            <span>Water Boundaries</span>
          </div>
          <style>{`
            @keyframes legendFadeIn {
              from { opacity: 0; transform: translateY(-5px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

interface WelcomeToastProps {
  onClose: () => void;
}

export function WelcomeToast({ onClose }: WelcomeToastProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(26,37,47,0.95)",
        color: "white",
        borderRadius: "12px",
        padding: "14px 22px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        zIndex: 2500,
        fontFamily: "'Inter', sans-serif",
        maxWidth: "440px",
        textAlign: "center",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
        👋 Welcome to GeoLens!
      </div>
      <div style={{ fontSize: "11px", opacity: 0.85, lineHeight: 1.6 }}>
        <strong>Click anywhere on the map</strong> or use the{" "}
        <strong>search bar</strong> to start analyzing bird populations,
        weather, and nearby wetlands. Use the header controls to select states
        and compare sites.
      </div>
      <button
        onClick={onClose}
        style={{
          marginTop: "10px",
          background: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "6px 20px",
          fontSize: "11px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "background 0.2s",
        }}
      >
        Got it!
      </button>
    </div>
  );
}

export function AppFooter() {
  return (
    <div
      style={{
        padding: "4px 20px",
        background: "#1a252f",
        color: "rgba(255,255,255,0.45)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "9px",
        fontFamily: "'Inter', sans-serif",
        zIndex: 1001,
      }}
    >
      <span>GeoLens</span>
      <span>Data: eBird · OpenWeatherMap · Open-Meteo · OpenStreetMap</span>
    </div>
  );
}
