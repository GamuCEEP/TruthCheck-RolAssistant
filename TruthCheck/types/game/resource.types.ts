import { mongo } from '../../dependencies.ts';
/**
 * Represents a resource, it can be saved and created by the user
 */
interface Resource {
  _id: mongo.Bson.ObjectId;
  name: string;
  description: string;
}

export default Resource;
