import React from 'react';

// SVG illustration for a water drop feel
const HumidityIllustration: React.FC = () => (
    <div className="absolute -bottom-4 -right-4 text-blue-300/50 opacity-50">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.69141C12 2.69141 5 9.69141 5 14.6914C5 18.6914 8.13401 21.6914 12 21.6914C15.866 21.6914 19 18.6914 19 14.6914C19 9.69141 12 2.69141 12 2.69141Z" />
        </svg>
    </div>
);


interface HumidityCardProps {
    humidity: number;
}

const HumidityCard: React.FC<HumidityCardProps> = ({ humidity }) => {
    // Updated function to provide a more accurate description
    const getHumidityDescription = (h: number): string => {
        if (h > 70) return "High";
        if (h < 30) return "Low";
        return "Normal";
    };

    return (
        // New card design with a light gradient and visual humidity bar
        <div className="bg-gradient-to-br from-sky-200 to-cyan-200 text-slate-800 p-6 rounded-3xl shadow-lg relative overflow-hidden h-full flex flex-col justify-between">
            <HumidityIllustration />
            
            <div className="relative z-10 flex justify-between items-start">
                 <div>
                    <h3 className="font-semibold">Humidity</h3>
                    <p className="text-sm text-slate-600 mt-1">{getHumidityDescription(humidity)}</p>
                </div>
                 <div className="bg-white/50 p-2 rounded-full">
                    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.69141C12 2.69141 5 9.69141 5 14.6914C5 18.6914 8.13401 21.6914 12 21.6914C15.866 21.6914 19 18.6914 19 14.6914C19 9.69141 12 2.69141 12 2.69141Z" />
                    </svg>
                 </div>
            </div>

            <div className="relative z-10 mt-4 flex items-end justify-center gap-4">
                <div className="flex items-baseline">
                    <p className="text-6xl font-bold tracking-tighter">{humidity}</p>
                    <p className="text-2xl font-semibold">%</p>
                </div>
                <div className="w-4 h-28 bg-white/40 rounded-full overflow-hidden">
                    <div 
                        className="bg-gradient-to-t from-blue-500 to-cyan-400 w-full transition-all duration-500 ease-out" 
                        style={{ height: `${humidity}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default HumidityCard;