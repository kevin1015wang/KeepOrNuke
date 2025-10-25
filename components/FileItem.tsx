
import React from 'react';
import { AnalyzedFile, FileStatus } from '../types';
import { FileIcon, CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, SpinnerIcon } from './Icons';

interface FileItemProps {
  analyzedFile: AnalyzedFile;
}

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const StatusBadge: React.FC<{ status: FileStatus }> = ({ status }) => {
  const statusConfig = {
    [FileStatus.Pending]: { text: 'Pending', color: 'bg-gray-500', icon: null },
    [FileStatus.Analyzing]: { text: 'Analyzing...', color: 'bg-status-analyzing', icon: <SpinnerIcon className="w-4 h-4" /> },
    [FileStatus.Keep]: { text: 'Keep', color: 'bg-status-keep', icon: <CheckCircleIcon className="w-4 h-4" /> },
    [FileStatus.Delete]: { text: 'Delete', color: 'bg-status-delete', icon: <XCircleIcon className="w-4 h-4" /> },
    [FileStatus.Error]: { text: 'Error', color: 'bg-status-error', icon: <ExclamationCircleIcon className="w-4 h-4" /> },
  };

  const { text, color, icon } = statusConfig[status];

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${color}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
};

export const FileItem: React.FC<FileItemProps> = ({ analyzedFile }) => {
  const { file, status, reason } = analyzedFile;

  return (
    <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-dark-card rounded-lg border border-dark-border space-y-3 sm:space-y-0">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <FileIcon className="w-8 h-8 text-brand-primary flex-shrink-0" />
        <div className="flex-grow min-w-0">
          <p className="text-sm font-medium text-dark-text-primary truncate" title={(file as any).webkitRelativePath || file.name}>
            {(file as any).webkitRelativePath || file.name}
          </p>
          <p className="text-xs text-dark-text-secondary">{formatBytes(file.size)}</p>
        </div>
      </div>
      <div className="flex flex-col sm:items-end w-full sm:w-auto sm:ml-4">
        <StatusBadge status={status} />
        {reason && (
          <p className="text-xs text-dark-text-secondary mt-1 text-left sm:text-right max-w-xs truncate" title={reason}>
            {reason}
          </p>
        )}
      </div>
    </li>
  );
};
