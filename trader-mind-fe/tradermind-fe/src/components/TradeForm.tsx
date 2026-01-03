import React, { useState, FormEvent } from 'react';
import { X, Upload, Trash2, AlertCircle } from 'lucide-react';
import tradeService, { CreateTradeDto } from '../services/api/tradeService';

interface TradeFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const TradeForm: React.FC<TradeFormProps> = ({ isOpen, onClose, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<CreateTradeDto>({
        market: '', assetType: '' as any, timeframe: '' as any, strategyMethod: '' as any,
        plannedStopLoss: 0, plannedTarget: 0, actualExitPrice: 0,
        riskRewardPlanned: '', riskRewardAchieved: '', followedStopLoss: true,
        emotionalStateDuring: [], emotionalStateAfter: '', confidenceLevel: 5,
        mistakesMade: [], rulesFollowed: 50, profitOrLoss: '' as any,
    });
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const handleChange = (e: any) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleCheckbox = (name: string, value: string) => {
        setFormData(prev => {
            const arr = (prev[name as keyof CreateTradeDto] as string[]) || [];
            return { ...prev, [name]: arr.includes(value) ? arr.filter(i => i !== value) : [...arr, value] };
        });
    };

    const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (images.length + files.length > 5) return;
        setImages(prev => [...prev, ...files]);
        files.forEach(f => {
            const reader = new FileReader();
            reader.onloadend = () => setPreviews(prev => [...prev, reader.result as string]);
            reader.readAsDataURL(f);
        });
    };

    const removeImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
        setPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const validate = () => true;


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await tradeService.createTrade(formData, images);
            setTimeout(() => { onClose(); onSuccess?.(); }, 1000);
        } catch (error: any) {
            setErrors({ submit: error.response?.data?.message || 'Failed to create trade' });
        } finally {
            setIsSubmitting(false);
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="absolute inset-y-0 right-0 w-full max-w-6xl bg-white shadow-2xl">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Add New Trade</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-140px)] px-6 py-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded flex gap-2">
                                <AlertCircle size={20} /><span>{errors.submit}</span>
                            </div>
                        )}

                        {/* Trade Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Trade Details</h3>
                            <div>
                                <label className="block text-sm font-medium mb-1">Market/Instrument</label>
                                <input type="text" name="market" value={formData.market} onChange={handleChange}
                                    placeholder="NIFTY, BANKNIFTY, BTC" className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Asset Type</label>
                                <select name="assetType" value={formData.assetType} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                                    <option value="">Select</option>
                                    {['Equity', 'Options', 'Futures', 'Crypto', 'Forex'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            {/* Timeframe */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Timeframe</label>
                                <select name="timeframe" value={formData.timeframe} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                                    <option value="">Select</option>
                                    {['1m', '5m', '15m', '1H', 'Daily'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Strategy Method</label>
                                <div className="flex gap-4">
                                    {['Zone Breakout', 'EMA Pullback', 'Liquidity Sweep'].map(s => (
                                        <label key={s} className="flex items-center">
                                            <input type="radio" name="strategyMethod" value={s} checked={formData.strategyMethod === s}
                                                onChange={() => setFormData(p => ({ ...p, strategyMethod: s as any }))} className="mr-2" />
                                            {s}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Financial Metrics */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Financial Metrics</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Planned Stop Loss (₹)</label>
                                    <input type="number" name="plannedStopLoss" value={formData.plannedStopLoss || ''}
                                        onChange={handleChange} step="0.01" className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Planned Target (₹)</label>
                                    <input type="number" name="plannedTarget" value={formData.plannedTarget || ''}
                                        onChange={handleChange} step="0.01" className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Actual Exit Price (₹)</label>
                                    <input type="number" name="actualExitPrice" value={formData.actualExitPrice || ''}
                                        onChange={handleChange} step="0.01" className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">R:R Planned</label>
                                    <input type="text" name="riskRewardPlanned" value={formData.riskRewardPlanned}
                                        onChange={handleChange} placeholder="1:2" className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">R:R Achieved</label>
                                    <input type="text" name="riskRewardAchieved" value={formData.riskRewardAchieved}
                                        onChange={handleChange} placeholder="1:1.8" className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Profit/Loss</label>
                                    <div className="flex gap-4">
                                        {['Profit', 'Loss'].map(v => (
                                            <label key={v} className="flex items-center">
                                                <input type="radio" checked={formData.profitOrLoss === v}
                                                    onChange={() => setFormData(p => ({ ...p, profitOrLoss: v as any }))} className="mr-2" />
                                                {v}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Followed Stop Loss?</label>
                                <div className="flex gap-4">
                                    {[{ l: 'Yes', v: true }, { l: 'No', v: false }].map(o => (
                                        <label key={o.l} className="flex items-center">
                                            <input type="radio" checked={formData.followedStopLoss === o.v}
                                                onChange={() => setFormData(p => ({ ...p, followedStopLoss: o.v }))} className="mr-2" />
                                            {o.l}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Psychology */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Psychology & Behavior</h3>
                            <div>
                                <label className="block text-sm font-medium mb-2">Emotional State During</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Calm', 'Confident', 'Anxious', 'Fearful', 'Greedy', 'Overconfident', 'Frustrated', 'Hesitant'].map(e => (
                                        <label key={e} className="flex items-center">
                                            <input type="checkbox" checked={formData.emotionalStateDuring?.includes(e)}
                                                onChange={() => handleCheckbox('emotionalStateDuring', e)} className="mr-2" />
                                            {e}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Emotional State After</label>
                                <select name="emotionalStateAfter" value={formData.emotionalStateAfter} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
                                    <option value="">Select</option>
                                    {['Satisfied', 'Regretful', 'Angry', 'Neutral', 'Proud', 'Disappointed'].map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Confidence Level ({formData.confidenceLevel}/10)</label>
                                <input type="range" min="1" max="10" value={formData.confidenceLevel}
                                    onChange={(e) => setFormData(p => ({ ...p, confidenceLevel: parseInt(e.target.value) }))}
                                    className="w-full accent-[#301934]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Mistakes Made</label>
                                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border p-3 rounded-lg">
                                    {['Overtrading', 'Revenge trading', 'Risked too much', 'Entered without confirmation',
                                        'Entered late', 'Exited too early', 'Exited too late', 'FOMO entry', 'Ignored stop loss',
                                        'Moved stop loss', 'No predefined target', 'Took trade out of boredom',
                                        'Traded against trend', 'News-based emotional entry'].map(m => (
                                            <label key={m} className="flex items-start">
                                                <input type="checkbox" checked={formData.mistakesMade?.includes(m)}
                                                    onChange={() => handleCheckbox('mistakesMade', m)} className="mr-2 mt-0.5" />
                                                <span className="text-sm">{m}</span>
                                            </label>
                                        ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Rules Followed ({formData.rulesFollowed}%)</label>
                                <input type="range" min="0" max="100" step="5" value={formData.rulesFollowed}
                                    onChange={(e) => setFormData(p => ({ ...p, rulesFollowed: parseInt(e.target.value) }))}
                                    className="w-full accent-[#301934]" />
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Screenshots</h3>
                            <div>
                                <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" id="img" disabled={images.length >= 5} />
                                <label htmlFor="img" className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer ${images.length >= 5 ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                                    <Upload size={32} className="text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600">{images.length >= 5 ? 'Max 5 images' : 'Click to upload'}</p>
                                </label>
                                {previews.length > 0 && (
                                    <div className="grid grid-cols-5 gap-2 mt-4">
                                        {previews.map((p, i) => (
                                            <div key={i} className="relative group">
                                                <img src={p} alt="" className="w-full h-20 object-cover rounded" />
                                                <button type="button" onClick={() => removeImage(i)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3 justify-end">
                    <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSubmit} disabled={isSubmitting}
                        className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50">
                        {isSubmitting ? 'Saving...' : 'Save Trade'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TradeForm;