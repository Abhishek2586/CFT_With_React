import React from 'react';

const EngagementCard = ({ title, icon, children, accentColor }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col relative overflow-hidden group hover:shadow-md transition-all duration-300`}>
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentColor}`}></div>
        <div className="flex items-center mb-4 pl-2">
            <span className="text-xl mr-2">{icon}</span>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg transition-colors">{title}</h3>
        </div>
        <div className="flex-grow pl-2">
            {children}
        </div>
    </div>
);

const DailyEngagement = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-teal-800 dark:text-teal-400 mb-8 text-center transition-colors duration-300">Daily Engagement</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Today's Challenge */}
                <EngagementCard title="Today's Challenge" icon="🎯" accentColor="bg-teal-500">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Log your first activity!</p>
                    <div className="flex space-x-3">
                        <button className="flex-1 bg-teal-500 text-white py-2 rounded-lg font-semibold hover:bg-teal-600 transition-colors shadow-sm">
                            Accept
                        </button>
                        <button className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                            Skip
                        </button>
                    </div>
                </EngagementCard>

                {/* Recent Badges */}
                <EngagementCard title="Recent Badges" icon="🏆" accentColor="bg-teal-500">
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 flex items-start space-x-3 border border-orange-100 dark:border-orange-900/30">
                        <div className="text-3xl bg-white dark:bg-gray-700 p-1.5 rounded-full shadow-sm">🌟</div>
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-white">Welcome!</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Start logging activities to earn your first badge.</p>
                        </div>
                    </div>
                </EngagementCard>

                {/* Quick Actions */}
                <EngagementCard title="Quick Actions" icon="⚡" accentColor="bg-teal-500">
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 font-medium hover:border-teal-500 dark:hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-gray-600 transition-all flex items-center group">
                            <span className="mr-3 text-lg group-hover:scale-110 transition-transform">+</span> Log Activity
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 font-medium hover:border-teal-500 dark:hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-gray-600 transition-all flex items-center group">
                            <span className="mr-3 text-lg group-hover:scale-110 transition-transform">📈</span> View Reports
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 font-medium hover:border-teal-500 dark:hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-gray-600 transition-all flex items-center group">
                            <span className="mr-3 text-lg group-hover:scale-110 transition-transform">🎯</span> Set Goal
                        </button>
                    </div>
                </EngagementCard>
            </div>
        </div>
    );
};

export default DailyEngagement;
