import React, { useMemo } from "react";
import { X, MapPin, ExternalLink, Bird, Flame, Compass } from "lucide-react";
import type {
  Site,
  BirdObservation,
  PoultryFarm,
} from "@/src/app/(dashboard)/geolens/types";
import type { WeatherData } from "@/src/app/(dashboard)/geolens/loader";
import { haversineKm } from "@/src/app/(dashboard)/geolens/utils/geo";
import type { NearestWetlandResult } from "@/src/app/(dashboard)/geolens/utils/geo";
import Image from "next/image";

interface TemporaryLocationPanelProps {
  searchPin: Site;
  searchWeather: WeatherData | null;
  searchBirds: BirdObservation[];
  searchFarms: PoultryFarm[];
  nearestWetland: NearestWetlandResult | null; // Result from findNearestWetland
  searchWetlandArea: number;
  radius: number;
  onClose: () => void;
  onAssignToSite: (slot: "A" | "B") => void;
}

export function TemporaryLocationPanel({
  searchPin,
  searchWeather,
  searchBirds,
  searchFarms,
  nearestWetland,
  searchWetlandArea,
  radius,
  onClose,
  onAssignToSite,
}: TemporaryLocationPanelProps) {
  // Compute bird observations stats
  const totalBirds = useMemo(() => {
    return searchBirds.reduce((sum, b) => sum + (b.howMany || 1), 0);
  }, [searchBirds]);

  const speciesCount = useMemo(() => {
    return new Set(searchBirds.map((b) => b.comName)).size;
  }, [searchBirds]);

  const sortedSpecies = useMemo(() => {
    const map = new Map<string, number>();
    searchBirds.forEach((b) => {
      const count = b.howMany || 1;
      map.set(b.comName, (map.get(b.comName) || 0) + count);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [searchBirds]);

  // Compute poultry farm distances
  const farmsWithDistance = useMemo(() => {
    return searchFarms
      .map((f) => {
        const dist = haversineKm(
          searchPin.end[0],
          searchPin.end[1],
          f.lat,
          f.lng,
        );
        return { ...f, distance: dist };
      })
      .sort((a, b) => a.distance - b.distance);
  }, [searchFarms, searchPin]);

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
            Location Details
          </h2>
          <X size={18} style={{ cursor: "pointer" }} onClick={onClose} />
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "flex-start",
            marginTop: "10px",
          }}
        >
          <MapPin
            size={18}
            style={{ color: "#3498db", flexShrink: 0, marginTop: "2px" }}
          />
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#2c3e50",
              overflowWrap: "break-word",
              wordBreak: "normal",
            }}
          >
            {searchPin.name}
          </div>
        </div>
      </div>

      <div
        className="panel-content custom-scrollbar"
        style={{ display: "flex", flexDirection: "column", overflowY: "auto" }}
      >
        {/* Weather section */}
        <h3
          style={{
            fontSize: "11px",
            fontWeight: 800,
            textTransform: "uppercase",
            color: "#95a5a6",
            letterSpacing: "0.5px",
            marginBottom: "10px",
          }}
        >
          Current Weather
        </h3>
        {searchWeather ? (
          <div
            style={{
              background: "linear-gradient(135deg, #1a6b9e 0%, #0e4c72 100%)",
              borderRadius: "10px",
              padding: "15px",
              color: "white",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              {searchWeather.icon && (
                <Image
                  src={`https://openweathermap.org/img/wn/${searchWeather.icon}@2x.png`}
                  alt={searchWeather.description}
                  width={40}
                  height={40}
                  unoptimized
                />
              )}
              <div>
                <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                  {searchWeather.temp}°C
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    opacity: 0.9,
                    textTransform: "capitalize",
                  }}
                >
                  {searchWeather.description}
                </div>
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  textAlign: "right",
                  fontSize: "11px",
                }}
              >
                <div>Feels like {searchWeather.feelsLike}°C</div>
                <div>Humidity: {searchWeather.humidity}%</div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                fontSize: "10px",
                opacity: 0.9,
              }}
            >
              <div>Wind: {searchWeather.windSpeed} m/s</div>
              <div>Pressure: {searchWeather.pressure} hPa</div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "15px",
              background: "#f8f9fa",
              borderRadius: "10px",
              textAlign: "center",
              fontSize: "12px",
              color: "#95a5a6",
              marginBottom: "15px",
            }}
          >
            No weather details available
          </div>
        )}

        {/* Birds Section */}
        <div
          style={{
            background: "#f8f9fa",
            borderRadius: "10px",
            padding: "15px",
            border: "1px solid #ebf0f2",
            marginBottom: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3
            style={{
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              color: "#7f8c8d",
              letterSpacing: "0.5px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Bird size={14} style={{ color: "#3498db" }} /> Bird Observations
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #ebf0f2",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#7f8c8d",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Total Birds
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "#2c3e50",
                  marginTop: "2px",
                }}
              >
                {totalBirds.toLocaleString()}
              </div>
            </div>
            <div
              style={{
                background: "white",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #ebf0f2",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#7f8c8d",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Total Species
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "#2c3e50",
                  marginTop: "2px",
                }}
              >
                {speciesCount}
              </div>
            </div>
          </div>

          {sortedSpecies.length > 0 ? (
            <div
              style={{
                maxHeight: "160px",
                overflowY: "auto",
                paddingRight: "4px",
              }}
              className="custom-scrollbar"
            >
              {sortedSpecies.map((item) => (
                <div
                  key={item.name}
                  style={{
                    padding: "6px 10px",
                    fontSize: "12px",
                    color: "#2c3e50",
                    background: "white",
                    marginBottom: "4px",
                    borderRadius: "8px",
                    border: "1px solid #dfe6e9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      overflowWrap: "break-word",
                      wordBreak: "normal",
                      fontWeight: 500,
                      marginRight: "10px",
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#3498db",
                      fontWeight: 800,
                    }}
                  >
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#95a5a6",
                fontSize: "11px",
                padding: "10px 0",
              }}
            >
              No bird species recorded.
            </div>
          )}
        </div>

        {/* Poultry Section */}
        <div
          style={{
            background: "#f8f9fa",
            borderRadius: "10px",
            padding: "15px",
            border: "1px solid #ebf0f2",
            marginBottom: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3
            style={{
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              color: "#7f8c8d",
              letterSpacing: "0.5px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Flame size={14} style={{ color: "#e74c3c" }} /> Poultry Farms
          </h3>
          <div
            style={{
              background: "white",
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid #ebf0f2",
              textAlign: "center",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "#7f8c8d",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Farms Count ({radius}km)
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: "#2c3e50",
                marginTop: "2px",
              }}
            >
              {searchFarms.length}
            </div>
          </div>

          {farmsWithDistance.length > 0 ? (
            <div
              style={{
                maxHeight: "160px",
                overflowY: "auto",
                paddingRight: "4px",
              }}
              className="custom-scrollbar"
            >
              {farmsWithDistance.map((f) => (
                <div
                  key={f.id}
                  style={{
                    padding: "6px 10px",
                    fontSize: "12px",
                    color: "#2c3e50",
                    background: "white",
                    marginBottom: "4px",
                    borderRadius: "8px",
                    border: "1px solid #dfe6e9",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      overflowWrap: "break-word",
                      wordBreak: "normal",
                      fontWeight: 500,
                    }}
                  >
                    {f.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#95a5a6",
                fontSize: "11px",
                padding: "10px 0",
              }}
            >
              No poultry farms within {radius}km.
            </div>
          )}
        </div>

        {/* Nearest Wetland Section */}
        <div
          style={{
            background: "#f8f9fa",
            borderRadius: "10px",
            padding: "15px",
            border: "1px solid #ebf0f2",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              color: "#7f8c8d",
              letterSpacing: "0.5px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Compass size={14} style={{ color: "#27ae60" }} /> Nearest Wetland
          </h3>
          {nearestWetland ? (
            <div>
              <div
                style={{
                  background: "white",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #ebf0f2",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#2c3e50",
                    marginBottom: "4px",
                    overflowWrap: "break-word",
                    wordBreak: "normal",
                  }}
                >
                  {nearestWetland.wetland.name || "Wetland"}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "#7f8c8d",
                    marginTop: "4px",
                  }}
                >
                  <span>Shortest Distance:</span>
                  <strong style={{ color: "#27ae60" }}>
                    {nearestWetland.distKm.toFixed(2)} km
                  </strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "#7f8c8d",
                    marginTop: "4px",
                  }}
                >
                  <span>Total Wetland Area ({radius}km):</span>
                  <strong style={{ color: "#27ae60" }}>
                    {searchWetlandArea.toFixed(2)} Ha
                  </strong>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${searchPin.end[0]},${searchPin.end[1]}&destination=${nearestWetland.wetland.lat},${nearestWetland.wetland.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  width: "100%",
                  padding: "9px",
                  marginTop: "10px",
                  background: "#27ae60",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  textDecoration: "none",
                  textAlign: "center",
                  boxShadow: "0 2px 4px rgba(39, 174, 96, 0.2)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#219653")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#27ae60")
                }
              >
                Get Directions on Google Maps <ExternalLink size={12} />
              </a>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#95a5a6",
                fontSize: "11px",
                padding: "10px 0",
              }}
            >
              No wetlands registered.
            </div>
          )}
        </div>
        {/* Slot Assignment Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "auto",
            paddingBottom: "10px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#7f8c8d",
              fontWeight: 600,
              textAlign: "center",
              marginBottom: "2px",
            }}
          >
            Want to compare this site?
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => onAssignToSite("A")}
              style={{
                flex: 1,
                padding: "10px",
                background: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              Set as Site A
            </button>
            <button
              onClick={() => onAssignToSite("B")}
              style={{
                flex: 1,
                padding: "10px",
                background: "#27ae60",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              Set as Site B
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
