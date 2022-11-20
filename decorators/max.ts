import { Decorator } from "../decorator/decorator.ts";

export function max(max: number): Decorator<number>;
export function max(max: string): Decorator<string>;
export function max(max: number | string): Decorator<number | string> {
  return {
    name: "max",
    validate(v) {
      return v <= max;
    },
  };
}
