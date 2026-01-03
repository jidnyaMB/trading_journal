import apiClient from './apiClient';

// --------------------
// Types
// --------------------
export interface CreateTradeDto {
    market?: string;
    assetType?: 'Equity' | 'Options' | 'Futures' | 'Crypto' | 'Forex';
    timeframe?: '1m' | '5m' | '15m' | '1H' | 'Daily';
    strategyMethod?: 'Zone Breakout' | 'EMA Pullback' | 'Liquidity Sweep';
    plannedStopLoss?: number;
    plannedTarget?: number;
    actualExitPrice?: number;
    riskRewardPlanned?: string;
    riskRewardAchieved?: string;
    followedStopLoss?: boolean;
    emotionalStateDuring?: string[];
    emotionalStateAfter?: string;
    confidenceLevel?: number;
    mistakesMade?: string[];
    rulesFollowed?: number;
    profitOrLoss?: 'Profit' | 'Loss';
}

export interface Trade extends CreateTradeDto {
    id: string;
    tradeDate: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
}

export interface TradeStatistics {
    totalTrades: number;
    profitTrades: number;
    lossTrades: number;
    winRate: string;
}

// --------------------
// API Service
// --------------------
class TradeService {

    // Create a new trade with images
    async createTrade(
        tradeData: CreateTradeDto,
        images?: File[]
    ): Promise<Trade> {
        const formData = new FormData();

        // Append trade data
        Object.entries(tradeData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item) => formData.append(key, item));
            } else {
                formData.append(key, String(value));
            }
        });

        // Append images
        images?.forEach((image) => {
            formData.append('images', image);
        });

        const response = await apiClient.post<Trade>('/trades', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    }

    // Get all trades
    async getAllTrades(): Promise<Trade[]> {
        const response = await apiClient.get<Trade[]>('/trades');
        return response.data;
    }

    // Get single trade
    async getTradeById(id: string): Promise<Trade> {
        const response = await apiClient.get<Trade>(`/trades/${id}`);
        return response.data;
    }

    // Get trade statistics
    async getTradeStatistics(): Promise<TradeStatistics> {
        const response =
            await apiClient.get<TradeStatistics>('/trades/statistics');
        return response.data;
    }

    // Update trade
    async updateTrade(
        id: string,
        tradeData: Partial<CreateTradeDto>,
        images?: File[]
    ): Promise<Trade> {
        const formData = new FormData();

        Object.entries(tradeData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach((item) => formData.append(key, item));
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        images?.forEach((image) => {
            formData.append('images', image);
        });

        const response = await apiClient.patch<Trade>(
            `/trades/${id}`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );

        return response.data;
    }

    // Delete trade
    async deleteTrade(id: string): Promise<void> {
        await apiClient.delete(`/trades/${id}`);
    }

    // Get trades by date range
    async getTradesByDateRange(
        startDate: Date,
        endDate: Date
    ): Promise<Trade[]> {
        const response = await apiClient.get<Trade[]>('/trades', {
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            },
        });

        return response.data;
    }

    // Get trades by profit/loss
    async getTradesByProfitLoss(
        profitOrLoss: 'Profit' | 'Loss'
    ): Promise<Trade[]> {
        const response = await apiClient.get<Trade[]>('/trades', {
            params: { profitOrLoss },
        });

        return response.data;
    }
}

export const tradeService = new TradeService();
export default tradeService;
