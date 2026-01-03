import React, { useEffect, useRef, useState } from "react";
import { Upload, FileText, Trash2, AlertCircle } from "lucide-react";
import documentsService, {
    Document as BackendDocument,
} from "../services/api/documentsService";

interface DocumentItem {
    id: string;
    name: string;
    size: number;
    type: string;
    uploadedAt: Date;
}

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

const Documents: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Load documents on page load
    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const data = await documentsService.getAllDocuments();
            setDocuments(mapBackendDocs(data));
        } catch {
            setError("Failed to load documents");
        }
    };

    const mapBackendDocs = (
        docs: BackendDocument[]
    ): DocumentItem[] =>
        docs.map((doc) => ({
            id: doc.id,
            name: doc.originalName,
            size: doc.size,
            type: doc.mimeType || "Unknown",
            uploadedAt: new Date(doc.createdAt),
        }));

    const handleFileSelect = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        setError(null);

        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
                setError(`"${file.name}" exceeds 500MB limit`);
                return;
            }
        }

        setUploading(true);
        try {
            const uploadedDocs =
                await documentsService.uploadDocuments(files);

            setDocuments((prev) => [
                ...mapBackendDocs(uploadedDocs),
                ...prev,
            ]);

            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err: any) {
            setError(err?.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const removeDocument = async (id: string) => {
        try {
            await documentsService.deleteDocument(id);
            setDocuments((prev) => prev.filter((d) => d.id !== id));
        } catch {
            setError("Failed to delete document");
        }
    };

    const formatSize = (bytes: number) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
    };

    return (
        <div className="p-6 space-y-8">
            {/* Upload Section */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Upload Documents
                </h2>

                {error && (
                    <div className="mb-4 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed rounded-lg h-40 flex flex-col items-center justify-center hover:bg-gray-50 transition"
                >
                    <Upload size={36} className="text-gray-400 mb-2" />
                    <p className="text-gray-600 font-medium">
                        Click to upload documents
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Any file type • Max 500MB per file
                    </p>
                </div>

                {uploading && (
                    <p className="mt-3 text-sm text-gray-500">
                        Uploading…
                    </p>
                )}
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Uploaded Documents ({documents.length})
                </h2>

                {documents.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                        No documents uploaded yet.
                    </p>
                ) : (
                    <div className="divide-y">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between py-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded bg-gray-100">
                                        <FileText size={22} />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {doc.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatSize(doc.size)} •{" "}
                                            {doc.type} •{" "}
                                            {doc.uploadedAt.toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        removeDocument(doc.id)
                                    }
                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Documents;
