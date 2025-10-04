
import React, { useState, useEffect, useRef } from 'react';
import type { LayoutType } from '../hooks/useWeather';
import cities from '../data/cities.ts';

interface HeaderProps {
    onSearch: (city: string) => Promise<boolean>;
    layout: LayoutType;
    setLayout: (layout: LayoutType) => void;
}

const LayoutButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    ariaLabel: string;
}> = ({ onClick, isActive, children, ariaLabel }) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg shadow-md transition-colors ${isActive ? 'bg-orange-400 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
        aria-label={ariaLabel}
    >
        {children}
    </button>
);

const Header: React.FC<HeaderProps> = ({ onSearch, layout, setLayout }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = async (city: string) => {
        if (city.trim()) {
            const success = await onSearch(city.trim());
            if (success) {
                setSearchTerm('');
                setSuggestions([]);
            }
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      if (value.length > 1) {
        const filteredSuggestions = cities
          .filter(city => city.toLowerCase().startsWith(value.toLowerCase()))
          .slice(0, 5);
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            await handleSearch(searchTerm);
        }
    };

    return (
        <header className="relative z-30 flex items-center flex-wrap gap-4 min-h-[3.25rem]">
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full max-w-lg min-w-[200px] sm:min-w-[250px]" ref={searchContainerRef}>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search a City..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-white py-3 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 transition-shadow"
                    />
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
                 {suggestions.length > 0 && (
                    <ul className="absolute z-50 w-full mt-2 bg-white/50 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/30">
                        {suggestions.map(city => (
                            <li 
                                key={city}
                                className="px-4 py-2 cursor-pointer text-slate-800 hover:bg-white/70"
                                onClick={() => handleSearch(city)}
                            >
                                {city}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="ml-auto flex items-center gap-2">
                 <LayoutButton onClick={() => setLayout('default')} isActive={layout === 'default'} ariaLabel="Default grid view">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </LayoutButton>
                <LayoutButton onClick={() => setLayout('compact')} isActive={layout === 'compact'} ariaLabel="Compact list view">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                </LayoutButton>
            </div>
        </header>
    );
};

export default Header;