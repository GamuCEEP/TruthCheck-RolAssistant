import { Context, Router, send } from "../deps.ts";
import configs from "../config/config.ts";

// deno-lint-ignore no-explicit-any
const router = new Router();

const pages: Record<string, string> = {
  home: 'pages/home.html',
  login: 'pages/login.html',
  register: 'pages/register.html',
  playground: 'pages/playground.html',
  workshop: 'pages/workshop.html',
  marketplace: 'pages/marketplace.html'
}

router.get("/(.*)", async (context: Context) => {
  const resource = context.request.url.pathname;
  const options = { root: `${Deno.cwd()}/public` };
  console.log(resource)
  try{
    await send(context, pages[resource.substring(1)] ?? resource, options);
  }catch(_e){
    context.response.body = { error: `File '${resource}' was not found`}
  }
});

export default router;
