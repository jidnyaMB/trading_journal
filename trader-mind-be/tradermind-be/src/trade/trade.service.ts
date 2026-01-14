import { Injectable, NotFoundException } from '@nestjs/common';
import { ExcelService } from '../common/excel.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { v4 as uuidv4 } from 'uuid';

export interface TradeExcel {
    id: string;
    tradeDate: string;
    market: string;
    assetType: string;
    timeframe: string;
    strategyMethod: string;
    plannedStopLoss?: number;
    plannedTarget?: number;
    actualExitPrice?: number;
    riskRewardPlanned?: string;
    riskRewardAchieved?: string;
    followedStopLoss?: boolean;
    emotionalStateDuring?: string;
    emotionalStateAfter?: string;
    confidenceLevel?: number;
    mistakesMade?: string;
    rulesFollowed?: number;
    profitOrLoss: string;
    images?: string;
    createdAt: string;
    updatedAt: string;
}

@Injectable()
export class TradeService {
    private readonly headers = [
        'id', 'tradeDate', 'market', 'assetType', 'timeframe', 'strategyMethod',
        'plannedStopLoss', 'plannedTarget', 'actualExitPrice', 'riskRewardPlanned',
        'riskRewardAchieved', 'followedStopLoss', 'emotionalStateDuring',
        'emotionalStateAfter', 'confidenceLevel', 'mistakesMade', 'rulesFollowed',
        'profitOrLoss', 'images', 'createdAt', 'updatedAt'
    ];

    constructor(private readonly excelService: ExcelService) { }

    private mapExcelToTrade(excelTrade: TradeExcel) {
        return {
            ...excelTrade,
            emotionalStateDuring: excelTrade.emotionalStateDuring ? excelTrade.emotionalStateDuring.split(',') : [],
            mistakesMade: excelTrade.mistakesMade ? excelTrade.mistakesMade.split(',') : [],
            images: excelTrade.images ? excelTrade.images.split(',') : [],
        };
    }

    private mapTradeToExcel(trade: any): TradeExcel {
        return {
            ...trade,
            emotionalStateDuring: Array.isArray(trade.emotionalStateDuring) ? trade.emotionalStateDuring.join(',') : (trade.emotionalStateDuring || ''),
            mistakesMade: Array.isArray(trade.mistakesMade) ? trade.mistakesMade.join(',') : (trade.mistakesMade || ''),
            images: Array.isArray(trade.images) ? trade.images.join(',') : (trade.images || ''),
        };
    }

    async create(createTradeDto: CreateTradeDto, imagePaths?: string[]) {
        const rawData = this.excelService.readData<TradeExcel>('Trades', this.headers);
        const now = new Date().toISOString();

        const newTrade = {
            ...createTradeDto,
            id: uuidv4(),
            tradeDate: now,
            images: imagePaths || [],
            createdAt: now,
            updatedAt: now,
        };

        rawData.push(this.mapTradeToExcel(newTrade));
        this.excelService.writeData('Trades', rawData, this.headers);
        return newTrade;
    }

    async findAll() {
        const rawData = this.excelService.readData<TradeExcel>('Trades', this.headers);
        return rawData
            .map(t => this.mapExcelToTrade(t))
            .sort((a, b) => new Date(b.tradeDate).getTime() - new Date(a.tradeDate).getTime());
    }

    async findOne(id: string) {
        const rawData = this.excelService.readData<TradeExcel>('Trades', this.headers);
        const excelTrade = rawData.find(t => t.id === id);

        if (!excelTrade) {
            throw new NotFoundException(`Trade with ID ${id} not found`);
        }

        return this.mapExcelToTrade(excelTrade);
    }

    async update(id: string, updateTradeDto: Partial<CreateTradeDto>, imagePaths?: string[]) {
        const rawData = this.excelService.readData<TradeExcel>('Trades', this.headers);
        const index = rawData.findIndex(t => t.id === id);

        if (index === -1) {
            throw new NotFoundException(`Trade with ID ${id} not found`);
        }

        const currentTrade = this.mapExcelToTrade(rawData[index]);
        const updatedTrade = {
            ...currentTrade,
            ...updateTradeDto,
            updatedAt: new Date().toISOString(),
        };

        if (imagePaths) {
            updatedTrade.images = imagePaths;
        }

        rawData[index] = this.mapTradeToExcel(updatedTrade);
        this.excelService.writeData('Trades', rawData, this.headers);
        return updatedTrade;
    }

    async remove(id: string): Promise<void> {
        const rawData = this.excelService.readData<TradeExcel>('Trades', this.headers);
        const filteredData = rawData.filter(t => t.id !== id);

        if (rawData.length === filteredData.length) {
            throw new NotFoundException(`Trade with ID ${id} not found`);
        }

        this.excelService.writeData('Trades', filteredData, this.headers);
    }

    async getTradeStatistics() {
        const trades = await this.findAll();
        const totalTrades = trades.length;
        const profitTrades = trades.filter(t => t.profitOrLoss === 'Profit').length;
        const lossTrades = trades.filter(t => t.profitOrLoss === 'Loss').length;

        return {
            totalTrades,
            profitTrades,
            lossTrades,
            winRate: totalTrades > 0 ? ((profitTrades / totalTrades) * 100).toFixed(2) : '0',
        };
    }
}