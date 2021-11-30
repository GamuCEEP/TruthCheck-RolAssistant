import { Request, Response, Router } from "https://deno.land/x/oak@v10.0.0/mod.ts";

const router = new Router()


const logger = async (
    { response, request }: { response: Response; request: Request },
    next: Function,
  ) => {
    await next()
    console.log('Requested:',request.url.pathname,'\nResponded with:',response.status,'\n')
  };

export default logger