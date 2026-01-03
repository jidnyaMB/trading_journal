import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('documents')
export class Document {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    originalName: string;

    @Column()
    fileName: string;

    @Column()
    filePath: string;

    @Column()
    mimeType: string;

    @Column('bigint')
    size: number;

    @CreateDateColumn()
    createdAt: Date;
}
