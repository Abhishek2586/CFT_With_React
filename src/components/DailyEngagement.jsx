import React from 'react';

const EngagementCard = ({ title, icon, children, accentColor }) => (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow duration-300`}>
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentColor}`}></div>
        <div className="flex items-center mb-4 pl-2">
            <span className="text-xl mr-2">{icon}</span>
            <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        </div>
        <div className="flex-grow pl-2">
            {children}
        </div>
    </div>
);

const DailyEngagement = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-teal-800 mb-8 text-center">Daily Engagement</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Today's Challenge */}
                <EngagementCard title="Today's Challenge" icon="🎯" accentColor="bg-teal-500">
                    <p className="text-gray-600 mb-6">Log your first activity!</p>
                    <div className="flex space-x-3">
                        <button className="flex-1 bg-teal-500 text-white py-2 rounded-lg font-semibold hover:bg-teal-600 transition-colors shadow-sm">
                            Accept
                        </button>
                        <button className="flex-1 bg-white border border-gray-200 text-gray-500 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                            Skip
                        </button>
                    </div>
                </EngagementCard>

                {/* Recent Badges */}
                <EngagementCard title="Recent Badges" icon="🏆" accentColor="bg-teal-500">
                    <div className="bg-orange-50 rounded-xl p-4 flex items-start space-x-3 border border-orange-100">
                        <div className="text-3xl bg-white p-1.5 rounded-full shadow-sm">🌟</div>
                        <div>
                            <h4 className="font-bold text-gray-800">Welcome!</h4>
                            <p className="text-xs text-gray-500 mt-1">Start logging activities to earn your first badge.</p>
                        </div>
                    </div>
                </EngagementCard>

                {/* Quick Actions */}
                <EngagementCard title="Quick Actions" icon="⚡" accentColor="bg-teal-500">
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all flex items-center group">
                            <span className="mr-3 text-lg group-hover:scale-110 transition-transform">+</span> Log Activity
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all flex items-center group">
                            <span className="mr-3 text-lg group-hover:scale-110 transition-transform">📈</span> View Reports
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all flex items-center group">
                            <span className="mr-3 text-lg group-hover:scale-110 transition-transform">🎯</span> Set Goal
                        </button>
                    </div>
                </EngagementCard>
            </div>
        </div>
    );
};

export default DailyEngagement;
