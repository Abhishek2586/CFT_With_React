import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../App';

// --- API Hook ---
const fetchCommunities = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const emailParam = user.email ? `?email=${user.email}` : '';
    const response = await fetch(`${API_URL}/communities/${emailParam}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

const Community = () => {
    const [filter, setFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const { refetch, data: communities = [], isLoading, error } = useQuery({
        queryKey: ['communities'],
        queryFn: fetchCommunities,
    });

    const handleJoinLeave = async (e, community, action) => {
        e.stopPropagation();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.email) {
            alert("Please login to join communities.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/communities/${community.id}/${action}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email }) // Pass email for auth fallback if needed
            });

            if (res.ok) {
                refetch(); // Refresh list to update counts and membership status
                if (selectedCommunity && selectedCommunity.id === community.id) {
                    // Update selected community state if open
                    setSelectedCommunity(prev => ({
                        ...prev,
                        is_member: action === 'join',
                        members_count: action === 'join' ? prev.members_count + 1 : prev.members_count - 1
                    }));
                }
            } else {
                const err = await res.json();
                alert(`Failed to ${action}: ` + (err.error || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
        }
    };

    // Client-side filtering logic on the fetched list
    const filteredCommunities = communities.filter(c => {
        const matchesFilter = filter === "All" ||
            (filter === "My Communities" && c.is_member) ||
            c.type === filter;
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const myCommunities = communities.filter(c => c.is_member);

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
                        <p className="text-lg md:text-xl text-teal-100 font-medium">Join thousands of Eco-Warriors making a difference together.</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6 text-sm font-semibold">
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                                <i className="fas fa-cloud-meatball"></i> Impact Together
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                                <i className="fas fa-users"></i> {communities.length} Communities
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
                                    <img src={community.image || "https://source.unsplash.com/random/100x100/?nature"} alt={community.name} className="w-12 h-12 rounded-full object-cover border-2 border-teal-100 dark:border-teal-900" />
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-white truncate w-40">{community.name}</h3>
                                        <div className="text-xs text-teal-600 dark:text-teal-400 font-medium truncate w-40">
                                            {community.members_count} Members
                                        </div>
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
                            <div key={community.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => setSelectedCommunity(community)}>
                                <div className="h-32 bg-gray-200 dark:bg-gray-700 relative">
                                    <img src={community.image || community.image_url || "https://source.unsplash.com/random/800x600/?nature"} alt={community.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex gap-1 shadow-sm">
                                        🌿 {community.total_community_emission.toFixed(1)}kg
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{community.name}</h3>
                                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">{community.type}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 h-10">{community.description}</p>

                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-6">
                                        <span className="flex items-center gap-1"><i className="fas fa-user-friends"></i> {community.members_count.toLocaleString()} Members</span>
                                        {community.is_member && <span className="flex items-center gap-1 text-green-500 font-bold"><i className="fas fa-check-circle"></i> Joined</span>}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={(e) => handleJoinLeave(e, community, community.is_member ? 'leave' : 'join')}
                                            className={`flex-1 border ${community.is_member ? 'border-red-500 text-red-500 hover:bg-red-50' : 'border-teal-500 text-teal-500 hover:bg-teal-50'} dark:hover:bg-opacity-10 py-2 rounded-lg font-semibold text-sm transition-colors`}
                                        >
                                            {community.is_member ? 'Leave' : 'Join'}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedCommunity(community); }}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setSelectedCommunity(null)}>
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="relative h-44">
                            <img src={selectedCommunity.image || selectedCommunity.image_url} alt={selectedCommunity.name} className="w-full h-full object-cover" />
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
                                    <i className="fas fa-map-marker-alt"></i> {selectedCommunity.type} • {selectedCommunity.members_count.toLocaleString()} Members
                                </p>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                {selectedCommunity.description}
                            </p>

                            {/* Placeholder for Challenges */}
                            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-5 border border-teal-100 dark:border-teal-800/30">
                                <h3 className="font-bold text-teal-800 dark:text-teal-300 mb-2">Active Challenges</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Join this community to participate in weekly challenges!</p>
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
                            <button
                                onClick={(e) => handleJoinLeave(e, selectedCommunity, selectedCommunity.is_member ? 'leave' : 'join')}
                                className={`px-6 py-2 rounded-lg font-bold text-sm shadow-md transition-colors ${selectedCommunity.is_member ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}
                            >
                                {selectedCommunity.is_member ? 'Leave Community' : 'Join Community'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
