import { Decorator } from "../decorator/decorator.ts";

export function between(min: number, max: number): Decorator<number>;
export function between(min: string, max: string): Decorator<string>;
export function between(
  min: number | string,
  max: number | string,
): Decorator<number | string> {
  return {
    name: "between",
    validate(v) {
      return v >= min && v <= max;
    },
  };
}
