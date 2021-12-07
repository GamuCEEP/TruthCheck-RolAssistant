import { Model } from "https://deno.land/x/denodb@v1.0.39/mod.ts";
import resource from "./resource.tables.ts";

class ItemTable extends Model {
  static table: "items";
  static timestamps: true;

  static fields = {
    ...resource,
  };
}

export { ItemTable };
