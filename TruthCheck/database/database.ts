import { MongoClient } from 'https://deno.land/x/mongo@v0.28.1/mod.ts';
import * as Types from '../types/types.ts';

const client = new MongoClient();

await client.connect('mongodb://localhost');

const db = client.database('prueba');

const characters = db.collection<Types.Character>('characters');
const items = db.collection<Types.Item>('items');
const zones = db.collection<Types.Zone>('zones');
const maps = db.collection<Types.Map>('maps');
const relations = db.collection<Types.Relation>('relations');
const interactions = db.collection<Types.Interaction>('interactions');
const events = db.collection<Types.Event>('events');
const effects = db.collection<Types.Effect>('effects');
const timelines = db.collection<Types.Timeline>('timelines');


