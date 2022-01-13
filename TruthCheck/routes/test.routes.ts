import { Request, Response, Context} from "https://deno.land/x/oak@v10.0.0/mod.ts";

const logger = async (
  { response, request }: {response: any, request: any},
  next: Function,
) => {
  await next();
  console.log(
    "Requested:",
    request.url.pathname,
    "\nResponded with:",
    response.status,
    "\n",
  );
};

export default logger;
