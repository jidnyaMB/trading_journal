import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('trades')
export class Trade {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'timestamp' })
    tradeDate: Date;

    @Column({ length: 100, nullable: true })
    market: string;

    @Column({
        type: 'enum',
        enum: ['Equity', 'Options', 'Futures', 'Crypto', 'Forex'],
    })
    assetType: string;

    @Column({
        type: 'enum',
        enum: ['1m', '5m', '15m', '1H', 'Daily'],
    })
    timeframe: string;

    @Column({
        type: 'enum',
        enum: ['Zone Breakout', 'EMA Pullback', 'Liquidity Sweep'],
    })
    strategyMethod: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    plannedStopLoss: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    plannedTarget: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    actualExitPrice: number;

    @Column({ length: 20, nullable: true })
    riskRewardPlanned: string; // e.g., "1:2"

    @Column({ length: 20, nullable: true })
    riskRewardAchieved: string; // e.g., "1:1.5"

    @Column({ type: 'boolean', nullable: true })
    followedStopLoss: boolean;

    @Column({ type: 'simple-array', nullable: true })
    emotionalStateDuring: string[]; // Multi-select array

    @Column({ length: 50, nullable: true })
    emotionalStateAfter: string;

    @Column({ type: 'int', nullable: true })
    confidenceLevel: number; // 1-10

    @Column({ type: 'simple-array', nullable: true })
    mistakesMade: string[]; // Multi-select array

    @Column({ type: 'int', nullable: true })
    rulesFollowed: number; // 0-100

    @Column({
        type: 'enum',
        enum: ['Profit', 'Loss'],
    })
    profitOrLoss: string;

    @Column({ type: 'simple-array', nullable: true })
    images: string[]; // Array of image URLs/paths

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}