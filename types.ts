
export enum FileStatus {
  Pending = 'Pending',
  Analyzing = 'Analyzing',
  Keep = 'Keep',
  Delete = 'Delete',
  Error = 'Error',
}

export interface AnalyzedFile {
  id: string;
  file: File;
  status: FileStatus;
  reason?: string;
}

export interface AiDecision {
    decision: 'KEEP' | 'DELETE';
    reason: string;
}
