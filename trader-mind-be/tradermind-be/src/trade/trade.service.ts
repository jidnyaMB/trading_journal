import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trade } from './entities/trade.entity';
import { CreateTradeDto } from './dto/create-trade.dto';

@Injectable()
export class TradeService {
    constructor(
        @InjectRepository(Trade)
        private tradeRepository: Repository<Trade>,
    ) { }

    async create(createTradeDto: CreateTradeDto, imagePaths?: string[]): Promise<Trade> {
        const trade = this.tradeRepository.create({
            ...createTradeDto,
            tradeDate: new Date(), // Auto-generate trade date
            images: imagePaths || [],
        });

        return await this.tradeRepository.save(trade);
    }

    async findAll(): Promise<Trade[]> {
        return await this.tradeRepository.find({
            order: { tradeDate: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Trade> {
        const trade = await this.tradeRepository.findOne({ where: { id } });

        if (!trade) {
            throw new NotFoundException(`Trade with ID ${id} not found`);
        }

        return trade;
    }

    async update(id: string, updateTradeDto: Partial<CreateTradeDto>, imagePaths?: string[]): Promise<Trade> {
        const trade = await this.findOne(id);

        Object.assign(trade, updateTradeDto);

        if (imagePaths) {
            trade.images = imagePaths;
        }

        return await this.tradeRepository.save(trade);
    }

    async remove(id: string): Promise<void> {
        const trade = await this.findOne(id);
        await this.tradeRepository.remove(trade);
    }

    // Additional useful methods
    async getTradesByDateRange(startDate: Date, endDate: Date): Promise<Trade[]> {
        return await this.tradeRepository
            .createQueryBuilder('trade')
            .where('trade.tradeDate BETWEEN :startDate AND :endDate', { startDate, endDate })
            .orderBy('trade.tradeDate', 'DESC')
            .getMany();
    }

    async getTradesByProfitLoss(profitOrLoss: string): Promise<Trade[]> {
        return await this.tradeRepository.find({
            where: { profitOrLoss },
            order: { tradeDate: 'DESC' },
        });
    }

    async getTradeStatistics() {
        const totalTrades = await this.tradeRepository.count();
        const profitTrades = await this.tradeRepository.count({ where: { profitOrLoss: 'Profit' } });
        const lossTrades = await this.tradeRepository.count({ where: { profitOrLoss: 'Loss' } });

        return {
            totalTrades,
            profitTrades,
            lossTrades,
            winRate: totalTrades > 0 ? ((profitTrades / totalTrades) * 100).toFixed(2) : 0,
        };
    }
}