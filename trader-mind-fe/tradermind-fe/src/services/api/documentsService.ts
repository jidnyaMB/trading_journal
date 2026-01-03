import apiClient from './apiClient';

// --------------------
// Types
// --------------------
export interface Document {
    id: string;
    originalName: string;
    fileName: string;
    filePath: string;
    mimeType: string;
    size: number;
    createdAt: string;
}

// --------------------
// API Service
// --------------------
class DocumentsService {

    // Upload documents
    async uploadDocuments(files: File[]): Promise<Document[]> {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append('documents', file);
        });

        const response = await apiClient.post<Document[]>(
            '/documents',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    }

    // Get all documents
    async getAllDocuments(): Promise<Document[]> {
        const response = await apiClient.get<Document[]>('/documents');
        return response.data;
    }

    // Delete document
    async deleteDocument(id: string): Promise<void> {
        await apiClient.delete(`/documents/${id}`);
    }
}

export const documentsService = new DocumentsService();
export default documentsService;
