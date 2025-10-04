
import { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

// Centralized Types
export interface WeatherData {
  location: {
    city: string;
    country: string;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    visibility_km: number;
    condition: string;
    aqi: number;
    wind_kph: number;
  };
  hourly: { time: string; temp: number; condition: string }[];
  daily: { 
    day: string; 
    condition: string; 
    temps: {
        morning: number;
        afternoon: number;
        evening: number;
        night: number;
    }
  }[];
  dateTime: {
    ianaTimezone: string;
  };
}

export type LayoutType = 'default' | 'compact';

// API initialization
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });


// Data validation logic
const isDataValid = (data: any): data is WeatherData => {
    if (!data) return false;

    const { location, current, hourly, daily, dateTime } = data;

    // Location check
    if (!location || typeof location.city !== 'string' || !location.city.trim() || typeof location.country !== 'string' || !location.country.trim() || location.country.toLowerCase() === 'unknown') return false;
    
    // Current weather check
    if (!current) return false;
    const currentProps = ['temp', 'feels_like', 'humidity', 'visibility_km', 'aqi', 'wind_kph'];
    for (const prop of currentProps) {
        if (!Number.isFinite(current[prop])) return false;
    }
    if (typeof current.condition !== 'string' || !current.condition.trim()) return false;

    // Hourly forecast check
    if (!Array.isArray(hourly) || hourly.length < 4) return false;
    for (const h of hourly) {
        if (!h || typeof h.time !== 'string' || !h.time.trim() || !Number.isFinite(h.temp) || typeof h.condition !== 'string' || !h.condition.trim()) return false;
    }

    // Daily forecast check
    if (!Array.isArray(daily) || daily.length < 5) return false;
    for (const d of daily) {
        if (!d || typeof d.day !== 'string' || !d.day.trim() || typeof d.condition !== 'string' || !d.condition.trim() || !d.temps) return false;
        const tempProps = ['morning', 'afternoon', 'evening', 'night'];
        for (const prop of tempProps) {
            if (!Number.isFinite(d.temps[prop])) return false;
        }
    }

    // DateTime check
    if (!dateTime || typeof dateTime.ianaTimezone !== 'string' || !dateTime.ianaTimezone.trim()) return false;

    return true;
};

// The custom hook for fetching and managing weather data
export const useWeather = (initialCity: string) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [targetCity, setTargetCity] = useState<string>(localStorage.getItem('lastSearchedCity') || initialCity);

  const searchForCity = useCallback(async (city: string): Promise<boolean> => {
    setTargetCity(city);
    
    if (!city) return false;
    
    setLoading(true);
    setError(null);
    
    try {
        const cache = JSON.parse(localStorage.getItem('weatherCache') || '{}');
        const cityCache = cache[city.toLowerCase()];
        const CACHE_DURATION = 15 * 60 * 1000;

        if (cityCache && (Date.now() - cityCache.timestamp < CACHE_DURATION)) {
            setWeatherData(cityCache.data);
            localStorage.setItem('lastSearchedCity', cityCache.data.location.city);
            setLoading(false);
            return true;
        }
    } catch (e) {
        console.error("Failed to read cache", e);
    }

    try {
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          location: { type: Type.OBJECT, properties: { city: { type: Type.STRING }, country: { type: Type.STRING } } },
          current: { type: Type.OBJECT, properties: { 
              temp: { type: Type.NUMBER }, 
              feels_like: { type: Type.NUMBER }, 
              humidity: { type: Type.NUMBER }, 
              visibility_km: { type: Type.NUMBER }, 
              condition: { type: Type.STRING },
              aqi: { type: Type.NUMBER, description: "Air Quality Index (AQI) value, from a realistic range of 10 to 350." },
              wind_kph: { type: Type.NUMBER, description: "Wind speed in kilometers per hour." } 
            } 
          },
          hourly: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { time: { type: Type.STRING, description: "The period of the day, must be one of: 'Morning', 'Afternoon', 'Evening', 'Night'." }, temp: { type: Type.NUMBER }, condition: { type: Type.STRING } } } },
          daily: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { day: { type: Type.STRING }, condition: { type: Type.STRING }, temps: { type: Type.OBJECT, properties: { morning: {type: Type.NUMBER}, afternoon: {type: Type.NUMBER}, evening: {type: Type.NUMBER}, night: {type: Type.NUMBER} } } } } },
          dateTime: { type: Type.OBJECT, properties: { ianaTimezone: { type: Type.STRING, description: "The IANA timezone name for the city, for example 'Asia/Kolkata' or 'America/New_York'." } } }
        },
        required: ['location', 'current', 'hourly', 'daily', 'dateTime'],
      };

      const prompt = `Generate realistic weather forecast data for ${city}. Include current weather with Air Quality Index (AQI) and wind speed in km/h, a 4-period hourly forecast for today (Morning, Afternoon, Evening, Night), and a 5-day daily forecast starting from tomorrow. For each day in the daily forecast, provide temperature estimates for Morning, Afternoon, Evening, and Night. Also provide the IANA timezone name (e.g., 'Asia/Kolkata') for ${city}. Follow the provided JSON schema precisely. Ensure temperatures are in Celsius. Do not return partial or incomplete data. Either return the full, valid forecast or the error object. CRITICAL: If the city name is not found, is ambiguous, or invalid, you must return only this exact JSON object: {"error": "City not found"}. Do not add any other text or explanations.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema }
      });
      
      const responseText = response.text.trim();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        if (responseText.toLowerCase().includes('city not found') || responseText.toLowerCase().includes('could not find')) {
            throw new Error('City not found');
        }
        throw parseError;
      }
      
      if (data.error) throw new Error(data.error);

      if (!isDataValid(data)) {
        console.warn(`API returned incomplete or malformed data for "${city}". Treating as 'City not found'.`, data);
        throw new Error('City not found');
      }

      if (data.location.city.toLowerCase().trim() !== city.toLowerCase().trim()) {
          console.warn(`API returned data for '${data.location.city}' when '${city}' was requested. Treating as 'City not found'.`);
          throw new Error('City not found');
      }

      try {
        new Intl.DateTimeFormat('en-US', { timeZone: data.dateTime.ianaTimezone }).format();
      } catch (e) {
        console.warn(`Invalid timezone received from API: '${data.dateTime.ianaTimezone}'. Falling back to client's local timezone.`);
        data.dateTime.ianaTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
      
      setWeatherData(data);
      localStorage.setItem('lastSearchedCity', data.location.city);

      try {
        const cache = JSON.parse(localStorage.getItem('weatherCache') || '{}');
        cache[city.toLowerCase()] = {
            timestamp: Date.now(),
            data: data
        };
        localStorage.setItem('weatherCache', JSON.stringify(cache));
      } catch(e) {
          console.error("Failed to write to cache", e);
      }
      return true;
    } catch (err) {
        console.error(err);
        if (err instanceof Error && err.message.toLowerCase().includes('city not found')) {
            setError(`Could not find weather data for "${city}". Please check the spelling or try another city.`);
        } else {
            setError(err instanceof Error ? `Failed to fetch weather data for ${city}. Please try again.` : 'An unknown error occurred.');
        }
        return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    searchForCity(targetCity);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { weatherData, loading, error, targetCity, searchForCity, setError };
};
