import { useState } from 'react';

const EmissionsMap = () => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <section className="py-16 px-4 bg-white">
            <div className="container mx-auto max-w-5xl">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                        Annual Global CO₂ Emissions
                    </h2>
                    <p className="text-center text-gray-500 mb-8 max-w-3xl mx-auto">
                        This visualization provides a global perspective on carbon emissions, helping to contextualize our collective and individual impact. All data is sourced from the <strong>Global Carbon Budget (2024)</strong> and presented via <a href="https://ourworldindata.org/co2-emissions" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Our World in Data</a>. We encourage you to explore their work for a deeper understanding.
                    </p>

                    <div className="relative w-full h-[600px] bg-white rounded-lg overflow-hidden shadow-sm">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
                                    <p className="text-gray-500 font-medium">Loading Map...</p>
                                </div>
                            </div>
                        )}
                        <iframe
                            src="https://ourworldindata.org/grapher/annual-co2-emissions-per-country?tab=map&time=latest&country=OWID_WRL~OWID_ASI~IND"
                            loading="lazy"
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            allow="web-share; clipboard-write"
                            onLoad={() => setIsLoading(false)}
                            title="Annual Global CO₂ Emissions Map"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EmissionsMap;
