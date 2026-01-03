import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Trade } from '../services/api/tradeService';

interface TradeDetailsModalProps {
    trade: Trade;
    onClose: () => void;
}

const TradeDetailsModal: React.FC<TradeDetailsModalProps> = ({ trade, onClose }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    const openImageViewer = (index: number) => {
        setSelectedImageIndex(index);
    };

    const closeImageViewer = () => {
        setSelectedImageIndex(null);
    };

    const goToNextImage = () => {
        if (selectedImageIndex !== null && trade.images && selectedImageIndex < trade.images.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };

    const goToPreviousImage = () => {
        if (selectedImageIndex !== null && selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    const getImageUrl = (imagePath: string) => {
        // If the path already includes the full URL, return it
        if (imagePath.startsWith('http')) return imagePath;
        // Otherwise, construct the full URL
        return `${API_BASE_URL}/${imagePath}`;
    };

    return (
        <>
            {/* Main Trade Details Modal */}
            <div className="fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <div className="absolute inset-y-0 right-0 w-full max-w-6xl bg-white shadow-2xl overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                        <h2 className="text-2xl font-semibold">Trade Details</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 space-y-6">
                        {/* Trade Overview */}
                        <div
                            className={`rounded-lg p-6 text-black ${trade.profitOrLoss === 'Profit'
                                ? 'bg-gradient-to-r from-green-500 to-gray-100'
                                : 'bg-gradient-to-r from-red-500 to-gray-100'
                                }`}
                        >                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold">{trade.market}</h3>
                                    <p className="text-black mt-1">
                                        {trade.assetType} • {trade.timeframe} • {trade.strategyMethod}
                                    </p>
                                </div>
                                <span className={`px-4 py-2 rounded-full font-semibold ${trade.profitOrLoss === 'Profit'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-red-500 text-white'
                                    }`}>
                                    {trade.profitOrLoss}
                                </span>
                            </div>
                            <p className="text-black text-sm">
                                {new Date(trade.tradeDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        {/* Financial Metrics */}
                        <div className="bg-white border rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Financial Metrics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Planned Stop Loss</p>
                                    <p className="text-xl font-semibold">₹{trade.plannedStopLoss}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Planned Target</p>
                                    <p className="text-xl font-semibold">₹{trade.plannedTarget}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Actual Exit Price</p>
                                    <p className="text-xl font-semibold">₹{trade.actualExitPrice}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Followed Stop Loss</p>
                                    <p className={`text-xl font-semibold text-black`}>
                                        {trade.followedStopLoss ? 'Yes' : 'No'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">R:R Planned</p>
                                    <p className="text-xl font-semibold">{trade.riskRewardPlanned}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">R:R Achieved</p>
                                    <p className="text-xl font-semibold">{trade.riskRewardAchieved}</p>
                                </div>
                            </div>
                        </div>

                        {/* Psychology & Behavior */}
                        <div className="bg-white border rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Psychology & Behavior</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Emotional State During Trade</p>
                                    <div className="flex flex-wrap gap-2">
                                        {trade.emotionalStateDuring && trade.emotionalStateDuring.length > 0 ? (
                                            trade.emotionalStateDuring.map((emotion, index) => (
                                                <span key={index} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
                                                    {emotion}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-sm">None recorded</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Emotional State After Trade</p>
                                    <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
                                        {trade.emotionalStateAfter}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Confidence Level</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-black h-2 rounded-full"
                                                style={{ width: `${((trade.confidenceLevel ?? 0) / 10) * 100}%` }}
                                            />
                                        </div>
                                        <span className="font-semibold">{trade.confidenceLevel ?? 0}/10</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Rules Followed</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-black"
                                                style={{ width: `${trade.rulesFollowed ?? 0}%` }}
                                            />

                                        </div>
                                        <span className="font-semibold">{trade.rulesFollowed ?? 0}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mistakes Made */}
                        {trade.mistakesMade && trade.mistakesMade.length > 0 && (
                            <div className="bg-gray-200 border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Mistakes Made</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {trade.mistakesMade.map((mistake, index) => (
                                        <div key={index} className="flex items-start gap-2">

                                            <span className="text-sm text-gray-800">{mistake}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trade Screenshots */}
                        {trade.images && trade.images.length > 0 && (
                            <div className="bg-white border rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">Trade Screenshots ({trade.images.length})</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {trade.images.map((image, index) => (
                                        <div
                                            key={index}
                                            onClick={() => openImageViewer(index)}
                                            className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#301934] transition-all"
                                        >
                                            <img
                                                src={getImageUrl(image)}
                                                alt={`Trade screenshot ${index + 1}`}
                                                className="w-full h-40 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                                <span className="text-white opacity-0 group-hover:opacity-100 font-semibold">
                                                    View Full Size
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Viewer Modal */}
            {selectedImageIndex !== null && trade.images && (
                <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center">
                    <button
                        onClick={closeImageViewer}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Previous Button */}
                    {selectedImageIndex > 0 && (
                        <button
                            onClick={goToPreviousImage}
                            className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        >
                            <ChevronLeft size={32} />
                        </button>
                    )}

                    {/* Image */}
                    <div className="max-w-6xl max-h-[90vh] p-4">
                        <img
                            src={getImageUrl(trade.images[selectedImageIndex])}
                            alt={`Trade screenshot ${selectedImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                        <div className="text-center mt-4 text-white">
                            <p className="text-sm">
                                Image {selectedImageIndex + 1} of {trade.images.length}
                            </p>
                        </div>
                    </div>

                    {/* Next Button */}
                    {selectedImageIndex < trade.images.length - 1 && (
                        <button
                            onClick={goToNextImage}
                            className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        >
                            <ChevronRight size={32} />
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default TradeDetailsModal;