export {
  css,
  customElement,
  html,
  property,
  Shadow,
} from "https://deno.land/x/shadow@v1.0.7/mod.ts";
export type { Attribute } from "https://deno.land/x/shadow@v1.0.7/mod.ts";


export function mod(number: number, base: number) {
  return ((number % base) + base) % base;
}

