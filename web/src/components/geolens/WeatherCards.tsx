import React from "react";
import Image from "next/image";

export const owmIconUrl = (icon: string) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;

export function windDirLabel(deg: number) {
  const dirs = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return dirs[Math.round(deg / 22.5) % 16];
}

interface DailyData {
  date: string;
  maxTemp: number;
  minTemp: number;
  precip: number;
  humidity: number;
}

interface HistoricalData {
  days: number;
  maxTemp: number | null;
  minTemp: number | null;
  avgHumidity: number | null;
  totalPrecip: string | number | null;
  dailyData?: DailyData[];
}

interface HistoricalWeatherBarProps {
  historical: HistoricalData | null | undefined;
  variant?: "dark" | "light";
  selectedDate?: string;
  onDateChange?: (date: string) => void;
}

export function HistoricalWeatherBar({
  historical,
  variant = "dark",
  selectedDate,
  onDateChange,
}: HistoricalWeatherBarProps) {
  if (!historical) return null;
  const isDark = variant === "dark";
  const bg = isDark ? "rgba(255,255,255,0.08)" : "#f0f4f8";
  const labelColor = isDark ? "rgba(255,255,255,0.6)" : "#95a5a6";
  const valColor = isDark ? "white" : "#2c3e50";

  const daily = historical.dailyData || [];
  const selectedDay = daily.find((d) => d.date === selectedDate);

  const displayData = selectedDay
    ? {
        maxTemp:
          selectedDay.maxTemp != null ? Math.round(selectedDay.maxTemp) : "—",
        minTemp:
          selectedDay.minTemp != null ? Math.round(selectedDay.minTemp) : "—",
        avgHumidity:
          selectedDay.humidity != null ? Math.round(selectedDay.humidity) : "—",
        totalPrecip:
          selectedDay.precip != null ? selectedDay.precip.toFixed(1) : "—",
      }
    : {
        maxTemp: historical.maxTemp ?? "—",
        minTemp: historical.minTemp ?? "—",
        avgHumidity: historical.avgHumidity ?? "—",
        totalPrecip: historical.totalPrecip ?? "—",
      };

  const titleText = selectedDay
    ? `ON ${new Date(selectedDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}`
    : `PAST ${historical.days} DAYS`;

  return (
    <div
      style={{
        marginTop: "6px",
        borderTop: isDark
          ? "1px solid rgba(255,255,255,0.15)"
          : "1px solid #e1e2e6",
        paddingTop: "6px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <div
          style={{
            fontSize: "8px",
            color: labelColor,
            fontWeight: "bold",
            letterSpacing: "0.5px",
          }}
        >
          📅 {titleText}
        </div>
        {daily.length > 0 && (
          <select
            value={selectedDate || ""}
            onChange={(e) => onDateChange && onDateChange(e.target.value)}
            style={{
              fontSize: "8px",
              background: bg,
              color: valColor,
              border: isDark
                ? "1px solid rgba(255,255,255,0.2)"
                : "1px solid #ccc",
              borderRadius: "3px",
              padding: "1px 2px",
              cursor: "pointer",
              outline: "none",
              maxWidth: "85px",
            }}
          >
            <option value="">-- All {historical.days} Days --</option>
            {[...daily].reverse().map((d) => (
              <option key={d.date} value={d.date}>
                {new Date(d.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </option>
            ))}
          </select>
        )}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "4px",
          fontSize: "8px",
        }}
      >
        <div
          style={{
            background: bg,
            borderRadius: "4px",
            padding: "4px 5px",
            textAlign: "center",
          }}
        >
          <div style={{ color: labelColor, fontSize: "7px" }}>MAX</div>
          <div
            style={{ fontWeight: "bold", color: "#e74c3c", fontSize: "11px" }}
          >
            {displayData.maxTemp}°
          </div>
        </div>
        <div
          style={{
            background: bg,
            borderRadius: "4px",
            padding: "4px 5px",
            textAlign: "center",
          }}
        >
          <div style={{ color: labelColor, fontSize: "7px" }}>MIN</div>
          <div
            style={{ fontWeight: "bold", color: "#3498db", fontSize: "11px" }}
          >
            {displayData.minTemp}°
          </div>
        </div>
        <div
          style={{
            background: bg,
            borderRadius: "4px",
            padding: "4px 5px",
            textAlign: "center",
          }}
        >
          <div style={{ color: labelColor, fontSize: "7px" }}>
            {selectedDay ? "RH" : "AVG RH"}
          </div>
          <div
            style={{ fontWeight: "bold", color: valColor, fontSize: "11px" }}
          >
            {displayData.avgHumidity}%
          </div>
        </div>
        <div
          style={{
            background: bg,
            borderRadius: "4px",
            padding: "4px 5px",
            textAlign: "center",
          }}
        >
          <div style={{ color: labelColor, fontSize: "7px" }}>RAIN</div>
          <div
            style={{ fontWeight: "bold", color: valColor, fontSize: "11px" }}
          >
            {displayData.totalPrecip}
            <span style={{ fontSize: "7px" }}>mm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface WeatherData {
  icon: string;
  description: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  rain: number;
  windSpeed: string | number;
  windDeg: number;
  pressure: number;
  dewPoint: number;
  visibility?: string | number | null;
  cityName?: string;
}

interface WeatherCardProps {
  weather: WeatherData | null | undefined;
  loading?: boolean;
  historical?: HistoricalData | null | undefined;
  style?: React.CSSProperties;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
}

export function WeatherMiniCard({
  weather,
  loading,
  historical,
  style,
  selectedDate,
  onDateChange,
}: WeatherCardProps) {
  if (loading)
    return (
      <div
        style={{
          padding: "8px",
          background: "#f0f4f8",
          borderRadius: "8px",
          marginBottom: "8px",
          textAlign: "center",
          fontSize: "10px",
          color: "#7f8c8d",
          ...style,
        }}
      >
        🌤 Fetching weather...
      </div>
    );
  if (!weather)
    return (
      <div
        style={{
          padding: "8px",
          background: "#f0f4f8",
          borderRadius: "8px",
          marginBottom: "8px",
          textAlign: "center",
          fontSize: "10px",
          color: "#e74c3c",
          ...style,
        }}
      >
        ⚠ Weather unavailable
      </div>
    );
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a6b9e 0%, #0e4c72 100%)",
        borderRadius: "8px",
        padding: "8px 10px",
        marginBottom: "8px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "4px",
          }}
        >
          <Image
            src={owmIconUrl(weather.icon)}
            alt={weather.description}
            width={32}
            height={32}
            style={{ marginTop: "-4px" }}
          />
          <div>
            <div
              style={{ fontSize: "18px", fontWeight: "bold", lineHeight: 1 }}
            >
              {weather.temp}°C
            </div>
            <div
              style={{
                fontSize: "8px",
                opacity: 0.8,
                textTransform: "capitalize",
              }}
            >
              {weather.description}
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: "10px", opacity: 0.9 }}>
              Feels {weather.feelsLike}°C
            </div>
            <div style={{ fontSize: "9px", opacity: 0.7 }}>
              💧 {weather.humidity}% RH{" "}
              {weather.rain > 0 && `· ☔ ${weather.rain}mm`}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "4px",
            fontSize: "8px",
            opacity: 0.85,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "4px",
              padding: "3px 5px",
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: "bold" }}>💨 {weather.windSpeed} m/s</div>
            <div>{windDirLabel(weather.windDeg)}</div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "4px",
              padding: "3px 5px",
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: "bold" }}>🌡 {weather.pressure}</div>
            <div>hPa</div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "4px",
              padding: "3px 5px",
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: "bold" }}>🌫 {weather.dewPoint}°C</div>
            <div>Dew Pt</div>
          </div>
        </div>
        {weather.visibility && (
          <div
            style={{
              fontSize: "8px",
              opacity: 0.7,
              marginTop: "4px",
              textAlign: "right",
            }}
          >
            Visibility: {weather.visibility} km
          </div>
        )}
      </div>
      <div style={{ marginTop: "auto" }}>
        <HistoricalWeatherBar
          historical={historical}
          variant="dark"
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />
      </div>
    </div>
  );
}

