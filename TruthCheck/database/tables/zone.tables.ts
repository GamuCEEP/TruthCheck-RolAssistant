import { Model } from 'https://deno.land/x/denodb@v1.0.39/mod.ts';
import resource from './resource.tables.ts';

class ZoneTable extends Model{
  static table: 'zones';
  static timestamps: true;

  static fields = {
    ...resource,

  }
}

export default ZoneTable;