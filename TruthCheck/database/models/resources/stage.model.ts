import { mongo } from "root/deps.ts";

interface Stage {
  _id: mongo.ObjectId;
  author: mongo.ObjectId;
  name: string;
  description: string;
  effects: Record<string, mongo.ObjectId>;
  timeline: [{
    layer: number;
    probability: number;
    effect: mongo.ObjectId;
  }];
  tags: [string];
}

export default Stage;
