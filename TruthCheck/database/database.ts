import { mongo, ezconfig as config} from "root/deps.ts";
import * as models from "./models/_models.ts";


const client = new mongo.MongoClient();


const uri: string = await config.getProperty('./credentials.ini', 'uri', 'database')
console.log(uri)
const db = await client.connect(uri);

const actorCollection = db.collection<models.Actor>("actors");
const itemCollection = db.collection<models.Item>("items");
const stageCollection = db.collection<models.Stage>("stages");
const effectCollection = db.collection<models.Effect>("effects");

const userCollection = db.collection<models.User>("users");

// const gameCollection = db.collection<model.Game>("games"); 

export {
  actorCollection,
  effectCollection,
  itemCollection,
  stageCollection,
  userCollection,
  // gameCollection
};
