import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExcelService {
    private readonly dataDir = path.join(process.cwd(), 'data');
    private readonly filePath = path.join(this.dataDir, 'tradermind_data.xlsx');

    constructor() {
        this.ensureDataDirectory();
    }

    private ensureDataDirectory() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    private ensureSheetExists(sheetName: string, headers: string[]) {
        let workbook: xlsx.WorkBook;
        if (!fs.existsSync(this.filePath)) {
            workbook = xlsx.utils.book_new();
        } else {
            workbook = xlsx.readFile(this.filePath);
        }

        if (!workbook.SheetNames.includes(sheetName)) {
            const worksheet = xlsx.utils.aoa_to_sheet([headers]);
            xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
            xlsx.writeFile(workbook, this.filePath);
        }
    }

    readData<T>(sheetName: string, headers: string[]): T[] {
        this.ensureSheetExists(sheetName, headers);
        try {
            const workbook = xlsx.readFile(this.filePath);
            const worksheet = workbook.Sheets[sheetName];
            return xlsx.utils.sheet_to_json<T>(worksheet);
        } catch (error) {
            throw new InternalServerErrorException(`Failed to read Excel sheet: ${sheetName}`);
        }
    }

    writeData<T>(sheetName: string, data: T[], headers: string[]) {
        try {
            let workbook: xlsx.WorkBook;
            if (fs.existsSync(this.filePath)) {
                workbook = xlsx.readFile(this.filePath);
            } else {
                workbook = xlsx.utils.book_new();
            }

            const worksheet = xlsx.utils.json_to_sheet(data, { header: headers });

            if (workbook.SheetNames.includes(sheetName)) {
                workbook.Sheets[sheetName] = worksheet;
            } else {
                xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
            }

            xlsx.writeFile(workbook, this.filePath);
        } catch (error) {
            throw new InternalServerErrorException(`Failed to write to Excel sheet: ${sheetName}`);
        }
    }
}
