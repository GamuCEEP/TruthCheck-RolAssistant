import { Model, DataTypes} from 'https://deno.land/x/denodb@v1.0.39/mod.ts';
import resource from './resource.tables.ts';
import { ItemTable } from './item.tables.ts';

class CharacterTable extends Model{
  static table: 'characters';
  static timestamps: true;

  static fields = {
    ...resource
  };
}

class _inventoryTable extends Model{
  static table: '_inventory';
  static timestamps: false;

  static fields = {
    character_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    amount: DataTypes.INTEGER
  }
}

export { CharacterTable };