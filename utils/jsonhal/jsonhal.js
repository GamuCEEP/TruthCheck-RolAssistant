// import { Middleware } from "https://deno.land/x/oak@v10.1.0/mod.ts";

import { curier } from '../templater/templater.js';

const jsonhal = {
  read: (request) => {
    const hal = await request.json()

    if(!hal._links?.curies) return hal

    const curies = hal._links.curies

    for(const curie of curies){
      // rename curied names, and extend their hrefs
    }

  },
};
