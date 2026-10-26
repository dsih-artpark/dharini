import {
  Crosshair,
  Flame,
  Info,
  Layers,
  Map as MapIcon,
  MapPin,
  Menu,
  MousePointer2,
  RefreshCw,
  Store,
} from "lucide-react";
import { RadiusSlider } from "./RadiusSlider";

interface DashboardSidebarProps {
  activeBaseMap: string;
  setActiveBaseMap: (value: string) => void;
  showPoultryLayer: boolean;
  setShowPoultryLayer: (value: boolean) => void;
  showCattleMarketLayer: boolean;
  setShowCattleMarketLayer: (value: boolean) => void;
  /** Per-layer fetch state - shows a spinner on the toggle that is loading,
   *  so clicking a layer is acknowledged before any marker can appear. */
  isPoultryLoading?: boolean;
  isCattleMarketLoading?: boolean;
  showBuffer: boolean;
  setShowBuffer: (value: boolean) => void;
  radius: number;
  setRadius: (value: number) => void;
  showBufferWetlands: boolean;
  setShowBufferWetlands: (value: boolean) => void;
  showBufferPoultry: boolean;
  setShowBufferPoultry: (value: boolean) => void;
  showHeatmap: boolean;
  setShowHeatmap: (value: boolean) => void;
  resetAll: () => void;
  setShowSidebar: (value: boolean) => void;
  showSurveillanceSites?: boolean;
  setShowSurveillanceSites?: (value: boolean) => void;
  closed?: boolean;
}

export function DashboardSidebar(props: DashboardSidebarProps) {
  const {
    activeBaseMap,
    setActiveBaseMap,
    showPoultryLayer,
    setShowPoultryLayer,
    showCattleMarketLayer,
    setShowCattleMarketLayer,
    isPoultryLoading,
    isCattleMarketLoading,
    showBuffer,
    setShowBuffer,
    radius,
    setRadius,
    showBufferWetlands,
    setShowBufferWetlands,
    showBufferPoultry,
    setShowBufferPoultry,
    showHeatmap,
    setShowHeatmap,
    resetAll,
    setShowSidebar,
    showSurveillanceSites = false,
    setShowSurveillanceSites,
  } = props;

  const sidebarClass = props.closed ? "sidebar sidebar--closed" : "sidebar";

  return (
    <aside className={sidebarClass}>
      <div className="sidebar-header">
        <div>
          <h2 className="sidebar-heading">Layers & Analysis</h2>
        </div>
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={() => setShowSidebar(false)}
          className="sidebar-toggle-button"
        >
          <Menu size={18} />
        </button>
      </div>

      <div className="sidebar-scroll">
        <div className="sidebar-section">
          <h3 className="sidebar-title">
            Base Maps <MapIcon size={12} />
          </h3>
          <div
            className={`sidebar-item ${activeBaseMap === "osm" ? "active" : ""}`}
            onClick={() => setActiveBaseMap("osm")}
          >
            <MapPin size={16} /> OpenStreetMap
          </div>
          <div
            className={`sidebar-item ${activeBaseMap === "satellite" ? "active" : ""}`}
            onClick={() => setActiveBaseMap("satellite")}
          >
            <MapPin size={16} /> Satellite (Hybrid)
          </div>
          <div
            className={`sidebar-item ${activeBaseMap === "light" ? "active" : ""}`}
            onClick={() => setActiveBaseMap("light")}
          >
            <MapPin size={16} /> Clean / Light Map
          </div>
          <div
            className={`sidebar-item ${activeBaseMap === "topo" ? "active" : ""}`}
            onClick={() => setActiveBaseMap("topo")}
          >
            <MapPin size={16} /> Topographic
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">
            Layers <Info size={12} />
          </h3>
          <div
            className={`sidebar-item ${showSurveillanceSites ? "active" : ""}`}
            onClick={() => setShowSurveillanceSites?.(!showSurveillanceSites)}
            style={{ marginTop: "8px" }}
          >
            <Crosshair size={16} /> Surveillance Sites
          </div>
          <div
            className={`sidebar-item ${showPoultryLayer ? "active" : ""}`}
            onClick={() => setShowPoultryLayer(!showPoultryLayer)}
          >
            <Flame size={16} /> Poultry farms
            {isPoultryLoading && (
              <RefreshCw
                size={13}
                className="animate-spin sidebar-item-spinner"
              />
            )}
          </div>
          <div
            className={`sidebar-item ${showCattleMarketLayer ? "active" : ""}`}
            onClick={() => setShowCattleMarketLayer(!showCattleMarketLayer)}
          >
            <Store size={16} /> Cattle markets
            {isCattleMarketLoading && (
              <RefreshCw
                size={13}
                className="animate-spin sidebar-item-spinner"
              />
            )}
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">Analysis Tools</h3>
          <div
            className={`sidebar-item ${showBuffer ? "active" : ""}`}
            onClick={() => setShowBuffer(!showBuffer)}
          >
            <MousePointer2 size={16} /> Buffer & Proximity
          </div>
          {showBuffer && (
            <div className="sidebar-buffer-panel">
              <RadiusSlider value={radius} onChange={setRadius} />
              <div className="sidebar-reference-panel">
                <div className="sidebar-reference-title">Reference Layers</div>
                <label>
                  <input
                    type="checkbox"
                    checked={showBufferWetlands}
                    onChange={() => setShowBufferWetlands(!showBufferWetlands)}
                  />
                  Wetlands
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={showBufferPoultry}
                    onChange={() => setShowBufferPoultry(!showBufferPoultry)}
                  />
                  Poultry Farms
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={showHeatmap}
                    onChange={() => setShowHeatmap(!showHeatmap)}
                  />
                  Heatmap (Bird Density)
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">
            Observations <Info size={12} />
          </h3>
          <div className="sidebar-item-static">
            <Layers size={16} /> eBird Observations
          </div>
          <div className="sidebar-density-legend">
            <div>
              <span style={{ background: "#e74c3c" }} /> High Density
            </div>
            <div>
              <span style={{ background: "#f1c40f" }} /> Medium Density
            </div>
            <div>
              <span style={{ background: "#3498db" }} /> Low Density
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <button onClick={resetAll} className="sidebar-reset-button">
          <RefreshCw size={14} /> Reset Map
        </button>
      </div>
    </aside>
  );
}
