import Resource from "./resource.types.ts";
import Character from "./character.types.ts";
import Item from "./item.types.ts";
import Zone from "./zone.types.ts";

interface Effect extends Resource {
  apply(target: Character | Item | Zone): void;
}

export default Effect;
