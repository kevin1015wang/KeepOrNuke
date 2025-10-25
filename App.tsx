import React, { useState, useCallback } from 'react';
import { AnalyzedFile, FileStatus } from './types';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList';
import Controls from './components/Controls';
import { analyzeFileWithAI } from './services/geminiService';
import { SparklesIcon } from './components/Icons';

declare global {
    interface Window {
        JSZip: any;
    }
}

const App: React.FC = () => {
  const [files, setFiles] = useState<AnalyzedFile[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  const handleFolderSelect = useCallback((fileList: FileList) => {
    const newFiles: AnalyzedFile[] = Array.from(fileList).map(file => ({
      id: `${file.name}-${file.lastModified}-${(file as any).webkitRelativePath}`,
      file: file,
      status: FileStatus.Pending,
    }));
    setFiles(newFiles);
    setIsDone(false);
  }, []);

  const handleStartCleaning = async () => {
    setIsProcessing(true);
    setIsDone(false);

    for (const analyzedFile of files) {
      setFiles(prev => prev.map(f => f.id === analyzedFile.id ? { ...f, status: FileStatus.Analyzing } : f));
      try {
        const decision = await analyzeFileWithAI(analyzedFile.file, prompt);
        const newStatus = decision.decision === 'KEEP' ? FileStatus.Keep : FileStatus.Delete;
        setFiles(prev => prev.map(f => f.id === analyzedFile.id ? { ...f, status: newStatus, reason: decision.reason } : f));
      } catch (error) {
        console.error("Error analyzing file:", analyzedFile.file.name, error);
        const reason = error instanceof Error ? error.message : 'An unknown error occurred.';
        setFiles(prev => prev.map(f => f.id === analyzedFile.id ? { ...f, status: FileStatus.Error, reason } : f));
      }
    }

    setIsProcessing(false);
    setIsDone(true);
  };

  const handleDownload = async () => {
    if (!window.JSZip) {
      alert('Error: Zipping library is not available.');
      return;
    }
    const zip = new window.JSZip();
    
    const filesToKeep = files.filter(f => f.status === FileStatus.Keep);
    if (filesToKeep.length === 0) {
      alert('No files were marked to "Keep". Nothing to download.');
      return;
    }

    filesToKeep.forEach(af => {
      // Use webkitRelativePath to preserve folder structure
      const path = af.file.webkitRelativePath || af.file.name;
      zip.file(path, af.file);
    });

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'cleaned_files.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error('Error creating zip file:', err);
      alert('Failed to create the zip file.');
    }
  };
  
  return (
    <div className="min-h-screen bg-light-bg flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3">
                <SparklesIcon className="w-10 h-10 text-brand-primary" />
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-light-text-primary">
                KeepOrNuke
                </h1>
            </div>
          <p className="mt-4 text-lg text-light-text-secondary">
            Upload a folder, tell the AI what to do, and download your cleaned directory.
          </p>
        </header>
        
        <div className="bg-light-card border border-light-border rounded-xl p-6 sm:p-8 shadow-2xl">
            {files.length === 0 ? (
                <FileUploader onFolderSelect={handleFolderSelect} disabled={isProcessing} />
            ) : (
                <>
                    <Controls
                        prompt={prompt}
                        setPrompt={setPrompt}
                        onStart={handleStartCleaning}
                        onDownload={handleDownload}
                        isProcessing={isProcessing}
                        isDone={isDone}
                        hasFiles={files.length > 0}
                    />
                    <FileList files={files} />
                </>
            )}
        </div>

        {files.length > 0 && (
            <div className="text-center mt-6">
                <button 
                    onClick={() => {
                        setFiles([]);
                        setPrompt('');
                        setIsDone(false);
                    }}
                    disabled={isProcessing}
                    className="text-sm font-semibold text-brand-primary hover:text-brand-secondary disabled:opacity-50 transition-colors"
                >
                    Start Over
                </button>
            </div>
        )}

      </main>
    </div>
  );
};

export default App;