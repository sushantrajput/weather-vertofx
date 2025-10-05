
import React, { useState } from 'react';
import type { WeatherData } from '../hooks/useWeather';
import { getWeatherIcon } from './icons';
import themesData from '../data/themes.ts';

type Period = 'day' | 'night' | 'sunrise' | 'sunset';

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

const themes = themesData.dailyForecastCard;

interface DailyForecastItemProps {
    dayData: WeatherData['daily'][0];
    dayName: string;
    isExpanded: boolean;
    onToggle: () => void;
    theme: typeof themes[Period];
}

const DailyForecastItem: React.FC<DailyForecastItemProps> = ({ dayData, dayName, isExpanded, onToggle, theme }) => {
    const { condition, temps } = dayData;
 
    const temp_max = Math.max(temps.morning, temps.afternoon, temps.evening, temps.night);
    const temp_min = Math.min(temps.morning, temps.afternoon, temps.evening, temps.night);

    return (
        <div className={`border-b ${theme.borderColor} last:border-b-0`}>
            <div 
              className={`flex items-center justify-between p-3 rounded-xl ${theme.itemHover} transition-colors cursor-pointer`}
              onClick={onToggle}
              role="button"
              aria-expanded={isExpanded}
            >
                <span className="font-semibold w-1/4 text-sm md:text-base">{dayName}</span>
                <div className="flex items-center gap-2 opacity-90">
                    {getWeatherIcon(condition, 'h-6 w-6')}
                    <span className="text-sm hidden xl:inline">{condition}</span>
                </div>
                <span className="font-semibold opacity-90 w-1/4 text-right text-sm md:text-base">
                    {Math.round(temp_max)}° / {Math.round(temp_min)}°
                </span>
                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 opacity-80 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
            <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 text-center">
                        <div className="text-sm">
                            <p className={theme.subtext}>Morning</p>
                            <p className="font-bold">{Math.round(temps.morning)}°</p>
                        </div>
                         <div className="text-sm">
                            <p className={theme.subtext}>Afternoon</p>
                            <p className="font-bold">{Math.round(temps.afternoon)}°</p>
                        </div>
                         <div className="text-sm">
                            <p className={theme.subtext}>Evening</p>
                            <p className="font-bold">{Math.round(temps.evening)}°</p>
                        </div>
                         <div className="text-sm">
                            <p className={theme.subtext}>Night</p>
                            <p className="font-bold">{Math.round(temps.night)}°</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getNextFiveDays = (timezone: string): string[] => {
    const days: string[] = [];
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: timezone });

    for (let i = 1; i <= 5; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        days.push(formatter.format(futureDate));
    }
    return days;
};

interface DailyForecastCardProps {
  data: WeatherData['daily'];
  ianaTimezone: string;
}

const DailyForecastCard: React.FC<DailyForecastCardProps> = ({ data, ianaTimezone }) => {
    const [expandedDay, setExpandedDay] = useState<string | null>(null);

    const period = getPeriodOfDay(ianaTimezone);
    const theme = themes[period as Period];
    const futureDays = getNextFiveDays(ianaTimezone);

    const handleToggle = (day: string) => {
        setExpandedDay(prev => prev === day ? null : day);
    };

    return (
        <div className={`bg-gradient-to-br ${theme.bg} backdrop-blur-md p-6 rounded-3xl shadow-lg h-full flex flex-col ${theme.text}`}>
            <h2 className="font-bold text-lg">5-Day Forecast</h2>
            <div className="flex flex-col mt-4 -mx-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {data.slice(0, 5).map((dayData, index) => {
                    const dayName = futureDays[index];
                    return (
                        <DailyForecastItem 
                            key={index} // Use index for a stable key
                            dayData={dayData}
                            dayName={dayName}
                            isExpanded={expandedDay === dayName}
                            onToggle={() => handleToggle(dayName)}
                            theme={theme}
                        />
                    )
                })}
            </div>
        </div>
    );
};

export default DailyForecastCard;
