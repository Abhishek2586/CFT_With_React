import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../App';

// --- Dummy Data (Fallback) ---
const mockCommunities = [
    {
        id: 1,
        name: "Green Tech Corp",
        description: "Employees of Green Tech uniting to reduce office waste and commute emissions.",
        members: 1240,
        type: "Corporate",
        eco_score: 3,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        next_event: "Office Recycling Drive (Fri)",
        leaderboard: [
            { name: "Alice", score: "120kg" },
            { name: "Bob", score: "95kg" },
            { name: "Charlie", score: "88kg" }
        ],
        active_challenge: "Zero Waste Week",
        challenge_progress: 65,
        latest_post: "Just installed new recycling bins on the 3rd floor!"
    },
    {
        id: 2,
        name: "Mumbai Cyclists",
        description: "A community for cycling enthusiasts in Mumbai. Pedal for the planet!",
        members: 850,
        type: "Neighborhood",
        eco_score: 3,
        image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=80",
        next_event: "Sunday Morning Ride (Sun)",
        leaderboard: [
            { name: "Raj", score: "200kg" },
            { name: "Simran", score: "180kg" },
            { name: "Vikram", score: "150kg" }
        ],
        active_challenge: "1000km Collective Ride",
        challenge_progress: 80,
        latest_post: "Best route from Bandra to Colaba? Any suggestions?"
    },
    {
        id: 3,
        name: "Eco-Students IITB",
        description: "Students of IIT Bombay working towards a sustainable campus.",
        members: 3200,
        type: "University",
        eco_score: 3,
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
        next_event: "Campus Clean-up (Sat)",
        leaderboard: [
            { name: "Priya", score: "150kg" },
            { name: "Rahul", score: "140kg" },
            { name: "Sneha", score: "130kg" }
        ],
        active_challenge: "Plastic-Free Canteen",
        challenge_progress: 40,
        latest_post: "Meeting at the main gate at 9 AM for the clean-up."
    },
    {
        id: 4,
        name: "Urban Gardeners",
        description: "Growing our own food in the concrete jungle. Balcony and terrace gardens.",
        members: 560,
        type: "Neighborhood",
        eco_score: 2,
        image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
        next_event: "Composting Workshop (Sun)",
        leaderboard: [
            { name: "Anita", score: "90kg" },
            { name: "Suresh", score: "85kg" },
            { name: "Meera", score: "80kg" }
        ],
        active_challenge: "Grow Your Own Herbs",
        challenge_progress: 20,
        latest_post: "My tomatoes are finally turning red!"
    },
    {
        id: 5,
        name: "Solar Enthusiasts",
        description: "Discussing solar panels, batteries, and renewable energy for homes.",
        members: 120,
        type: "Neighborhood",
        eco_score: 2,
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
        next_event: "Webinar: Solar Subsidies (Tue)",
        leaderboard: [
            { name: "Karan", score: "300kg" },
            { name: "Arjun", score: "280kg" },
            { name: "Neha", score: "250kg" }
        ],
        active_challenge: "Go Off-Grid for an Hour",
        challenge_progress: 10,
        latest_post: "Has anyone tried the new hybrid inverters?"
    },
    {
        id: 6,
        name: "Sustainable Fashion",
        description: "Thrifting, upcycling, and ethical fashion choices.",
        members: 2100,
        type: "Neighborhood",
        eco_score: 3,
        image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
        next_event: "Clothes Swap Party (Sat)",
        leaderboard: [
            { name: "Zara", score: "110kg" },
            { name: "Kabir", score: "105kg" },
            { name: "Riya", score: "100kg" }
        ],
        active_challenge: "No New Clothes Month",
        challenge_progress: 90,
        latest_post: "Found this amazing vintage jacket at the flea market!"
    }
];

const myCommunitiesIds = [1, 2]; // IDs of communities the user has joined

const fetchCommunities = async () => {
    // In a real app, this would be:
    // const response = await fetch(`${API_URL}/communities/`);
    // if (!response.ok) throw new Error('Network response was not ok');
    // return response.json();

    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCommunities;
};

