import React, { useState, useEffect } from "react";
import { Plus, PlusCircle } from "lucide-react";
import TradeForm from "../components/TradeForm";
import TradeDetailsModal from "../components/TradeDetailsModal";
import tradeService, { Trade } from "../services/api/tradeService";

const AddNewTrade = () => {
    const [filter, setFilter] = useState<"7" | "30" | "custom">("7");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isTradeFormOpen, setIsTradeFormOpen] = useState(false);
    const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTrades();
    }, []);

    const fetchTrades = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await tradeService.getAllTrades();
            setTrades(data);
        } catch (err: any) {
            console.error('Error fetching trades:', err);
            setError('Failed to load trades. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTradeSuccess = () => {
        console.log('Trade created successfully!');
        fetchTrades();
    };

    const handleTradeClick = (trade: Trade) => {
        setSelectedTrade(trade);
    };

    const getFilteredTrades = () => {
        if (!trades.length) return [];
        const now = new Date();
        let startDate: Date;

        if (filter === "7") {
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (filter === "30") {
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        } else if (filter === "custom" && fromDate && toDate) {
            const from = new Date(fromDate);
            const to = new Date(toDate);
            return trades.filter(trade => {
                const tradeDate = new Date(trade.tradeDate);
                return tradeDate >= from && tradeDate <= to;
            });
        } else {
            return trades;
        }

        return trades.filter(trade => {
            const tradeDate = new Date(trade.tradeDate);
            return tradeDate >= startDate;
        });
    };

    const filteredTrades = getFilteredTrades();

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">Trades</h1>
                <button
                    onClick={() => setIsTradeFormOpen(true)}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow transition-colors"
                >
                    <Plus size={18} />
                    Add New Trade
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
                <button
                    onClick={() => setFilter("7")}
                    className={`px-4 py-2 rounded-lg border ${filter === "7" ? "bg-gray-800 text-white" : "bg-gray-100"}`}
                >
                    Last 7 Days
                </button>
                <button
                    onClick={() => setFilter("30")}
                    className={`px-4 py-2 rounded-lg border ${filter === "30" ? "bg-gray-800 text-white" : "bg-gray-100"}`}
                >
                    Last 30 Days
                </button>
                <button
                    onClick={() => setFilter("custom")}
                    className={`px-4 py-2 rounded-lg border ${filter === "custom" ? "bg-gray-800 text-white" : "bg-gray-100"}`}
                >
                    Custom Date
                </button>
                {filter === "custom" && (
                    <div className="flex gap-2 items-center">
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        />
                        <span>to</span>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        />
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="bg-white rounded shadow p-8 text-center">
                    <p className="text-gray-600">Loading trades...</p>
                </div>
            ) : filteredTrades.length === 0 ? (
                <div className="bg-white rounded shadow p-8 text-center">
                    <p className="text-gray-600 mb-2">No trades found</p>
                    <p className="text-sm text-gray-500">
                        Click "Add New Trade" to create your first trade entry
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-gradient-to-r from-gray-100 to-gray-300">
                                <tr>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Market</th>
                                    <th className="p-3">Asset Type</th>
                                    <th className="p-3">Timeframe</th>
                                    <th className="p-3">Strategy</th>
                                    <th className="p-3">Entry/Exit</th>
                                    <th className="p-3">R:R</th>
                                    <th className="p-3">Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTrades.map((trade) => (
                                    <tr
                                        key={trade.id}
                                        onClick={() => handleTradeClick(trade)}
                                        className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="p-3 text-sm">
                                            {new Date(trade.tradeDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="p-3 font-medium">{trade.market}</td>
                                        <td className="p-3 text-sm">{trade.assetType}</td>
                                        <td className="p-3 text-sm">{trade.timeframe}</td>
                                        <td className="p-3 text-sm">{trade.strategyMethod}</td>
                                        <td className="p-3 text-sm">
                                            <div className="space-y-1">
                                                <div>SL: ₹{trade.plannedStopLoss}</div>
                                                <div>Target: ₹{trade.plannedTarget}</div>
                                                <div>Exit: ₹{trade.actualExitPrice}</div>
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm">
                                            <div className="space-y-1">
                                                <div className="text-gray-600">Plan: {trade.riskRewardPlanned}</div>
                                                <div className="font-medium">Actual: {trade.riskRewardAchieved}</div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${trade.profitOrLoss === 'Profit'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {trade.profitOrLoss}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 border-t">
                        <p className="text-sm text-gray-600">
                            Showing {filteredTrades.length} {filteredTrades.length === 1 ? 'trade' : 'trades'}
                        </p>
                    </div>
                </div>
            )}

            {/* Trade Form Modal */}
            <TradeForm
                isOpen={isTradeFormOpen}
                onClose={() => setIsTradeFormOpen(false)}
                onSuccess={handleTradeSuccess}
            />

            {/* Trade Details Modal */}
            {selectedTrade && (
                <TradeDetailsModal
                    trade={selectedTrade}
                    onClose={() => setSelectedTrade(null)}
                />
            )}
        </div>
    );
};

export default AddNewTrade;