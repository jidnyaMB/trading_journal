import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFiles,
    BadRequestException,
    ParseUUIDPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TradeService } from './trade.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('trades')
@Controller('trades')
export class TradeController {
    constructor(private readonly tradeService: TradeService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new trade' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                market: { type: 'string', example: 'NIFTY' },
                assetType: { type: 'string', enum: ['Equity', 'Options', 'Futures', 'Crypto', 'Forex'] },
                timeframe: { type: 'string', enum: ['1m', '5m', '15m', '1H', 'Daily'] },
                strategyMethod: { type: 'string', enum: ['Zone Breakout', 'EMA Pullback', 'Liquidity Sweep'] },
                plannedStopLoss: { type: 'number', example: 18500.50 },
                plannedTarget: { type: 'number', example: 18750.00 },
                actualExitPrice: { type: 'number', example: 18725.75 },
                riskRewardPlanned: { type: 'string', example: '1:2' },
                riskRewardAchieved: { type: 'string', example: '1:1.8' },
                followedStopLoss: { type: 'boolean', example: true },
                emotionalStateDuring: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Calm', 'Confident'],
                },
                emotionalStateAfter: { type: 'string', example: 'Satisfied' },
                confidenceLevel: { type: 'number', example: 7 },
                mistakesMade: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Exited too early'],
                },
                rulesFollowed: { type: 'number', example: 85 },
                profitOrLoss: { type: 'string', enum: ['Profit', 'Loss'] },
                images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    maxItems: 5,
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Trade created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UseInterceptors(
        FilesInterceptor('images', 5, {
            storage: diskStorage({
                destination: './uploads/trades',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `trade-${uniqueSuffix}${ext}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return cb(new BadRequestException('Only image files (jpg, jpeg, png) are allowed'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB per file
            },
        }),
    )
    async create(
        @Body() createTradeDto: CreateTradeDto,
        @UploadedFiles() files?: Express.Multer.File[],
    ) {
        const imagePaths = files?.map((file) => file.path) || [];

        return await this.tradeService.create(createTradeDto, imagePaths);
    }

    @Get()
    @ApiOperation({ summary: 'Get all trades' })
    @ApiResponse({ status: 200, description: 'Return all trades' })
    async findAll() {
        return await this.tradeService.findAll();
    }

    @Get('statistics')
    @ApiOperation({ summary: 'Get trade statistics' })
    @ApiResponse({ status: 200, description: 'Return trade statistics' })
    async getStatistics() {
        return await this.tradeService.getTradeStatistics();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a trade by ID' })
    @ApiResponse({ status: 200, description: 'Return the trade' })
    @ApiResponse({ status: 404, description: 'Trade not found' })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return await this.tradeService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a trade' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 200, description: 'Trade updated successfully' })
    @ApiResponse({ status: 404, description: 'Trade not found' })
    @UseInterceptors(
        FilesInterceptor('images', 5, {
            storage: diskStorage({
                destination: './uploads/trades',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `trade-${uniqueSuffix}${ext}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return cb(new BadRequestException('Only image files are allowed'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        }),
    )
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateTradeDto: Partial<CreateTradeDto>,
        @UploadedFiles() files?: Express.Multer.File[],
    ) {
        const imagePaths = files?.map((file) => file.path);
        return await this.tradeService.update(id, updateTradeDto, imagePaths);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a trade' })
    @ApiResponse({ status: 200, description: 'Trade deleted successfully' })
    @ApiResponse({ status: 404, description: 'Trade not found' })
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        await this.tradeService.remove(id);
        return { message: 'Trade deleted successfully' };
    }
}