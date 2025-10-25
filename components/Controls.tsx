import React from 'react';
import { SparklesIcon, DownloadIcon, SpinnerIcon } from './Icons';

interface ControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onStart: () => void;
  onDownload: () => void;
  isProcessing: boolean;
  isDone: boolean;
  hasFiles: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  prompt,
  setPrompt,
  onStart,
  onDownload,
  isProcessing,
  isDone,
  hasFiles,
}) => {
  return (
    <div className="w-full mt-8 space-y-4">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-light-text-secondary mb-2">
          AI Cleaning Instruction
        </label>
        <textarea
          id="prompt"
          rows={3}
          className="block w-full rounded-md border-0 bg-light-card text-light-text-primary shadow-sm ring-1 ring-inset ring-light-border placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6 p-3 transition"
          placeholder="e.g., 'Delete all log files and keep only images that are smaller than 1MB'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isProcessing}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onStart}
          disabled={!hasFiles || !prompt || isProcessing}
          className="flex-1 inline-flex items-center justify-center gap-x-2 rounded-md bg-brand-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? (
            <>
              <SpinnerIcon className="w-5 h-5"/>
              Processing...
            </>
          ) : (
            <>
              <SparklesIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Start Cleaning
            </>
          )}
        </button>
        <button
          onClick={onDownload}
          disabled={!isDone || isProcessing}
          className="flex-1 inline-flex items-center justify-center gap-x-2 rounded-md bg-status-keep px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <DownloadIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Download Kept Files (.zip)
        </button>
      </div>
    </div>
  );
};

export default Controls;