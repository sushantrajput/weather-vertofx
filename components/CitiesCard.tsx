import React, { useState, useEffect } from 'react';

interface DateTimeCardProps {
    ianaTimezone: string;
}

const DateTimeCard: React.FC<DateTimeCardProps> = ({ ianaTimezone }) => {
    const [currentTime, setCurrentTime] = useState({
        timeValue: '--:--',
        ampm: '',
        date: 'Loading...',
        timezoneAbbr: ''
    });

    useEffect(() => {
        const updateClock = () => {
            if (!ianaTimezone) return;

            try {
                const now = new Date();
                
                const date = now.toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                    timeZone: ianaTimezone,
                });

                const timeString = now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    timeZone: ianaTimezone,
                });
                const [timeValue, ampm] = timeString.split(' ');

                const timezoneAbbr = now.toLocaleTimeString('en-US', {
                    timeZoneName: 'short',
                    timeZone: ianaTimezone,
                }).split(' ').pop() || '';

                setCurrentTime({ timeValue, ampm, date, timezoneAbbr });

            } catch (error) {
                console.error("Invalid timezone:", ianaTimezone, error);
                // Fallback to local time if timezone is invalid
                const now = new Date();
                const date = now.toLocaleDateString('en-US', {
                   weekday: 'long',
                   day: 'numeric',
                   month: 'short',
               });
               const timeString = now.toLocaleTimeString('en-US', {
                   hour: '2-digit',
                   minute: '2-digit',
                   hour12: true,
               });
               const [timeValue, ampm] = timeString.split(' ');
               const timezoneAbbr = now.toLocaleTimeString('en-US', {
                   timeZoneName: 'short',
               }).split(' ').pop() || '';
                setCurrentTime({ timeValue, ampm, date, timezoneAbbr });
            }
        };

        updateClock(); // Initial call to display time immediately
        const intervalId = setInterval(updateClock, 1000); // Update every second

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [ianaTimezone]);

    return (
        <div className="bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center h-full text-slate-800 flex-1">
            <div className="flex items-baseline">
                <p className="text-6xl font-bold tracking-tighter">{currentTime.timeValue}</p>
                <p className="text-2xl font-semibold ml-2">{currentTime.ampm}</p>
            </div>
            <div className="flex items-center gap-2 mt-2 opacity-80">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-md font-medium">{currentTime.date}</p>
            </div>
            <p className="text-sm opacity-60 mt-1">({currentTime.timezoneAbbr})</p>
        </div>
    );
};

export default DateTimeCard;