import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    UseInterceptors,
    UploadedFiles,
    BadRequestException,
    ParseUUIDPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post()
    @ApiOperation({ summary: 'Upload documents' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                documents: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
        },
    })
    @UseInterceptors(
        FilesInterceptor('documents', 10, {
            storage: diskStorage({
                destination: './uploads/documents',
                filename: (req, file, cb) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(
                        null,
                        `doc-${uniqueSuffix}${extname(file.originalname)}`,
                    );
                },
            }),
            limits: {
                fileSize: 500 * 1024 * 1024, // ✅ 500MB
            },
            fileFilter: (req, file, cb) => {
                // Accept ALL file types
                cb(null, true);
            },
        }),
    )
    async upload(@UploadedFiles() files: Express.Multer.File[]) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No documents uploaded');
        }
        return await this.documentsService.create(files);
    }

    @Get()
    @ApiOperation({ summary: 'Get all documents' })
    async findAll() {
        return await this.documentsService.findAll();
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a document' })
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        return await this.documentsService.remove(id);
    }
}
