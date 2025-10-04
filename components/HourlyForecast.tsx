

import React from 'react';
import { getWeatherIcon } from './icons';
import type { WeatherData } from '../hooks/useWeather';

interface ForecastItemProps {
  time: string;
  temp: string;
  icon: React.ReactNode;
  active?: boolean;
}

const ForecastItem: React.FC<ForecastItemProps> = ({ time, temp, icon, active }) => (
  <div className={`flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl transition-all duration-300 h-full ${active ? 'bg-slate-800 text-white shadow-lg' : 'bg-white'}`}>
    <p className={`font-semibold text-sm ${active ? 'text-slate-300' : 'text-slate-500'}`}>{time}</p>
    <div className={`my-2 md:my-4 ${active ? 'text-white' : 'text-slate-600'}`}>
        {icon}
    </div>
    <p className={`text-lg md:text-xl font-bold ${active ? 'text-white' : 'text-slate-800'}`}>{temp}</p>
  </div>
);

interface HourlyForecastProps {
  data: WeatherData['hourly'];
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data }) => {
    const getCurrentPeriod = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Morning';
        if (hour >= 12 && hour < 17) return 'Afternoon';
        if (hour >= 17 && hour < 21) return 'Evening';
        return 'Night';
    }
    const activePeriod = getCurrentPeriod();
    
    return (
        <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-3xl shadow-lg h-full flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">How is the temperature today?</h2>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {data.map(item => (
                    <ForecastItem 
                        key={item.time}
                        time={item.time} 
                        temp={`${Math.round(item.temp)}°`} 
                        icon={getWeatherIcon(item.condition)} 
                        active={item.time === activePeriod}
                    />
                ))}
            </div>
        </div>
    );
};

export default HourlyForecast;
