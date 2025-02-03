export interface Book {
  id?: string;
  title: string;
  author: string;
  progress: number;
  totalPage: number;
  image?: string;
  rating?: number;
  logs: BookLogBase[];
}

export type BookLogType = 'progress' | 'note' | 'finished' | 'new';

export interface BookLogBase {
  message: string;
  date: Date;
  type: BookLogType;
}

export interface BookLogProgress extends BookLogBase {
  type: 'progress';
  initialPage: number;
  currentPage: number;
}

export interface NewBookLog extends BookLogBase{
  type: 'new';
}

export interface BookLogNote extends BookLogBase {
  type: 'note';
}

export interface BookLogFinished extends BookLogBase {
  type: 'finished';
}

export type BookLog = BookLogProgress | BookLogNote | BookLogFinished;
