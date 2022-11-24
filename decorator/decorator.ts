export interface Decorator<T> {
  name: string;
  preprocess?(v: unknown): T;
  validate?(v: T): boolean;
  transform?(v: T): T;
}
