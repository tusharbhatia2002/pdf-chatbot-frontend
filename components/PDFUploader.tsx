// components/PDFUploader.tsx
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadPDF, deletePDF } from "@/lib/api";

interface PDFUploaderProps {
  onUpload: () => void;
  uploadedPDFs: string[];
}

export default function PDFUploader({ onUpload, uploadedPDFs }: PDFUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      try {
        await uploadPDF(file);
        onUpload();
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false);
      }
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleDelete = async (pdfName: string) => {
    try {
      await deletePDF(pdfName);
      onUpload();
    } catch (error) {
      console.error("Error deleting PDF:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300 ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <Upload className={`w-12 h-12 ${isDragActive ? "text-blue-500" : "text-gray-400"}`} />
          {isUploading ? (
            <p className="text-blue-500">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-blue-500">Drop the PDF here ...</p>
          ) : (
            <p className="text-gray-500">Drag & drop a PDF here, or click to select one</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">PDF uploaded successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Uploaded PDFs</h3>
        {uploadedPDFs.length === 0 ? (
          <p className="text-gray-500">No PDFs uploaded yet.</p>
        ) : (
          <ul className="space-y-2">
            {uploadedPDFs.map((pdf, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">{pdf}</span>
                </div>
                <button
                  onClick={() => handleDelete(pdf)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}