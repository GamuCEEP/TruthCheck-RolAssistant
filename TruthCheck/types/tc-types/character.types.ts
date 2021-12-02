import Resource from "./resource.types.ts";
import Item from "./item.types.ts";

interface Character extends Resource {
  description: string;

  inventory: Item[];
  equipment: Item[];
  statistics: {[name: string]: number | string | boolean};
}

export default Character;
