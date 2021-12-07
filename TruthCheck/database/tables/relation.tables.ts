import { Model } from "https://deno.land/x/denodb@v1.0.39/mod.ts";
import resource from "./resource.tables.ts";

class RelationTable extends Model {
  static table: "relations";
  static timestamps: true;

  static fields = {
    ...resource,
  };
}

export { RelationTable };
