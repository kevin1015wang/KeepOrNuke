
import React, { useRef } from 'react';
import { UploadIcon } from './Icons';

interface FileUploaderProps {
  onFolderSelect: (files: FileList) => void;
  disabled: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFolderSelect, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFolderSelect(event.target.files);
    }
  };
  
  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        disabled={disabled}
        className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer bg-dark-card border-dark-border hover:bg-gray-800 hover:border-brand-secondary transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <UploadIcon className="w-12 h-12 text-gray-400 mb-4" />
        <span className="text-lg font-semibold text-dark-text-primary">Click to upload a folder</span>
        <p className="text-sm text-dark-text-secondary mt-1">Select a folder to start cleaning</p>
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          // @ts-ignore
          webkitdirectory="true"
          directory="true"
          multiple
          disabled={disabled}
        />
      </button>
    </div>
  );
};

export default FileUploader;
