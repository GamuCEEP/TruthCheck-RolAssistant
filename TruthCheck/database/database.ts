import { configFile, ezconfig, mongo } from "root/deps.ts";
import * as models from "./models/_models.ts";

const uri = await ezconfig.getProperty(configFile, "uri", "database");

// const config = (await ezconfig.getConfig(configFile))["database"];

const client = new mongo.MongoClient();

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
