
import React, { useState } from 'react';
import Header from './components/Header';
import ErrorModal from './components/ErrorModal';
import Dashboard from './components/Dashboard';
import { useWeather } from './hooks/useWeather';
import type { LayoutType } from './hooks/useWeather';
import layoutConfig from './data/layoutConfig.ts';

const App: React.FC = () => {
  const [layout, setLayout] = useState<LayoutType>('default');
  const { weatherData, loading, error, targetCity, searchForCity, setError } = useWeather('Pune');
  
  const currentLayout = layoutConfig[layout];

  return (
    <div className="min-h-screen w-full text-slate-800 font-sans bg-slate-200">
        <div className="fixed inset-0 z-0 bg-cover bg-center" style={{backgroundImage: "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 1600 900%27%3e%3cdefs%3e%3clinearGradient id=%27a%27 x1=%270%25%27 y1=%270%25%27 x2=%27100%25%27 y2=%27100%25%27%3e%3cstop offset=%270%25%27 stop-color=%27%23FA8BFF%27 /%3e%3cstop offset=%27100%25%27 stop-color=%27%232BD2FF%27 /%3e%3c/linearGradient%3e%3clinearGradient id=%27b%27 x1=%27100%25%27 y1=%270%25%27 x2=%270%25%27 y2=%27100%25%27%3e%3cstop offset=%270%25%27 stop-color=%27%23FFB394%27 /%3e%3cstop offset=%27100%25%27 stop-color=%27%23FFD594%27 /%3e%3c/linearGradient%3e%3c/defs%3e%3cg fill=%27%23FFF%27 fill-opacity=%270.0%27%3e%3crect x=%270%27 y=%270%27 width=%271600%27 height=%27900%27/%3e%3c/g%3e%3cg filter=%27url(%23f1)%27%3e%3ccircle cx=%27600%27 cy=%27300%27 r=%27200%27 fill=%27url(%23a)%27/%3e%3ccircle cx=%271000%27 cy=%27600%27 r=%27200%27 fill=%27url(%23b)%27/%3e%3c/g%3e%3cdefs%3e%3cfilter id=%27f1%27 x=%27-200%25%27 y=%27-200%25%27 width=%27500%25%27 height=%27500%25%27%3e%3cfeGaussianBlur in=%27SourceGraphic%27 stdDeviation=%27100%27/%3e%3c/filter%3e%3c/defs%3e%3c/svg%3e')"}} />
        <main className="relative z-10 p-4 md:p-6 lg:h-screen overflow-hidden">
            <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-4 md:p-6 h-full flex flex-col lg:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {loading && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl">
                    <div className="flex items-center gap-4">
                      <svg className="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-lg font-semibold text-slate-700">Fetching Weather Data for {targetCity}...</span>
                    </div>
                  </div>
                )}
                <Header onSearch={searchForCity} layout={layout} setLayout={setLayout} />
                
                <ErrorModal message={error} onClose={() => setError(null)} />

                {weatherData ? (
                   <Dashboard weatherData={weatherData} layoutConfig={currentLayout} />
                ) : (
                  !loading && !error && <div className="flex-1 flex items-center justify-center text-slate-500 mt-6">Search for a city to get the weather forecast.</div>
                )}
            </div>
        </main>
    </div>
  );
};

export default App;
