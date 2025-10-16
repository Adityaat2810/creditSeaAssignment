import { Upload } from "lucide-react";
import { useState } from "react";

interface UploadTabProps {
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}

export const UploadTab = ({ onUpload, uploading }: UploadTabProps) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!uploadFile) return;
    await onUpload(uploadFile);
    setUploadFile(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-12">
        <div className="text-center mb-8">
          <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Upload XML Report
          </h2>
          <p className="text-muted-foreground">
            Select a credit report XML file to parse and store
          </p>
        </div>

        <div className="space-y-6">
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <input
              id="fileInput"
              type="file"
              accept=".xml"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            {uploadFile ? (
              <div>
                <p className="font-medium text-foreground">
                  {uploadFile.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(uploadFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium text-foreground">
                  Click to select file or drag and drop
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  XML files only
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!uploadFile || uploading}
            className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? "Uploading..." : "Upload Report"}
          </button>
        </div>
      </div>
    </div>
  );
};