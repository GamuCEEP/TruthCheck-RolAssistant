import { Model } from 'https://deno.land/x/denodb@v1.0.39/mod.ts';
import resource from './resource.tables.ts';

class CharacterTable extends Model{
  static table: 'characters';
  static timestamps: true;

  static fields = {
    ...resource
  };
}

export default CharacterTable;