import {
    IsString,
    IsEnum,
    IsNumber,
    IsBoolean,
    IsArray,
    ArrayMaxSize,
    Min,
    Max,
    IsNotEmpty,
    IsOptional,
    Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum AssetType {
    EQUITY = 'Equity',
    OPTIONS = 'Options',
    FUTURES = 'Futures',
    CRYPTO = 'Crypto',
    FOREX = 'Forex',
}

export enum Timeframe {
    ONE_MIN = '1m',
    FIVE_MIN = '5m',
    FIFTEEN_MIN = '15m',
    ONE_HOUR = '1H',
    DAILY = 'Daily',
}

export enum StrategyMethod {
    ZoneTrading = 'Zone Breakout',
    EMATrading = 'EMA Pullback',
    LiquidityTrading = 'Liquidity Sweep',
}

export enum EmotionalStateDuring {
    CALM = 'Calm',
    CONFIDENT = 'Confident',
    ANXIOUS = 'Anxious',
    FEARFUL = 'Fearful',
    GREEDY = 'Greedy',
    OVERCONFIDENT = 'Overconfident',
    FRUSTRATED = 'Frustrated',
    HESITANT = 'Hesitant',
}

export enum EmotionalStateAfter {
    SATISFIED = 'Satisfied',
    REGRETFUL = 'Regretful',
    ANGRY = 'Angry',
    NEUTRAL = 'Neutral',
    PROUD = 'Proud',
    DISAPPOINTED = 'Disappointed',
}

export enum MistakesMade {
    OVERTRADING = 'Overtrading',
    REVENGE_TRADING = 'Revenge trading',
    RISKED_TOO_MUCH = 'Risked too much',
    ENTERED_WITHOUT_CONFIRMATION = 'Entered without confirmation',
    ENTERED_LATE = 'Entered late',
    EXITED_TOO_EARLY = 'Exited too early',
    EXITED_TOO_LATE = 'Exited too late',
    FOMO_ENTRY = 'FOMO entry',
    IGNORED_STOP_LOSS = 'Ignored stop loss',
    MOVED_STOP_LOSS = 'Moved stop loss',
    NO_PREDEFINED_TARGET = 'No predefined target',
    TOOK_TRADE_OUT_OF_BOREDOM = 'Took trade out of boredom',
    TRADED_AGAINST_TREND = 'Traded against trend',
    NEWS_BASED_EMOTIONAL_ENTRY = 'News-based emotional entry',
}

export enum ProfitOrLoss {
    PROFIT = 'Profit',
    LOSS = 'Loss',
}

export class CreateTradeDto {
    // tradeDate is auto-generated on backend, not accepted from client

    @ApiProperty({ example: 'NIFTY', description: 'Market or Instrument name' })
    @IsOptional()
    @IsString()
    market?: string;

    @ApiProperty({ enum: AssetType, example: AssetType.EQUITY })
    @IsOptional()
    @IsEnum(AssetType)
    assetType?: AssetType;

    @ApiProperty({ enum: Timeframe, example: Timeframe.FIFTEEN_MIN })
    @IsOptional()
    @IsEnum(Timeframe)
    timeframe?: Timeframe;

    @ApiProperty({ enum: StrategyMethod, example: StrategyMethod.ZoneTrading })
    @IsOptional()
    @IsEnum(StrategyMethod)
    strategyMethod?: StrategyMethod;

    @ApiProperty({ example: 18500.50, description: 'Planned stop loss price' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    plannedStopLoss?: number;

    @ApiProperty({ example: 18750.00, description: 'Planned target price' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    plannedTarget?: number;

    @ApiProperty({ example: 18725.75, description: 'Actual exit price' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    actualExitPrice?: number;

    @ApiProperty({ example: '1:2', description: 'Risk to reward ratio planned' })
    @IsOptional()
    @IsString()
    @Matches(/^\d+:\d+(\.\d+)?$/, { message: 'Invalid R:R format. Use format like 1:2 or 1:2.5' })
    riskRewardPlanned?: string;

    @ApiProperty({ example: '1:1.8', description: 'Risk to reward ratio achieved' })
    @IsOptional()
    @IsString()
    @Matches(/^\d+:\d+(\.\d+)?$/, { message: 'Invalid R:R format. Use format like 1:2 or 1:2.5' })
    riskRewardAchieved?: string;

    @ApiProperty({ example: true, description: 'Whether stop loss was followed' })
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    followedStopLoss?: boolean;

    @ApiProperty({
        enum: EmotionalStateDuring,
        isArray: true,
        example: [EmotionalStateDuring.CALM, EmotionalStateDuring.CONFIDENT],
    })
    @IsOptional()
    @IsArray()
    @IsEnum(EmotionalStateDuring, { each: true })
    @Transform(({ value }) => {
        if (Array.isArray(value)) return value;
        return value ? [value] : [];
    })
    emotionalStateDuring?: EmotionalStateDuring[];

    @ApiProperty({ enum: EmotionalStateAfter, example: EmotionalStateAfter.SATISFIED })
    @IsOptional()
    @IsEnum(EmotionalStateAfter)
    emotionalStateAfter?: EmotionalStateAfter;

    @ApiProperty({ example: 7, description: 'Confidence level from 1 to 10' })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(10)
    @Transform(({ value }) => parseInt(value))
    confidenceLevel?: number;

    @ApiProperty({
        enum: MistakesMade,
        isArray: true,
        example: [MistakesMade.EXITED_TOO_EARLY],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsEnum(MistakesMade, { each: true })
    @Transform(({ value }) => {
        if (Array.isArray(value)) return value;
        return value ? [value] : [];
    })
    mistakesMade?: MistakesMade[];

    @ApiProperty({ example: 85, description: 'Percentage of rules followed (0-100)' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    @Transform(({ value }) => parseInt(value))
    rulesFollowed?: number;

    @ApiProperty({ enum: ProfitOrLoss, example: ProfitOrLoss.PROFIT })
    @IsOptional()
    @IsEnum(ProfitOrLoss)
    profitOrLoss?: ProfitOrLoss;

    @ApiProperty({
        type: 'array',
        items: { type: 'string', format: 'binary' },
        description: 'Trade screenshot images (max 5)',
        required: false,
    })
    @IsOptional()
    images?: string[]; // Will be handled by multer
}