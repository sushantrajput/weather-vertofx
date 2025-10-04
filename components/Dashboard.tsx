
import React from 'react';
import type { WeatherData } from '../hooks/useWeather';
import WeatherCard from './WeatherCard';
import AirAndWindCard from './AirAndWindCard';
import DateTimeCard from './CitiesCard';
import HumidityCard from './HumidityCard';
import HourlyForecast from './HourlyForecast';
import DailyForecastCard from './DailyForecastCard';

interface DashboardProps {
    weatherData: WeatherData;
    layoutConfig: {
        grid: string;
        weatherCard: string;
        airWindCard: string;
        citiesHumidity: string;
        hourlyForecast: string;
        dailyForecast: string;
    }
}

const Dashboard: React.FC<DashboardProps> = ({ weatherData, layoutConfig }) => {
    return (
        <div className={`flex-1 grid ${layoutConfig.grid} gap-6 mt-6`}>
            <div className={layoutConfig.weatherCard}>
                <WeatherCard data={weatherData.current} location={weatherData.location} ianaTimezone={weatherData.dateTime.ianaTimezone}/>
            </div>
            <div className={`${layoutConfig.airWindCard} block`}>
                <AirAndWindCard 
                    aqi={weatherData.current.aqi} 
                    windSpeed={weatherData.current.wind_kph} 
                    visibility={weatherData.current.visibility_km}
                    ianaTimezone={weatherData.dateTime.ianaTimezone} 
                />
            </div>
            <div className={`${layoutConfig.citiesHumidity} flex flex-col gap-6 h-full`}>
                <DateTimeCard ianaTimezone={weatherData.dateTime.ianaTimezone} />
                <HumidityCard humidity={weatherData.current.humidity} />
            </div>
            <div className={`${layoutConfig.hourlyForecast} block`}>
                <HourlyForecast data={weatherData.hourly} />
            </div>
            <div className={`${layoutConfig.dailyForecast} block`}>
                <DailyForecastCard data={weatherData.daily} ianaTimezone={weatherData.dateTime.ianaTimezone} />
            </div>
        </div>
    );
};

export default Dashboard;
