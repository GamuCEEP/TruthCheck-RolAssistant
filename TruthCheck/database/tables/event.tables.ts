import { Model, DataTypes } from 'https://deno.land/x/denodb@v1.0.39/mod.ts';
import resource from './resource.tables.ts';

class EventTable extends Model{
  static table: 'events';
  static timestamps: true;

  static fields = {
    ...resource,
  }
}