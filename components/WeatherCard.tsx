
import React from 'react';
import type { WeatherData } from '../hooks/useWeather';
import themesData from '../data/themes.ts';

type Period = 'day' | 'night' | 'sunrise' | 'sunset';

// --- NEW AESTHETIC ILLUSTRATION COMPONENTS ---

const SunIcon = () => (
    <div className="absolute top-10 right-10 w-32 h-32 sm:w-40 sm:h-40">
        <div className="w-full h-full bg-yellow-300 rounded-full animate-pulse opacity-80" />
        <div className="absolute inset-0 bg-yellow-200/50 rounded-full scale-125 blur-lg" />
    </div>
);

const MoonIcon = () => (
    <div className="absolute top-10 right-12 w-28 h-28 sm:w-36 sm:h-36">
      <div className="w-full h-full bg-slate-100 rounded-full shadow-2xl shadow-slate-400/20" />
      {/* Craters for detail */}
      <div className="absolute top-8 left-12 w-4 h-4 bg-slate-300/50 rounded-full" />
      <div className="absolute top-16 left-4 w-6 h-6 bg-slate-300/50 rounded-full" />
      <div className="absolute bottom-8 right-8 w-3 h-3 bg-slate-300/50 rounded-full" />
    </div>
);
  
const Stars = () => (
    <>
      <div className="absolute top-12 right-48 w-1 h-1 bg-white rounded-full animate-pulse [animation-delay:0.1s]" />
      <div className="absolute top-24 right-8 w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:0.3s]" />
      <div className="absolute top-36 right-52 w-1 h-1 bg-white rounded-full animate-pulse [animation-delay:0.5s]" />
      <div className="absolute top-44 right-20 w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:0.7s]" />
      <div className="absolute top-8 right-24 w-1 h-1 bg-white rounded-full animate-pulse [animation-delay:0.9s]" />
      <div className="absolute top-20 right-40 w-1 h-1 bg-white rounded-full animate-pulse [animation-delay:1.1s]" />
    </>
);
  
const HorizonSun = ({ color = 'bg-yellow-300' }) => (
    <div className="absolute -bottom-16 -right-16 w-48 h-48 sm:w-64 sm:h-64">
      <div className={`w-full h-full ${color} rounded-full opacity-70 blur-xl`} />
      <div className={`absolute inset-4 ${color} rounded-full opacity-80`} />
    </div>
);

const Clouds = ({ period }: { period: Period }) => {
    const cloudColor = period === 'night' ? 'bg-slate-500/50' : 'bg-white/40';
    const cloudColor2 = period === 'night' ? 'bg-slate-600/60' : 'bg-white/60';
  
    return (
      <div className="absolute top-10 right-0 w-full h-full opacity-90 animate-[drift_20s_linear_infinite]">
        <div className={`absolute w-36 h-24 sm:w-48 sm:h-32 ${cloudColor2} rounded-full top-16 right-8 sm:right-12 blur-sm`} style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }} />
        <div className={`absolute w-24 h-20 sm:w-32 sm:h-24 ${cloudColor} rounded-full top-24 right-0 sm:right-4 blur-md`} style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }} />
      </div>
    );
};

const Rain = () => (
    <div className="absolute top-40 sm:top-48 right-20 sm:right-24 flex gap-4 animate-[drift_20s_linear_infinite]">
      <div className="w-1 h-4 bg-slate-400/50 rounded-full animate-[rainfall_1s_linear_infinite] [animation-delay:0.1s]" />
      <div className="w-1 h-3 bg-slate-400/50 rounded-full animate-[rainfall_1s_linear_infinite] [animation-delay:0.5s]" />
      <div className="w-1 h-5 bg-slate-400/50 rounded-full animate-[rainfall_1s_linear_infinite] [animation-delay:0.3s]" />
    </div>
);

interface WeatherIllustrationProps {
  condition: string;
  period: Period;
}

const WeatherIllustration: React.FC<WeatherIllustrationProps> = ({ condition, period }) => {
  const isCloudy = condition.toLowerCase().includes('cloud') || condition.toLowerCase().includes('overcast');
  const isRainy = condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle');
  const isClear = condition.toLowerCase().includes('sun') || condition.toLowerCase().includes('clear');

  return (
    <div className="absolute inset-0 overflow-hidden">
        { /* Base Layer: Stars/Horizon */ }
        {period === 'night' && <Stars />}
        {period === 'sunrise' && <HorizonSun color="bg-orange-300" />}
        {period === 'sunset' && <HorizonSun color="bg-red-400" />}
        
        { /* Middle Layer: Sun/Moon */ }
        {period === 'day' && isClear && <SunIcon />}
        {period === 'night' && !isCloudy && <MoonIcon />}

        { /* Cloud Layer: Can obscure Sun/Moon */ }
        {isCloudy && (
            <>
                {period === 'day' && <SunIcon />}
                {period === 'night' && <MoonIcon />}
                <Clouds period={period} />
            </>
        )}

        { /* Top Layer: Rain */ }
        {isRainy && <Rain />}
    </div>
  );
};

interface WeatherCardProps {
  data: WeatherData['current'];
  location: WeatherData['location'];
  ianaTimezone: string;
}

const getPeriodOfDay = (timezone: string): Period => {
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: 'numeric',
            hour12: false,
        });
        const hourString = formatter.format(new Date());
        const hour = parseInt(hourString, 10);
        
        if (hour >= 5 && hour < 8) return 'sunrise';
        if (hour >= 8 && hour < 18) return 'day';
        if (hour >= 18 && hour < 21) return 'sunset';
        return 'night';
    } catch (e) {
        console.error("Could not determine period of day for timezone:", timezone, e);
        // Fallback based on client time
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 8) return 'sunrise';
        if (hour >= 8 && hour < 18) return 'day';
        if (hour >= 18 && hour < 21) return 'sunset';
        return 'night';
    }
};

const themes = themesData.weatherCard;

const WeatherCard: React.FC<WeatherCardProps> = ({ data, location, ianaTimezone }) => {
    const period = getPeriodOfDay(ianaTimezone);
    const theme = themes[period as Period];
    
    return (
        <div className={`bg-gradient-to-br ${theme.bg} p-6 rounded-3xl h-full relative overflow-hidden shadow-lg ${theme.text} flex flex-col justify-between`}>
            
            <WeatherIllustration condition={data.condition} period={period} />

            <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <div className={`flex items-center gap-2 ${theme.pill} backdrop-blur-sm py-1 px-3 rounded-full w-fit`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold text-sm">{location.city}, {location.country}</span>
                        </div>
                        <p className="text-lg mt-4 font-semibold">{data.condition}</p>
                        <p className={`text-xs ${theme.subtext}`}>Now</p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end justify-between mt-4 gap-4 sm:gap-0">
                <div className="text-center sm:text-left">
                    <p className="text-6xl sm:text-8xl font-bold">{Math.round(data.temp)}°C</p>
                    <p className={theme.subtext}>Feels like {Math.round(data.feels_like)}°C</p>
                </div>
            </div>
            
        </div>
    );
};

export default WeatherCard;