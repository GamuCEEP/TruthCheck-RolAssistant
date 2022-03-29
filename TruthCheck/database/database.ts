import { ini, mongo } from "root/deps.ts";
import * as models from "./models/models.ts";

const config = ini.decode(await Deno.readTextFile("./credentials.ini"));

if (
  !config.uri || !config.user || !config.password || !config.dbname ||
  !config.cluster_url
) {
  console.log("config data missing", config);
}

let uri: string = config.uri;

uri = uri.replace("{user}", config.user);
uri = uri.replace("{password}", config.password);
uri = uri.replace("{dbname}", config.dbname);
uri = uri.replace("{cluster_url}", config.cluster_url);

const client = new mongo.MongoClient();

const db = await client.connect(uri);

const actorCollection = db.collection<models.Actor>("actors");
const itemCollection = db.collection<models.Item>("items");
const stageCollection = db.collection<models.Stage>("stages");
const effectCollection = db.collection<models.Effect>("effects");

const userCollection = db.collection<models.User>("users");

export {
  actorCollection,
  effectCollection,
  itemCollection,
  stageCollection,
  userCollection,
};
