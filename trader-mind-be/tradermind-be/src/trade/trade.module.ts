import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { ExcelService } from '../common/excel.service';

@Module({
    controllers: [TradeController],
    providers: [TradeService, ExcelService],
    exports: [TradeService],
})
export class TradeModule { }