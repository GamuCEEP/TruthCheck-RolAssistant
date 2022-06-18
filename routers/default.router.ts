import { Context, Router, send } from "../deps.ts";
import { pageAuth } from "../middlewares/auth.middleware.ts";

// deno-lint-ignore no-explicit-any
const router: any = new Router();

const openPages = [
  "/pages/login.html",
  "/pages/register.html",
  "/pages/home.html",
];
router.get('/test', (context: Context)=>{
  context.response.body = JSON.stringify({name: 'pepe'})
  context.response.type = 'application/json'
})
router.get("/(.*)", async (context: Context) => {
  let resource = getPath(context.request.url.pathname);
  const options = { root: `${Deno.cwd()}/public` };

  const authorized = await pageAuth(context);

  if (!(openPages.includes(resource) || authorized) && resource.endsWith('.html')) {
    context.response.body = `<head><meta http-equiv="Refresh" content="0; URL=https://example.com/"></head>`
    context.response.type = 'text/html'
    return;
  }

  try {
    await send(context, resource, options);
  } catch (_e) {
    context.response.body = { error: `File '${resource}' was not found` };
  }
});

router.post("/(.*)", async (context: Context)=>{
  const body = await context.request.body().value
  context.response.body = body 
})

const redirects: Record<string, string> = {
  "/": "/pages/home.html",
};

function getPath(resource: string) {
  if (resource in redirects) {
    return redirects[resource];
  }
  const pageRegex = /\.|\/{2,}/g;
  if (!pageRegex.test(resource)) {
    return `/pages${resource}.html`;
  }
  return resource
}

export default router;
