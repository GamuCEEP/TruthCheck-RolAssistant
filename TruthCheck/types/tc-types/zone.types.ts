import Resource from "./resource.types.ts";
import Event from "./event.types.ts";

interface Zone extends Resource {
  description: string;
  events: Event[];
}

export default Zone;
