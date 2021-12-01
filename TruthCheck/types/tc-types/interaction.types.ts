import Resource from "./resource.types.ts";
import Effect from "./effect.types.ts";

import Character from "./character.types.ts";
import Item from "./item.types.ts";
import Zone from "./zone.types.ts";

interface Interaction extends Resource {
  causes: (Character | Item | Zone)[];
  effects: Effect[];
}

export default Interaction;
