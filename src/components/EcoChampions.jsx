import React from 'react';

const EcoChampions = () => {
    const [champions, setChampions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showAll, setShowAll] = React.useState(false);

    React.useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('https://cft-with-react-backend.onrender.com/api/leaderboard/');
                if (res.ok) {
                    const data = await res.json();
                    setChampions(data.leaderboard); // Fetch all (top 50)
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <img src="https://cdn-icons-png.flaticon.com/512/2583/2583344.png" alt="Gold Medal" className="w-6 h-6" />;
            case 2:
                return <img src="https://cdn-icons-png.flaticon.com/512/2583/2583319.png" alt="Silver Medal" className="w-6 h-6" />;
            case 3:
                return <img src="https://cdn-icons-png.flaticon.com/512/2583/2583434.png" alt="Bronze Medal" className="w-6 h-6" />;
            default:
                return <span className="font-bold text-gray-700 dark:text-gray-300">{rank}</span>;
        }
    };

    const visibleChampions = showAll ? champions : champions.slice(0, 5);

    return (
        <section className="py-12 px-4 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <img src="https://cdn-icons-png.flaticon.com/512/3112/3112946.png" alt="Trophy" className="w-8 h-8" />
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">Top Eco Champions</h2>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                    {/* Table Header */}
                    <div className="grid grid-cols-4 bg-gray-50 dark:bg-gray-700 p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-600 transition-colors">
                        <div>Rank</div>
                        <div>User</div>
                        <div className="text-right">XP</div>
                        <div className="text-right">Streak</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-50 dark:divide-gray-700 transition-colors">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading champions...</div>
                        ) : champions.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No champions yet!</div>
                        ) : (
                            visibleChampions.map((champ) => (
                                <div key={champ.rank} className="grid grid-cols-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <div className="pl-2">{getRankIcon(champ.rank)}</div>
                                    <div className="text-gray-800 dark:text-gray-200 font-medium truncate pr-4 transition-colors">
                                        {champ.username}
                                    </div>
                                    <div className="text-right text-gray-600 dark:text-gray-400 transition-colors font-mono">
                                        {champ.xp}
                                    </div>
                                    <div className="text-right text-teal-500 dark:text-teal-400 font-medium transition-colors">
                                        {champ.streak} 🔥
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-teal-600 dark:text-teal-400 font-semibold border border-teal-600 dark:border-teal-400 rounded-lg px-6 py-2 hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {showAll ? 'Show Less' : 'View Full Leaderboard'}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default EcoChampions;
