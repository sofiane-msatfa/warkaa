export interface BatchService<TRow, TError> {
  add(row: TRow): Promise<void>;
  flush(): Promise<void>;
  getErrors(): TError[];
  getCount(): number;
}
