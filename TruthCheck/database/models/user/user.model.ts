import { mongo } from "root/deps.ts";

interface User {
  _id: mongo.ObjectId;
  name: string;
  library: [mongo.ObjectId];
  createdResources: [mongo.ObjectId];
}

export default User;