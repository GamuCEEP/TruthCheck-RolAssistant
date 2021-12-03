import { Router } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import * as indexCtrl from "../controllers/index.controllers.ts";

const index = new Router();

index.get("/", indexCtrl.getIndex);
index.get("/style.css", indexCtrl.getIndexStyles);



export default index;
