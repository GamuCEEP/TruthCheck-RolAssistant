import { orm, ini } from '/dependencies.ts'

ini.decode(await Deno.readTextFile('./credentials.ini'))


const connector = new orm.MongoDBConnector({
  uri: '',
  database: 'TruthCheck',

})
const db = new orm.Database(connector)


