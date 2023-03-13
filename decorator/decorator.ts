export interface Decorator<T> {
  name: string;
  cast?(v: unknown): T;
  validate?(v: T): boolean;
  transform?(v: T): T;
  apply?: never;
  call?: never;
  bind?: never;
}
