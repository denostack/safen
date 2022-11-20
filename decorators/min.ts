import { Decorator } from "../decorator/decorator.ts";

export function min(min: number): Decorator<number>;
export function min(min: string): Decorator<string>;
export function min(min: number | string): Decorator<number | string> {
  return {
    name: "min",
    validate(v) {
      return v >= min;
    },
  };
}
