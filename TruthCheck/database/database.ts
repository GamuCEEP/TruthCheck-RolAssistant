import {DataTypes, Database, Model} from 'https://deno.land/x/denodb@v1.0.38/mod.ts';

//Temporal
import { MySQLConnector } from 'https://deno.land/x/denodb@v1.0.38/mod.ts';
const connection = new MySQLConnector({
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'TruthCheck'
}); 

const db = new Database(connection);