const Community = () => {
    const [filter, setFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCommunity, setSelectedCommunity] = useState(null);

    const { data: communities = [], isLoading, error } = useQuery({
        queryKey: ['communities'],
        queryFn: fetchCommunities,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const myCommunities = communities.filter(c => myCommunitiesIds.includes(c.id));

    const filteredCommunities = communities.filter(c => {
        const matchesFilter = filter === "All" ||
            (filter === "My Communities" && myCommunitiesIds.includes(c.id)) ||
            c.type === filter;
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-red-500">
                Error loading communities: {error.message}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300 font-sans">

            {/* 1. Header Section */}
            <div className="relative bg-gradient-to-r from-teal-600 to-green-500 dark:from-teal-800 dark:to-green-700 text-white p-8 md:p-12 rounded-b-3xl shadow-lg mb-8 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                {/* Floating Leaves Animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <i
                            key={i}
                            className={`fas fa-leaf absolute text-white/60`}
                            style={{
                                fontSize: `${Math.random() * 20 + 20}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                                animationDelay: `-${Math.random() * 10}s`
                            }}
                        ></i>
                    ))}
                    <style>{`
                        @keyframes float {
                            0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                            10% { opacity: 0.8; }
                            90% { opacity: 0.8; }
                            100% { transform: translate(100px, -100px) rotate(360deg); opacity: 0; }
                        }
                    `}</style>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">Community Hub 🌍</h1>
                        <p className="text-lg md:text-xl text-teal-100 font-medium">Join 12,500+ Eco-Warriors making a difference together.</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6 text-sm font-semibold">
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                                <i className="fas fa-cloud-meatball"></i> 500 Tons CO₂ Saved
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                                <i className="fas fa-users"></i> 150 Active Communities
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                                <i className="fas fa-flag-checkered"></i> 50 Ongoing Challenges
                            </div>
                        </div>
                    </div>

                    <button className="bg-white text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-full font-bold shadow-md transition-transform transform hover:scale-105 flex items-center gap-2">
                        <i className="fas fa-plus-circle"></i> Create Community
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 pb-12">

                {/* 2. Navigation/Filter Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search communities..."
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                        {["All", "My Communities", "University", "Corporate", "Neighborhood"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === tab
                                    ? "bg-teal-500 text-white shadow-md"
                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. My Communities Section (Horizontal Scroll) */}
                {myCommunities.length > 0 && filter === "All" && (
                    <div className="mb-10">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <i className="fas fa-heart text-red-500"></i> My Communities
                        </h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                            {myCommunities.map(community => (
                                <div key={community.id} className="min-w-[280px] bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedCommunity(community)}>
                                    <img src={community.image} alt={community.name} className="w-12 h-12 rounded-full object-cover border-2 border-teal-100 dark:border-teal-900" />
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-white truncate w-40">{community.name}</h3>
                                        <p className="text-xs text-teal-600 dark:text-teal-400 font-medium truncate w-40">
                                            <i className="fas fa-calendar-alt mr-1"></i> {community.next_event}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Discover Communities Grid */}
                <div>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <i className="fas fa-compass text-teal-500"></i> Discover Communities
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCommunities.map(community => (
                            <div key={community.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                                <div className="h-32 bg-gray-200 dark:bg-gray-700 relative">
                                    <img src={community.image} alt={community.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex gap-1 shadow-sm">
                                        {[...Array(community.eco_score)].map((_, i) => (
                                            <span key={i}>🌿</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{community.name}</h3>
                                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">{community.type}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 h-10">{community.description}</p>

                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-6">
                                        <span className="flex items-center gap-1"><i className="fas fa-user-friends"></i> {community.members.toLocaleString()} Members</span>
                                        <span className="flex items-center gap-1"><i className="fas fa-trophy text-yellow-500"></i> Top 10%</span>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="flex-1 border border-teal-500 text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/30 py-2 rounded-lg font-semibold text-sm transition-colors">
                                            Join
                                        </button>
                                        <button
                                            onClick={() => setSelectedCommunity(community)}
                                            className="flex-1 bg-teal-500 text-white hover:bg-teal-600 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredCommunities.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <i className="fas fa-search text-4xl mb-4 opacity-50"></i>
                            <p>No communities found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 5. Community Detail Modal */}
            {selectedCommunity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
                        {/* Modal Header */}
                        <div className="relative h-40">
                            <img src={selectedCommunity.image} alt={selectedCommunity.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <button
                                onClick={() => setSelectedCommunity(null)}
                                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <div className="absolute bottom-4 left-6 text-white">
                                <h2 className="text-3xl font-bold">{selectedCommunity.name}</h2>
                                <p className="text-sm opacity-90 flex items-center gap-2">
                                    <i className="fas fa-map-marker-alt"></i> {selectedCommunity.type} • {selectedCommunity.members.toLocaleString()} Members
                                </p>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:p-8 space-y-8">

                            {/* Active Challenge */}
                            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-5 border border-teal-100 dark:border-teal-800/30">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-teal-800 dark:text-teal-300 flex items-center gap-2">
                                        <i className="fas fa-fire text-orange-500"></i> Active Challenge
                                    </h3>
                                    <span className="text-xs font-bold bg-white dark:bg-gray-800 text-teal-600 px-2 py-1 rounded shadow-sm">Ends in 3 days</span>
                                </div>
                                <p className="text-lg font-bold text-gray-800 dark:text-white mb-2">{selectedCommunity.active_challenge}</p>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                                    <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${selectedCommunity.challenge_progress}%` }}></div>
                                </div>
                                <p className="text-right text-xs text-gray-500 dark:text-gray-400">{selectedCommunity.challenge_progress}% Goal Reached</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Leaderboard */}
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                        <i className="fas fa-medal text-yellow-500"></i> Top Contributors
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedCommunity.leaderboard.map((user, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                                                        }`}>
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
                                                </div>
                                                <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{user.score}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Discussion Teaser */}
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                        <i className="fas fa-comments text-blue-500"></i> Latest Discussion
                                    </h3>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex-shrink-0"></div>
                                            <div>
                                                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium mb-1">"{selectedCommunity.latest_post}"</p>
                                                <p className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">View 12 replies</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full mt-4 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        View All Discussions
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                            <button
                                onClick={() => setSelectedCommunity(null)}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white font-medium text-sm transition-colors"
                            >
                                Close
                            </button>
                            <button className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-teal-700 transition-colors">
                                Join Community
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
