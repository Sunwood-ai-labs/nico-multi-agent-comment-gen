import React, { useState, useCallback } from 'react';

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
      <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <i className="fa-solid fa-film text-indigo-500 text-xl w-8 text-center"></i>
          <span className="text-slate-800 truncate font-medium">{file.name}</span>
        </div>
        <button onClick={handleRemoveFile} className="text-slate-500 hover:text-slate-800 transition">
          <i className="fa-solid fa-xmark text-lg"></i>
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
        className={`flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-dashed rounded-lg cursor-pointer hover:border-slate-400
          ${isDragging ? 'border-slate-400 bg-slate-50' : 'border-slate-300'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <i className="fa-solid fa-cloud-arrow-up text-3xl mb-3 text-slate-400"></i>
          <p className="mb-2 text-sm text-slate-500">
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