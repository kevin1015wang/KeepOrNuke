import React from 'react';
import { AnalyzedFile } from '../types';
import { FileItem } from './FileItem';

interface FileListProps {
  files: AnalyzedFile[];
}

const FileList: React.FC<FileListProps> = ({ files }) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-8">
      <h2 className="text-xl font-semibold mb-4 text-light-text-primary">Files to Process ({files.length})</h2>
      <ul className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
        {files.map(analyzedFile => (
          <FileItem key={analyzedFile.id} analyzedFile={analyzedFile} />
        ))}
      </ul>
    </div>
  );
};

export default FileList;