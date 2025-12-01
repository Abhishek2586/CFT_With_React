import React from 'react';

const ActivityItem = ({ icon, title, description, impact, color }) => (
    <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-teal-100 dark:hover:border-teal-900 hover:shadow-md transition-all duration-300 group">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mr-4 ${color}`}>
            {icon}
        </div>
        <div className="flex-grow">
            <h4 className="font-bold text-gray-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold">
                {impact}
            </span>
        </div>
    </div>
);

const RecentActivities = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-teal-800 dark:text-teal-400 mb-6 text-center transition-colors duration-300">Your Recent Activities</h2>
            <div className="space-y-4">
                <ActivityItem
                    icon="🚗"
                    title="Travel: Car (Gasoline)"
                    description="Logged a trip of 25 km."
                    impact="+5.8 kg CO2e"
                    color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                />
                <ActivityItem
                    icon="⚡"
                    title="Energy: Manual Entry"
                    description="Logged 150 kWh of electricity usage."
                    impact="+64.5 kg CO2e"
                    color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                />
                <ActivityItem
                    icon="🍽️"
                    title="Food: Lunch (Red Meat)"
                    description="Logged 1 serving."
                    impact="+2.5 kg CO2e"
                    color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                />
            </div>
            <div className="mt-8 text-center">
                <button className="px-6 py-2 bg-white dark:bg-gray-800 border border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400 font-semibold rounded-full hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors">
                    View More
                </button>
            </div>
        </div>
    );
};

export default RecentActivities;
