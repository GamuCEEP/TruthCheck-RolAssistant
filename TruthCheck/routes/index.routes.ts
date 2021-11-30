import { Router } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import * as indexCtrl from "../controllers/index.controllers.ts";

const router = new Router();

router.get("/", indexCtrl.getIndex);
router.get("/style.css", indexCtrl.getIndexStyles);



export default router;
