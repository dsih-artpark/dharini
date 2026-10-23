import {
  Download,
  Flame,
  Map as MapIcon,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import type React from "react";
import type {
  BirdObservation,
  PoultryFarm,
  Site,
  Wetland,
} from "@/src/app/(dashboard)/geolens/types";
import type { WeatherData } from "@/src/app/(dashboard)/geolens/loader";
import { WeatherMiniCard } from "./WeatherCards";

type ActiveSlot = "A" | "B";
type ActiveTab = "overview" | "birds" | "farms";

interface SpeciesSummary {
  name: string;
  count: number;
  percentage: number;
}

interface NearestWetland {
  distKm: number;
  wetland: Wetland;
}

interface SiteComparisonPanelProps {
  activeSlot: ActiveSlot;
  setActiveSlot: (slot: ActiveSlot) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  siteA: Site | null;
  siteB: Site | null;
  birdsA: BirdObservation[];
  birdsB: BirdObservation[];
  weatherA: WeatherData | null;
  weatherB: WeatherData | null;
  panelSearchA: string;
  panelSearchB: string;
  setPanelSearchA: (value: string) => void;
  setPanelSearchB: (value: string) => void;
  handlePanelSearch: (
    e: React.KeyboardEvent,
    slot: ActiveSlot,
    query: string,
    setQuery: (value: string) => void,
  ) => void;
  resetAll: () => void;
  setShowComparison: (show: boolean) => void;
  nearestA: NearestWetland | null;
  nearestB: NearestWetland | null;
  wetlandAreaA: number;
  wetlandAreaB: number;
  poultryDensityA: number;
  poultryDensityB: number;
  totalBirdsA: number;
  totalBirdsB: number;
  speciesListA: SpeciesSummary[];
  speciesListB: SpeciesSummary[];
  farmsA: PoultryFarm[];
  farmsB: PoultryFarm[];
  radius: number;
  downloadComparisonReport: () => void;
}

function SiteSlotCard({
  slot,
  activeSlot,
  site,
  panelSearch,
  setPanelSearch,
  setActiveSlot,
  handlePanelSearch,
}: {
  slot: ActiveSlot;
  activeSlot: ActiveSlot;
  site: Site | null;
  panelSearch: string;
  setPanelSearch: (value: string) => void;
  setActiveSlot: (slot: ActiveSlot) => void;
  handlePanelSearch: SiteComparisonPanelProps["handlePanelSearch"];
}) {
  const isActive = activeSlot === slot;
  const color = slot === "A" ? "#3498db" : "#27ae60";
  const activeBg = slot === "A" ? "#f0f8ff" : "#e9f7ef";

  return (
    <div
      onClick={() => setActiveSlot(slot)}
      style={{
        flex: 1,
        minWidth: 0,
        padding: "10px",
        borderRadius: "8px",
        borderTop: isActive ? `2px solid ${color}` : "1px solid #ebf0f2",
        borderRight: isActive ? `2px solid ${color}` : "1px solid #ebf0f2",
        borderBottom: isActive ? `2px solid ${color}` : "1px solid #ebf0f2",
        borderLeft: `4px solid ${color}`,
        background: isActive ? activeBg : "white",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 800,
          color,
          textTransform: "uppercase",
          marginBottom: "4px",
        }}
      >
        Site {slot}
      </div>
      {!isActive && (
        <div
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: site ? "#2c3e50" : "#bdc3c7",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={site?.name}
        >
          {site
            ? site.name.split(",").length > 2
              ? site.name.split(",").slice(0, 2).join(",")
              : site.name
            : "Click map to select"}
        </div>
      )}
      {isActive && (
        <>
          {site && (
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#2c3e50",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginBottom: "4px",
              }}
              title={site?.name}
            >
              {site.name.split(",").slice(0, 2).join(",")}
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "white",
              borderRadius: "4px",
              border: "1px solid #bdc3c7",
              padding: "2px 6px",
            }}
          >
            <Search size={10} color="#7f8c8d" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search..."
              style={{
                width: "100%",
                minWidth: 0,
                border: "none",
                outline: "none",
                fontSize: "11px",
                marginLeft: "4px",
                background: "transparent",
              }}
              value={panelSearch}
              onChange={(e) => setPanelSearch(e.target.value)}
              onKeyDown={(e) =>
                handlePanelSearch(e, slot, panelSearch, setPanelSearch)
              }
            />
          </div>
        </>
      )}
    </div>
  );
}

