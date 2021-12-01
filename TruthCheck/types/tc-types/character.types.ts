import Resource from "./resource.types.ts";
import Item from "./item.types.ts";

interface Character extends Resource {
  description: string;

  inventory: Item[];
  equipment: Item[];
  statistics: Record<string, string | number>[];
}

export default Character;
