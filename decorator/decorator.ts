export interface Decorator<T> {
  name: string;
  validate?(v: T): boolean;
  sanitize?(v: T): T;
}
