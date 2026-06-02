export interface TableColumn<T> {
  key: string;
  header: string;
  type?: 'text' | 'image' | 'date';
  dateFormat?: string;
}

export type TableRecord = Record<string, unknown>;
