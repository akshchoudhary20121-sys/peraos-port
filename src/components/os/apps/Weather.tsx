import { useState } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, Eye, Thermometer } from "lucide-react";

interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  wind: number;
  visibility: number;
  feelsLike: number;
}

const WEATHER_DATA: WeatherData = {
  city: "San Francisco",
  temp: 22,
  condition: "Partly Cloudy",
  high: 26,
  low: 16,
  humidity: 65,
  wind: 12,
  visibility: 16,
  feelsLike: 21,
};

const HOURLY = [
  { hour: "Now", temp: 22, icon: "cloud-sun" },
  { hour: "1PM", temp: 24, icon: "sun" },
  { hour: "2PM", temp: 25, icon: "sun" },
  { hour: "3PM", temp: 26, icon: "sun" },
  { hour: "4PM", temp: 24, icon: "cloud-sun" },
  { hour: "5PM", temp: 22, icon: "cloud" },
  { hour: "6PM", temp: 20, icon: "cloud" },
  { hour: "7PM", temp: 19, icon: "cloud" },
];

const FORECAST = [
  { day: "Tue", high: 26, low: 16, icon: "sun", condition: "Sunny" },
  { day: "Wed", high: 24, low: 15, icon: "cloud-sun", condition: "Partly Cloudy" },
  { day: "Thu", high: 20, low: 14, icon: "cloud-rain", condition: "Rain" },
  { day: "Fri", high: 18, low: 12, icon: "cloud-rain", condition: "Showers" },
  { day: "Sat", high: 23, low: 15, icon: "sun", condition: "Sunny" },
];

function WeatherIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case "sun": return <Sun className={className} />;
    case "cloud": return <Cloud className={className} />;
    case "cloud-sun": return <Cloud className={className} />;
    case "cloud-rain": return <CloudRain className={className} />;
    case "cloud-snow": return <CloudSnow className={className} />;
    case "lightning": return <CloudLightning className={className} />;
    default: return <Sun className={className} />;
  }
}

export function Weather() {
  const [data] = useState(WEATHER_DATA);

  return (
    <div className="h-full bg-gradient-to-b from-[#E8F0FE] to-white overflow-y-auto">
      {/* Current Weather */}
      <div className="p-6 text-center">
        <div className="text-[14px] text-[#5f6368] font-medium mb-1">{data.city}</div>
        <div className="flex items-center justify-center gap-3">
          <Sun className="w-12 h-12 text-[#FBBC05]" />
          <span className="text-[56px] font-light text-[#202124] leading-none">{data.temp}°</span>
        </div>
        <div className="text-[14px] text-[#5f6368] mt-1">{data.condition}</div>
        <div className="text-[13px] text-[#5f6368] mt-0.5">
          H:{data.high}° L:{data.low}°
        </div>
      </div>

      {/* Hourly */}
      <div className="px-4 pb-4">
        <div className="rounded-2xl bg-white/80 border border-[#e8eaed] p-4">
          <div className="text-[12px] font-medium text-[#5f6368] mb-3">Hourly Forecast</div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {HOURLY.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 min-w-[48px] py-2 px-1">
                <span className="text-[11px] text-[#5f6368]">{h.hour}</span>
                <WeatherIcon type={h.icon} className="w-5 h-5 text-[#5f6368]" />
                <span className="text-[13px] text-[#202124] font-medium">{h.temp}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5-day Forecast */}
      <div className="px-4 pb-4">
        <div className="rounded-2xl bg-white/80 border border-[#e8eaed] p-4">
          <div className="text-[12px] font-medium text-[#5f6368] mb-3">5-Day Forecast</div>
          {FORECAST.map((day, i) => (
            <div key={i} className={`flex items-center gap-3 py-2.5 ${i < FORECAST.length - 1 ? "border-b border-[#f1f3f4]" : ""}`}>
              <span className="text-[13px] text-[#202124] w-10 font-medium">{day.day}</span>
              <WeatherIcon type={day.icon} className="w-5 h-5 text-[#5f6368]" />
              <span className="text-[12px] text-[#5f6368] flex-1">{day.condition}</span>
              <span className="text-[13px] text-[#202124]">{day.high}°</span>
              <div className="w-16 h-1.5 rounded-full bg-[#e8eaed] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #4285F4, #EA4335)`,
                    width: `${((day.high - day.low) / 20) * 100}%`,
                    marginLeft: `${((day.low - 10) / 20) * 100}%`,
                  }}
                />
              </div>
              <span className="text-[13px] text-[#5f6368]">{day.low}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="px-4 pb-6">
        <div className="rounded-2xl bg-white/80 border border-[#e8eaed] p-4">
          <div className="text-[12px] font-medium text-[#5f6368] mb-3">Details</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Thermometer, label: "Feels Like", value: `${data.feelsLike}°C` },
              { icon: Droplets, label: "Humidity", value: `${data.humidity}%` },
              { icon: Wind, label: "Wind", value: `${data.wind} km/h` },
              { icon: Eye, label: "Visibility", value: `${data.visibility} km` },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#f8f9fa]">
                <item.icon className="w-4 h-4 text-[#5f6368]" />
                <div>
                  <div className="text-[11px] text-[#5f6368]">{item.label}</div>
                  <div className="text-[13px] text-[#202124] font-medium">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
