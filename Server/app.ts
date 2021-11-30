import * as oak from "https://deno.land/x/oak@v10.0.0/mod.ts";

const app = new oak.Application();

const port = 8000;



app.use((ctx) =>{
    ctx.response.body = ctx.request.headers.get('GET');
    
})

await app.listen({ port })