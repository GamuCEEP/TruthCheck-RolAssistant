import Resource from "./resource.types.ts";
import Interaction from "./interaction.types.ts";

interface Item extends Resource {
  description: string;
  interactions: Interaction[];
}

export default Item;