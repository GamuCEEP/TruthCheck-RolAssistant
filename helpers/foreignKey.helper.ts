import { ForeignKey } from "../types/types.interface.ts";

export function toForeignKeys(collection: string, keys: string[]) {
  const foreignKeys: ForeignKey[] = [];
  for (const key of keys) {
    foreignKeys.push({
      referencedCollection: collection,
      referencedResource: key,
    });
  }
  return foreignKeys;
}

export function fromForeignKeys(keys: ForeignKey[]) {
  const foreignKeys: string[] = [];
  for (const key of keys) {
    foreignKeys.push(key.referencedResource);
  }
  return foreignKeys;
}

export function equals(foreignKey: ForeignKey, other: ForeignKey) {
  return other.referencedResource == foreignKey.referencedResource &&
    other.referencedCollection == foreignKey.referencedCollection;
}

export async function getReferencedResource(key: ForeignKey, services: Record<string, any>){
  return await services[key.referencedCollection].getOne(key.referencedResource)
}
