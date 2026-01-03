import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import * as fs from 'fs';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Document)
        private readonly documentRepo: Repository<Document>,
    ) { }

    async create(files: Express.Multer.File[]) {
        const docs = files.map((file) =>
            this.documentRepo.create({
                originalName: file.originalname,
                fileName: file.filename,
                filePath: file.path,
                mimeType: file.mimetype,
                size: file.size,
            }),
        );

        return await this.documentRepo.save(docs);
    }

    async findAll() {
        return await this.documentRepo.find({
            order: { createdAt: 'DESC' },
        });
    }

    async remove(id: string) {
        const doc = await this.documentRepo.findOne({ where: { id } });
        if (!doc) throw new NotFoundException('Document not found');

        if (fs.existsSync(doc.filePath)) {
            fs.unlinkSync(doc.filePath);
        }

        await this.documentRepo.remove(doc);
        return { message: 'Document deleted successfully' };
    }
}
