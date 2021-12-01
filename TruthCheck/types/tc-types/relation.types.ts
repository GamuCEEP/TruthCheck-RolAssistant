import Resource from "./resource.types.ts";
import Character from "./character.types.ts";
import Effect from "./effect.types.ts";

interface Relation extends Resource {
  effects: [Effect, Character][];
}

export default Relation;
