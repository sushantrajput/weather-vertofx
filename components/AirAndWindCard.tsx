
import React, { useState, useEffect } from 'react';
import themesData from '../data/themes.ts';

type Period = 'day' | 'night' | 'sunrise' | 'sunset';

// --- SVG Helper Functions ---
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians)),
    };
};
  
const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number): string => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const d = [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    ].join(' ');
    return d;
};


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
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 8) return 'sunrise';
        if (hour >= 8 && hour < 18) return 'day';
        if (hour >= 18 && hour < 21) return 'sunset';
        return 'night';
    }
};

const themes = themesData.airAndWindCard;

const getAqiDescription = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Some";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
};

interface GaugeProps {
    value: number;
    maxValue: number;
    title: string;
    description?: string;
    unit: string;
    theme: typeof themes[Period];
}

const Gauge: React.FC<GaugeProps> = ({ value, maxValue, title, description, unit, theme }) => {
    const angleRange = 270; // from -135 to +135 degrees
    const startAngle = -135;
    
    const [animatedAngle, setAnimatedAngle] = useState(startAngle);

    useEffect(() => {
        const progress = Math.min(Math.max(value / maxValue, 0), 1);
        const targetAngle = startAngle + progress * angleRange;
        
        // Use a short timeout to ensure the transition is visible on mount
        const animationTimeout = setTimeout(() => {
            setAnimatedAngle(targetAngle);
        }, 100);

        return () => clearTimeout(animationTimeout);
    }, [value, maxValue]);

    const backgroundArc = describeArc(50, 50, 40, startAngle, startAngle + angleRange);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-center">
            <div className={`relative w-28 h-28 ${theme.needle}`}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Background track */}
                    <path
                        d={backgroundArc}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="opacity-30"
                    />

                    {/* Needle */}
                    <g style={{ transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)' }} transform={`rotate(${animatedAngle} 50 50)`}>
                        <path d="M 50 50 L 50 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 50 50 L 50 60" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                    </g>
                    {/* Center Hub */}
                    <circle cx="50" cy="50" r="6" fill="currentColor" />
                    <circle cx="50" cy="50" r="3" fill={theme.bg.includes('black') || theme.bg.includes('indigo-900') ? '#334155' : '#f1f5f9' } />
                </svg>
            </div>
            <p className="font-semibold text-xs opacity-90 mt-1">{title}</p>
            <div className="flex items-baseline">
                <span className="text-xl font-bold tracking-tight">{Math.round(value)}</span>
                {unit && <span className="text-xs ml-1 opacity-70 font-medium">{unit}</span>}
            </div>
            {description && <p className="text-xs opacity-70 font-medium">{description}</p>}
        </div>
    );
};

const getVisibilityDescription = (vis: number): string => {
    if (vis >= 10) return "Excellent";
    if (vis >= 5) return "Good";
    if (vis >= 2) return "Moderate";
    return "Poor";
};

const VisibilityDisplay: React.FC<{ visibility: number; theme: typeof themes[Period] }> = ({ visibility, theme }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
                 <div className="w-20 h-20 rounded-full bg-current/5 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-current/10 flex items-center justify-center">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-80" viewBox="0 0 20 20" fill="url(#eye-gradient)">
                            <defs>
                                <linearGradient id="eye-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{stopColor: 'currentColor', stopOpacity: 0.8}} />
                                <stop offset="100%" style={{stopColor: 'currentColor', stopOpacity: 1}} />
                                </linearGradient>
                            </defs>
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                 </div>
            </div>
            <p className="font-semibold text-xs opacity-90 mt-1">Visibility</p>
            <div className="flex items-baseline">
                <span className="text-xl font-bold tracking-tight">{Math.round(visibility)}</span>
                <span className="text-xs ml-1 opacity-70 font-medium">km</span>
            </div>
            <p className="text-xs opacity-70 font-medium">{getVisibilityDescription(visibility)}</p>
        </div>
    );
};

interface AirAndWindCardProps {
    aqi: number;
    windSpeed: number;
    visibility: number;
    ianaTimezone: string;
}

const AirAndWindCard: React.FC<AirAndWindCardProps> = ({ aqi, windSpeed, visibility, ianaTimezone }) => {
    const period = getPeriodOfDay(ianaTimezone);
    const theme = themes[period as Period];

    return (
        <div className={`bg-gradient-to-br ${theme.bg} backdrop-blur-md p-2 rounded-3xl shadow-lg h-full ${theme.text} flex flex-col sm:flex-row items-center justify-around gap-2`}>
            <Gauge 
                value={aqi}
                maxValue={350}
                title="Air Quality"
                description={getAqiDescription(aqi)}
                unit=""
                theme={theme}
            />
            <div className={`w-full sm:w-px h-px sm:h-2/3 ${theme.divider}`} />
            <VisibilityDisplay
                visibility={visibility}
                theme={theme}
            />
            <div className={`w-full sm:w-px h-px sm:h-2/3 ${theme.divider}`} />
            <Gauge 
                value={windSpeed}
                maxValue={80}
                title="Wind Speed"
                unit="km/h"
                theme={theme}
            />
        </div>
    );
};

export default AirAndWindCard;