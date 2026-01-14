import { Injectable, NotFoundException } from '@nestjs/common';
import { ExcelService } from '../common/excel.service';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export interface Document {
    id: string;
    originalName: string;
    fileName: string;
    filePath: string;
    mimeType: string;
    size: number;
    createdAt: string;
}

@Injectable()
export class DocumentsService {
    private readonly headers = ['id', 'originalName', 'fileName', 'filePath', 'mimeType', 'size', 'createdAt'];

    constructor(private readonly excelService: ExcelService) { }

    async create(files: Express.Multer.File[]) {
        const docs = this.excelService.readData<Document>('Documents', this.headers);
        const now = new Date().toISOString();

        const newDocs = files.map((file) => ({
            id: uuidv4(),
            originalName: file.originalname,
            fileName: file.filename,
            filePath: file.path,
            mimeType: file.mimetype,
            size: file.size,
            createdAt: now,
        }));

        docs.push(...newDocs);
        this.excelService.writeData('Documents', docs, this.headers);
        return newDocs;
    }

    async findAll() {
        const docs = this.excelService.readData<Document>('Documents', this.headers);
        return docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    async remove(id: string) {
        const docs = this.excelService.readData<Document>('Documents', this.headers);
        const doc = docs.find(d => d.id === id);

        if (!doc) throw new NotFoundException('Document not found');

        if (fs.existsSync(doc.filePath)) {
            fs.unlinkSync(doc.filePath);
        }

        const filteredDocs = docs.filter(d => d.id !== id);
        this.excelService.writeData('Documents', filteredDocs, this.headers);

        return { message: 'Document deleted successfully' };
    }
}
