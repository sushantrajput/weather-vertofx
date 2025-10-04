
import React from 'react';

const SunnyIcon: React.FC<{className?: string}> = ({className}) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-yellow-400`} viewBox="0 0 20 20" fill="currentColor">
       <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-.707 7.072l.707-.707a1 1 0 10-1.414-1.414l-.707.707a1 1 0 101.414 1.414zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" clipRule="evenodd" />
    </svg>
);

const CloudyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
    </svg>
);

const PartlyCloudyIcon: React.FC<{className?: string}> = ({className}) => (
    <div className={`relative ${className}`}>
      <div className="absolute w-2/3 h-2/3 bg-yellow-400 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      <svg xmlns="http://www.w3.org/2000/svg" className="absolute text-slate-400" viewBox="0 0 20 20" fill="currentColor">
         <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
      </svg>
    </div>
);

const RainyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M15.75 8.25a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zM12.75 8.25a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zM9.75 8.25a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zM5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" clipRule="evenodd" />
    </svg>
);


export const getWeatherIcon = (condition: string, className: string = 'h-8 w-8') => {
    const lowerCondition = condition.toLowerCase();

    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
        return <RainyIcon className={className} />;
    }
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
        return <SunnyIcon className={className} />;
    }
    if (lowerCondition.includes('partly cloudy')) {
        return <PartlyCloudyIcon className={className} />;
    }
    if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
        return <CloudyIcon className={className} />;
    }
    
    // Default Icon
    return <CloudyIcon className={className} />;
};
