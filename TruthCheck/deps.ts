import * as oak from "https://deno.land/x/oak@v10.1.0/mod.ts";
import * as mongo from "https://deno.land/x/mongo@v0.29.3/mod.ts";
import * as oauth from "https://deno.land/x/dashport@v1.2.1/mod.ts";
import GoogleStrategy from "https://deno.land/x/dashport_google@v1.0.0/mod.ts";

import * as ezconfig from "../utils/ezconfig/ezconfig.ts";


const configFile = './config.ini';

export { GoogleStrategy, mongo, oak, oauth, ezconfig, configFile };
