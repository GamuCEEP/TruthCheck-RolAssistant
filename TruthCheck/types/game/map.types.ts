import Resource from "./resource.types.ts";
import Zone from "./zone.types.ts";

interface Map extends Resource {
  zones: Zone[];
}

export default Map;
