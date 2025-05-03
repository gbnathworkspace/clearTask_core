import { useEffect, useState } from 'react';

const LoadingPage = () => {
    const [dots, setDots] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev === 3 ? 1 : prev + 1);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (        
        <div className="flex items-center justify-center w-full h-screen bg-gray-100">
            <div className="flex flex-col items-center">
                {/* Spinner */}
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>

                {/* Loading text with animated dots */}
                <div className="text-xl text-gray-700 font-medium">
                    Loading
                    <span className="inline-block">
                        {'.'.repeat(dots)}
                        <span className="invisible">{'.'.repeat(3 - dots)}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoadingPage;