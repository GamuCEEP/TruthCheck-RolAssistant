import { Bson } from 'https://deno.land/x/mongo@v0.28.1/mod.ts';
/**
 * Represents a resource, it can be saved and created by the user
 */
interface Resource {
  _id: Bson.ObjectId;
  name: string;
  description: string;
}

export default Resource;
