import * as ini from "https://deno.land/x/ini@v2.1.0/mod.ts";
import { templater } from "../templater/templater.js";

async function getConfig(path: string, section?: string) {
  const config = ini.decode(await Deno.readTextFile(path));
  if (section) return config[section] ?? null;
  return config;
}

async function getProperty(
  path: string,
  templateName: string,
  section?: string,
) {
  const config = await getConfig(path, section);
  const template: string = config[templateName];
  return templater.fromTemplate(template, config);
}

export { getConfig, getProperty };
