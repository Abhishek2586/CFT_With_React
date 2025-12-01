import { useState, useEffect } from 'react';

const quotes = [
    { text: "The Earth does not belong to us: we belong to the Earth.", author: "Marlee Matlin" },
    { text: "There is no planet B.", author: "Anonymous" },
    { text: "We do not inherit the earth from our ancestors, we borrow it from our children.", author: "Native American Proverb" },
    { text: "The greatest threat to our planet is the belief that someone else will save it.", author: "Robert Swan" },
    { text: "Time spent among trees is never time wasted.", author: "Katrina Mayer" }
];

const QuotesSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFading(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
                setIsFading(false);
            }, 500); // Wait for fade out before changing text
        }, 5000); // Change quote every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto bg-teal-50 rounded-[3rem] p-12 text-center shadow-sm dark:bg-gray-800 transition-colors duration-300">
                {/* Quote Icon */}
                <div className="mb-6 flex justify-center">
                    <svg className="w-16 h-16 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                    </svg>
                </div>

                {/* Quote Text */}
                <div className={`transition-opacity duration-500 ease-in-out min-h-[150px] flex flex-col justify-center ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                    <h2 className="text-3xl md:text-5xl font-medium text-gray-800 dark:text-white mb-6 leading-tight tracking-tight transition-colors duration-300">
                        {quotes[currentIndex].text}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 italic text-lg font-light transition-colors duration-300">
                        — {quotes[currentIndex].author}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
                    <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Quick Log Activity
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        View Full Dashboard
                    </button>
                </div>
            </div>
        </section>
    );
};

export default QuotesSection;
