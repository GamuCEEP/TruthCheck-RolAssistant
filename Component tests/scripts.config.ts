import type { DenonConfig } from "https://deno.land/x/denon/mod.ts";


const component = "menu"

const config: DenonConfig = {
  scripts: {
    compile: {
      cmd: `deno bundle ./components/src/${component}.ts ./components/dist/${component}.js`,
      desc: `Compile component ${component}`,
    },
  },
  watcher:{
    exts: ["ts"]
  }
};

export default config;