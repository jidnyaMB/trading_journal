import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, BarChart, Activity } from "lucide-react";
import tradeService, { TradeStatistics } from "../services/api/tradeService";

const Dashboard: React.FC = () => {
    const [statistics, setStatistics] = useState<TradeStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Animated metrics
    const [animatedMetrics, setAnimatedMetrics] = useState({
        total: 0,
        profit: 0,
        loss: 0,
        winRate: 0
    });

    useEffect(() => {
        fetchStatistics();
    }, []);

    useEffect(() => {
        if (statistics) {
            // Reset to 0 before starting animation
            setAnimatedMetrics({ total: 0, profit: 0, loss: 0, winRate: 0 });

            const duration = 1000; // 1 second animation
            const startTime = Date.now();

            const animate = () => {
                const now = Date.now();
                const progress = Math.min((now - startTime) / duration, 1);

                // Ease out function
                const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
                const easedProgress = easeOut(progress);

                setAnimatedMetrics({
                    total: Math.floor(easedProgress * (statistics.totalTrades || 0)),
                    profit: Math.floor(easedProgress * (statistics.profitTrades || 0)),
                    loss: Math.floor(easedProgress * (statistics.lossTrades || 0)),
                    winRate: Math.floor(easedProgress * (Number(statistics.winRate) || 0))
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            const timeout = setTimeout(() => {
                requestAnimationFrame(animate);
            }, 100);

            return () => clearTimeout(timeout);
        }
    }, [statistics]);


    const fetchStatistics = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await tradeService.getTradeStatistics();
            setStatistics(data);
        } catch (err: any) {
            console.error("Error fetching statistics:", err);
            setError("Failed to load statistics");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-sm p-4 md:p-6 animate-pulse"
                        >
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <div className="bg-gradient-to-br from-purple-100 to-white rounded-xl shadow-sm p-4 md:p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-xs md:text-sm text-gray-500 mb-1">Total Trades</p>
                            <h2 className="text-xl md:text-3xl font-bold text-[#301934]">
                                {animatedMetrics.total}
                            </h2>
                        </div>
                        <div className="bg-purple-100 text-[#301934] p-2 md:p-3 rounded-full">
                            <BarChart size={20} className="md:w-6 md:h-6" />
                        </div>
                    </div>

                    {/* Profitable Trades */}
                    <div className="bg-gradient-to-br from-green-100 to-white rounded-xl shadow-sm p-4 md:p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-xs md:text-sm text-gray-500 mb-1">Profitable Trades</p>
                            <h2 className="text-xl md:text-3xl font-bold text-black">
                                {animatedMetrics.profit}
                            </h2>
                        </div>
                        <div className="bg-green-100 text-green-600 p-2 md:p-3 rounded-full">
                            <TrendingUp size={20} className="md:w-6 md:h-6" />
                        </div>
                    </div>

                    {/* Loss Trades */}
                    <div className="bg-gradient-to-br from-red-100 to-white rounded-xl shadow-sm p-4 md:p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-xs md:text-sm text-gray-500 mb-1">Loss Trades</p>
                            <h2 className="text-xl md:text-3xl font-bold text-black">
                                {animatedMetrics.loss}
                            </h2>
                        </div>
                        <div className="bg-red-100 text-red-600 p-2 md:p-3 rounded-full">
                            <TrendingDown size={20} className="md:w-6 md:h-6" />
                        </div>
                    </div>

                    {/* Win Rate (Animated) */}
                    <div className="bg-gradient-to-br from-blue-100 to-white rounded-xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-xs md:text-sm text-gray-500 mb-1">Win Rate</p>
                                <h2 className="text-xl md:text-3xl font-bold text-black">
                                    {animatedMetrics.winRate}%
                                </h2>
                            </div>
                            <div className="bg-blue-100 text-blue-600 p-2 md:p-3 rounded-full">
                                <Activity size={20} className="md:w-6 md:h-6" />
                            </div>
                        </div>

                        <div className="w-full h-1.5 md:h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-black rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${animatedMetrics.winRate}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {!loading && statistics && statistics.totalTrades === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <p className="text-gray-600 mb-2">No trades recorded yet</p>
                    <p className="text-sm text-gray-500">
                        Start tracking your trades to see statistics and insights
                    </p>
                </div>
            )}

            {!loading && statistics && statistics.totalTrades > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Performance Summary
                        </h3>

                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-2 rounded-full bg-black transition-all duration-1000 ease-out"
                                style={{ width: `${animatedMetrics.winRate}%` }}
                            />
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-black">
                                    {statistics.profitTrades}
                                </p>
                                <p className="text-xs text-gray-500">Winners</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-black">
                                    {statistics.lossTrades}
                                </p>
                                <p className="text-xs text-gray-500">Losers</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
