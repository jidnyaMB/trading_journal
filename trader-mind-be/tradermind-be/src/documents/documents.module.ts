import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { ExcelService } from '../common/excel.service';

@Module({
    controllers: [DocumentsController],
    providers: [DocumentsService, ExcelService],
})
export class DocumentsModule { }
