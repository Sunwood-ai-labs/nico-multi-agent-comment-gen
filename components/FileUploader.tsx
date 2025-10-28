
import React, { useState, useCallback } from 'react';
import { UploadCloud, Video, X } from './icons';

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      onFileChange(selectedFile);
    } else if (selectedFile) {
      alert("Please select a valid video file.");
    }
  }, [onFileChange]);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    onFileChange(null);
  };

  if (file) {
    return (
      <div className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <Video className="w-8 h-8 text-indigo-400 flex-shrink-0" />
          <span className="text-gray-200 truncate">{file.name}</span>
        </div>
        <button onClick={handleRemoveFile} className="text-gray-400 hover:text-white transition">
          <X className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor="file-upload"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-32 px-4 transition bg-gray-700 border-2 border-dashed rounded-lg cursor-pointer hover:border-indigo-400
          ${isDragging ? 'border-indigo-400' : 'border-gray-600'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop a video
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="video/*"
          onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)}
        />
      </label>
    </div>
  );
};

export default FileUploader;