export function WeatherFullCard({
  weather,
  loading,
  historical,
  selectedDate,
  onDateChange,
}: WeatherCardProps) {
  if (loading)
    return (
      <div
        style={{
          padding: "10px",
          background: "#eaf4fb",
          borderRadius: "8px",
          marginTop: "10px",
          textAlign: "center",
          fontSize: "11px",
          color: "#7f8c8d",
        }}
      >
        🌤 Loading weather data...
      </div>
    );
  if (!weather)
    return (
      <div
        style={{
          padding: "10px",
          background: "#fdf2f2",
          borderRadius: "8px",
          marginTop: "10px",
          textAlign: "center",
          fontSize: "11px",
          color: "#e74c3c",
        }}
      >
        ⚠ Weather data unavailable — check API key
      </div>
    );
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a6b9e 0%, #0e4c72 100%)",
        borderRadius: "8px",
        padding: "10px 12px",
        marginTop: "10px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <Image
          src={owmIconUrl(weather.icon)}
          alt={weather.description}
          width={40}
          height={40}
          style={{ marginTop: "-6px" }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "22px", fontWeight: "bold", lineHeight: 1 }}>
            {weather.temp}°C
          </div>
          <div
            style={{
              fontSize: "9px",
              opacity: 0.85,
              textTransform: "capitalize",
            }}
          >
            {weather.description}
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "10px", opacity: 0.9 }}>
          <div>Feels like {weather.feelsLike}°C</div>
          {weather.cityName && (
            <div style={{ opacity: 0.7, fontSize: "9px" }}>
              {weather.cityName}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px",
          fontSize: "10px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: "6px",
            padding: "6px 8px",
          }}
        >
          <div style={{ opacity: 0.7, fontSize: "8px", marginBottom: "2px" }}>
            HUMIDITY
          </div>
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>
            {weather.humidity}%
          </div>
          <div style={{ opacity: 0.7, fontSize: "8px" }}>
            Dew pt: {weather.dewPoint}°C
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: "6px",
            padding: "6px 8px",
          }}
        >
          <div style={{ opacity: 0.7, fontSize: "8px", marginBottom: "2px" }}>
            WIND
          </div>
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>
            {weather.windSpeed}{" "}
            <span style={{ fontSize: "10px", fontWeight: "normal" }}>m/s</span>
          </div>
          <div style={{ opacity: 0.7, fontSize: "8px" }}>
            {windDirLabel(weather.windDeg)} ({weather.windDeg}°)
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: "6px",
            padding: "6px 8px",
          }}
        >
          <div style={{ opacity: 0.7, fontSize: "8px", marginBottom: "2px" }}>
            PRESSURE
          </div>
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>
            {weather.pressure}{" "}
            <span style={{ fontSize: "10px", fontWeight: "normal" }}>hPa</span>
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: "6px",
            padding: "6px 8px",
          }}
        >
          <div style={{ opacity: 0.7, fontSize: "8px", marginBottom: "2px" }}>
            VISIBILITY
          </div>
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>
            {weather.visibility ?? "—"}{" "}
            <span style={{ fontSize: "10px", fontWeight: "normal" }}>km</span>
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: "6px",
            padding: "6px 8px",
          }}
        >
          <div style={{ opacity: 0.7, fontSize: "8px", marginBottom: "2px" }}>
            RAINFALL
          </div>
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>
            {weather.rain ?? 0}{" "}
            <span style={{ fontSize: "10px", fontWeight: "normal" }}>mm</span>
          </div>
          <div style={{ opacity: 0.7, fontSize: "8px" }}>Current (1h/3h)</div>
        </div>
      </div>
      <HistoricalWeatherBar
        historical={historical}
        variant="dark"
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />
    </div>
  );
}
