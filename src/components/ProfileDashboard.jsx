import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';

const ProfileDashboard = ({ isDarkMode }) => {
    // Mock Data for Charts
    const footprintData = [
        { month: 'Jul 2025', value: 0 },
        { month: 'Aug 2025', value: 0 },
        { month: 'Sep 2025', value: 0 },
        { month: 'Oct 2025', value: 30 },
        { month: 'Nov 2025', value: 350 },
        { month: 'Dec 2025', value: 0 },
    ];

    const categoryData = [
        { name: 'Transport', value: 40, color: '#22c55e' }, // green-500
        { name: 'Food', value: 30, color: '#0ea5e9' }, // sky-500
        { name: 'Consumption', value: 20, color: '#eab308' }, // yellow-500
        { name: 'Energy', value: 10, color: '#ef4444' }, // red-500
    ];

    // Mock Data for Streak Heatmap (GitHub style)
    // Generating a grid of 7 rows (days) x 53 columns (weeks) for a full year
    const generateHeatmapData = () => {
        const weeks = 53;
        const days = 7;
        const data = [];
        const today = new Date();
        // Start from 52 weeks ago
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - (weeks * days));

        for (let w = 0; w < weeks; w++) {
            const week = [];
            for (let d = 0; d < days; d++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + (w * 7) + d);
                const dateStr = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                // Randomly assign activity levels (0-4)
                const rand = Math.random();
                let level = 0;
                if (rand > 0.85) level = 1;
                if (rand > 0.92) level = 2;
                if (rand > 0.96) level = 3;
                if (rand > 0.99) level = 4;

                // Hardcode some patterns
                if (w > 40 && w < 45 && d > 1 && d < 6) level = Math.floor(Math.random() * 3) + 1;

                week.push({ level, date: dateStr });
            }
            data.push(week);
        }
        return data;
    };

    const heatmapData = generateHeatmapData();

    const getHeatmapColor = (level) => {
        switch (level) {
            case 0: return 'bg-gray-100 dark:bg-gray-700';
            case 1: return 'bg-teal-200 dark:bg-teal-800';
            case 2: return 'bg-teal-300 dark:bg-teal-600';
            case 3: return 'bg-teal-500 dark:bg-teal-500';
            case 4: return 'bg-teal-700 dark:bg-teal-400';
            default: return 'bg-gray-100 dark:bg-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">Your Dashboard</h1>
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Log New Activity
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors duration-300">
                    <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 transition-colors">
                        {/* Font Awesome Tree Icon */}
                        <i className="fas fa-tree text-2xl"></i>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors">Monthly Footprint</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">0 kg CO₂e</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between transition-colors duration-300">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors">Monthly Ranking</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white transition-colors"># /</p>
                    </div>
                    <select className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-600 dark:text-gray-300 outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors">
                        <option>City</option>
                        <option>Global</option>
                    </select>
                </div>
            </div>

            {/* Activity Streak (Heatmap) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white transition-colors">Activity Streak</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 transition-colors">Total Active Days: <span className="font-bold text-gray-800 dark:text-white">0</span> | Max Streak: <span className="font-bold text-gray-800 dark:text-white">0</span></p>
                </div>

                {/* Heatmap Grid */}
                <div className="w-full overflow-x-auto pb-2">
                    <div className="flex gap-[3px] min-w-max">
                        {heatmapData.map((week, wIndex) => (
                            <div key={wIndex} className="flex flex-col gap-[3px]">
                                {week.map((day, dIndex) => (
                                    <div
                                        key={`${wIndex}-${dIndex}`}
                                        className={`w-[10px] h-[10px] rounded-[2px] ${getHeatmapColor(day.level)} hover:ring-2 hover:ring-teal-400 transition-all cursor-pointer relative group`}
                                        title={`${day.date}: ${day.level} activities`}
                                    ></div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2 px-1 font-medium transition-colors">
                    <span>Jan</span>
                    <span>Mar</span>
                    <span>May</span>
                    <span>Jul</span>
                    <span>Sep</span>
                    <span>Nov</span>
                </div>
            </div>

            {/* Footprint Trend Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 transition-colors">Footprint Trend (Last 6 Months)</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={footprintData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#374151' : '#f0f0f0'} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                                    color: isDarkMode ? '#fff' : '#000'
                                }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" dot={{ r: 4, fill: '#14b8a6', strokeWidth: 2, stroke: '#fff' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Breakdown by Category */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 transition-colors">Breakdown by Category</h3>
                <div className="h-64 w-full flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                                    color: isDarkMode ? '#fff' : '#000'
                                }}
                            />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                iconType="rect"
                                formatter={(value, entry) => <span className="text-gray-600 dark:text-gray-300 text-sm ml-1">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProfileDashboard;
