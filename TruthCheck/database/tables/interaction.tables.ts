import { Model } from 'https://deno.land/x/denodb@v1.0.39/mod.ts';
import resource from './resource.tables.ts';

class InteractionTable extends Model{
  static table: 'interactions';
  static timestamps: true;

  static fields = {
    ...resource,
    
  }
}