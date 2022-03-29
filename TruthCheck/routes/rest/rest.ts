import { oak } from "root/deps.ts";
import {
  actorCollection,
  effectCollection,
  itemCollection,
  stageCollection,
} from "root/database/database.ts";

const rest = new oak.Router();

export default rest;
export { actorCollection, effectCollection, itemCollection, stageCollection };
