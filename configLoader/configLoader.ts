import * as ini from "https://deno.land/x/ini@v2.1.0/mod.ts";

async function getConfig(path: string, section?: string) {
  const config = ini.decode(await Deno.readTextFile(path));
  if (section) return config[section] ?? null;
  return config;
}

/**
 * @param path 
 * @param templateName 
 * @param section 
 * @returns property template filled
 */
async function getProperty(
  path: string,
  templateName: string,
  section?: string,
) {
  const config = await getConfig(path, section);
  const template: string = config[templateName];
  let property: string = template;
  for (const match of template.match(/{.*?}/g) || []) {
    property = property.replaceAll(match,config[match.substring(1,match.length-1)])
  }
  return property;
}

export { getProperty, getConfig }