export function SiteComparisonPanel(props: SiteComparisonPanelProps) {
  const {
    activeSlot,
    setActiveSlot,
    activeTab,
    setActiveTab,
    siteA,
    siteB,
    birdsA,
    birdsB,
    weatherA,
    weatherB,
    panelSearchA,
    panelSearchB,
    setPanelSearchA,
    setPanelSearchB,
    handlePanelSearch,
    resetAll,
    setShowComparison,
    nearestA,
    nearestB,
    wetlandAreaA,
    wetlandAreaB,
    poultryDensityA,
    poultryDensityB,
    totalBirdsA,
    totalBirdsB,
    speciesListA,
    speciesListB,
    farmsA,
    farmsB,
    radius,
    downloadComparisonReport,
  } = props;

  return (
    <aside className="comparison-panel">
      <div className="panel-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Site Comparison
          </h2>
          <X
            size={18}
            style={{ cursor: "pointer" }}
            onClick={() => setShowComparison(false)}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <p style={{ margin: 0, fontSize: "11px", color: "#7f8c8d" }}>
            Select two sites to compare
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f8f9fa",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "15px",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                color: "#95a5a6",
                marginBottom: "6px",
                fontWeight: 700,
              }}
            >
              Map Click Assignment
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={activeSlot === "A"}
                  onChange={() => setActiveSlot("A")}
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                    accentColor: "#3498db",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: activeSlot === "A" ? 800 : 500,
                    color: activeSlot === "A" ? "#3498db" : "#bdc3c7",
                  }}
                >
                  Site A
                </span>
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={activeSlot === "B"}
                  onChange={() => setActiveSlot("B")}
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                    accentColor: "#27ae60",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: activeSlot === "B" ? 800 : 500,
                    color: activeSlot === "B" ? "#27ae60" : "#bdc3c7",
                  }}
                >
                  Site B
                </span>
              </label>
            </div>
          </div>
          <RefreshCw
            size={16}
            style={{ color: "#bdc3c7", cursor: "pointer" }}
            onClick={resetAll}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <SiteSlotCard
            slot="A"
            activeSlot={activeSlot}
            site={siteA}
            panelSearch={panelSearchA}
            setPanelSearch={setPanelSearchA}
            setActiveSlot={setActiveSlot}
            handlePanelSearch={handlePanelSearch}
          />
          <SiteSlotCard
            slot="B"
            activeSlot={activeSlot}
            site={siteB}
            panelSearch={panelSearchB}
            setPanelSearch={setPanelSearchB}
            setActiveSlot={setActiveSlot}
            handlePanelSearch={handlePanelSearch}
          />
        </div>
      </div>

      <div className="panel-content">
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #f0f0f0",
            marginBottom: "15px",
          }}
        >
          {["Overview", "Birds", "Farms"].map((t) => (
            <div
              key={t}
              onClick={() => setActiveTab(t.toLowerCase() as ActiveTab)}
              style={{
                padding: "8px 12px",
                fontSize: "12px",
                cursor: "pointer",
                borderBottom:
                  activeTab === t.toLowerCase() ? "2px solid #3498db" : "none",
                color: activeTab === t.toLowerCase() ? "#3498db" : "#7f8c8d",
                fontWeight: 600,
              }}
            >
              {t}
            </div>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Site A</th>
                  <th>Site B</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="metric-label">Bird Density</td>
                  <td>
                    {siteA ? (
                      birdsA.length > 50 ? (
                        <span className="status-badge status-high">High</span>
                      ) : birdsA.length > 10 ? (
                        <span className="status-badge status-medium">Med</span>
                      ) : (
                        <span className="status-badge status-low">Low</span>
                      )
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    {siteB ? (
                      birdsB.length > 50 ? (
                        <span className="status-badge status-high">High</span>
                      ) : birdsB.length > 10 ? (
                        <span className="status-badge status-medium">Med</span>
                      ) : (
                        <span className="status-badge status-low">Low</span>
                      )
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="metric-label">Species Count</td>
                  <td>
                    {siteA ? new Set(birdsA.map((b) => b.comName)).size : 0}
                  </td>
                  <td>
                    {siteB ? new Set(birdsB.map((b) => b.comName)).size : 0}
                  </td>
                </tr>
                <tr>
                  <td className="metric-label">Total Bird Count</td>
                  <td>{siteA ? totalBirdsA.toLocaleString() : 0}</td>
                  <td>{siteB ? totalBirdsB.toLocaleString() : 0}</td>
                </tr>
                <tr>
                  <td className="metric-label">Nearest Wetland</td>
                  <td>
                    {siteA && nearestA ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {nearestA.distKm.toFixed(1)} km{" "}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&origin=${siteA.end[0]},${siteA.end[1]}&destination=${nearestA.wetland.lat},${nearestA.wetland.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Get Directions"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <MapIcon
                            size={14}
                            style={{ color: "#3498db", cursor: "pointer" }}
                          />
                        </a>
                      </div>
                    ) : (
                      "0.0 km"
                    )}
                  </td>
                  <td>
                    {siteB && nearestB ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {nearestB.distKm.toFixed(1)} km{" "}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&origin=${siteB.end[0]},${siteB.end[1]}&destination=${nearestB.wetland.lat},${nearestB.wetland.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Get Directions"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <MapIcon
                            size={14}
                            style={{ color: "#27ae60", cursor: "pointer" }}
                          />
                        </a>
                      </div>
                    ) : (
                      "0.0 km"
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="metric-label">
                    Total Wetland Area ({radius}km)
                  </td>
                  <td>{siteA ? `${wetlandAreaA.toFixed(1)} Ha` : "0.0 Ha"}</td>
                  <td>{siteB ? `${wetlandAreaB.toFixed(1)} Ha` : "0.0 Ha"}</td>
                </tr>
                <tr>
                  <td className="metric-label">Poultry Farms ({radius}km)</td>
                  <td>{siteA ? poultryDensityA : 0}</td>
                  <td>{siteB ? poultryDensityB : 0}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    color: "#3498db",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    borderBottom: "1px solid #ebf0f2",
                    paddingBottom: "4px",
                  }}
                >
                  Site A Weather
                </h4>
                {siteA && weatherA ? (
                  <WeatherMiniCard weather={weatherA} />
                ) : (
                  <div
                    style={{
                      padding: "8px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                      textAlign: "center",
                      fontSize: "11px",
                      color: "#95a5a6",
                    }}
                  >
                    Weather unavailable
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    color: "#27ae60",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    borderBottom: "1px solid #ebf0f2",
                    paddingBottom: "4px",
                  }}
                >
                  Site B Weather
                </h4>
                {siteB && weatherB ? (
                  <WeatherMiniCard weather={weatherB} />
                ) : (
                  <div
                    style={{
                      padding: "8px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                      textAlign: "center",
                      fontSize: "11px",
                      color: "#95a5a6",
                    }}
                  >
                    Weather unavailable
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "birds" && (
          <div style={{ display: "flex", gap: "20px", padding: "5px" }}>
            <SpeciesColumn
              title="Site A Species"
              color="#3498db"
              speciesList={speciesListA}
            />
            <SpeciesColumn
              title="Site B Species"
              color="#27ae60"
              speciesList={speciesListB}
            />
          </div>
        )}

        {activeTab === "farms" && (
          <div style={{ display: "flex", gap: "20px", padding: "5px" }}>
            <FarmColumn
              title="Site A Farms"
              color="#3498db"
              iconColor="#e74c3c"
              farms={farmsA}
              radius={radius}
            />
            <FarmColumn
              title="Site B Farms"
              color="#27ae60"
              iconColor="#27ae60"
              farms={farmsB}
              radius={radius}
            />
          </div>
        )}

        <button
          onClick={downloadComparisonReport}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: "white",
            border: "1px solid #dfe6e9",
            borderRadius: "8px",
            color: "#2c3e50",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          View Detailed Comparison Report <Download size={14} />
        </button>
      </div>
    </aside>
  );
}

function SpeciesColumn({
  title,
  color,
  speciesList,
}: {
  title: string;
  color: string;
  speciesList: SpeciesSummary[];
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "#f8f9fa",
        borderRadius: "10px",
        padding: "15px",
        border: "1px solid #ebf0f2",
      }}
    >
      <h4
        style={{
          color,
          fontSize: "11px",
          textTransform: "uppercase",
          marginBottom: "12px",
          borderBottom: `2px solid ${color}`,
          paddingBottom: "6px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {title} <span>{speciesList.length}</span>
      </h4>
      <div
        style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "5px" }}
        className="custom-scrollbar"
      >
        {speciesList.map((item) => (
          <div
            key={item.name}
            style={{
              padding: "8px 10px",
              fontSize: "12px",
              color: "#2c3e50",
              background: "white",
              marginBottom: "4px",
              borderRadius: "6px",
              border: "1px solid #f1f3f5",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: color,
                  flexShrink: 0,
                  marginTop: "6px",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    color: "#2c3e50",
                    overflowWrap: "break-word",
                    wordBreak: "normal",
                    lineHeight: "1.4",
                  }}
                  title={item.name}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#7f8c8d",
                    marginTop: "2px",
                  }}
                >
                  {item.count}{" "}
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#95a5a6",
                      fontWeight: 400,
                    }}
                  >
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {speciesList.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#95a5a6",
              padding: "40px 0",
              fontSize: "12px",
            }}
          >
            No bird data recorded for this site.
          </div>
        )}
      </div>
    </div>
  );
}

function FarmColumn({
  title,
  color,
  iconColor,
  farms,
  radius,
}: {
  title: string;
  color: string;
  iconColor: string;
  farms: PoultryFarm[];
  radius: number;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "#f8f9fa",
        borderRadius: "10px",
        padding: "15px",
        border: "1px solid #ebf0f2",
      }}
    >
      <h4
        style={{
          color,
          fontSize: "11px",
          textTransform: "uppercase",
          marginBottom: "12px",
          borderBottom: `2px solid ${color}`,
          paddingBottom: "6px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {title} <span>{farms.length}</span>
      </h4>
      <div
        style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "5px" }}
        className="custom-scrollbar"
      >
        {farms.map((f) => (
          <div
            key={f.id}
            style={{
              padding: "8px 10px",
              fontSize: "12px",
              color: "#2c3e50",
              background: "white",
              marginBottom: "4px",
              borderRadius: "6px",
              border: "1px solid #f1f3f5",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Flame size={12} color={iconColor} />
            {f.name}
          </div>
        ))}
        {farms.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#95a5a6",
              padding: "40px 0",
              fontSize: "12px",
            }}
          >
            No poultry farms within {radius}km.
          </div>
        )}
      </div>
    </div>
  );
}
