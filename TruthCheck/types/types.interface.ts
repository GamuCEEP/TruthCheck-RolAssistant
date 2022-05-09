import { Bson } from "../deps.ts";

export interface TokenStructure {
  access: { expires: Date; token: string };
  refresh: { expires: Date; token: string };
}

export interface UserStructure {
  id: string;
  name: string;
  email: string;
  role: string;
  isDisabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginStructure {
  tokens: TokenStructure | Error;
  user: UserStructure;
}

export interface CreateUserStructure {
  name: string;
  email: string;
  password: string;
  role: string;
  isDisabled: boolean;
}

export interface UpdateUserStructure {
  name?: string;
  email?: string;
  role?: string;
  isDisabled?: boolean;
}

export interface UpdatedStructure {
  matchedCount: number;
  modifiedCount: number;
  upsertedId: typeof Bson.ObjectId | null;
}

export interface Err {
  status: number;
  name: string;
  path: string;
  param: string;
  message: string;
  type: string;
}

export interface JwtPayload {
  iss: string;
  iat: number;
  id: string;
  exp: number;
}

export interface ForeignKey{
  referencedCollection: string;
  referencedItem: Bson.UUID
}

interface ResourceStructure{
  id: string;
  author: UserStructure | ForeignKey;
  name: string;
  description: string;
  imageURI: string;
  tags: string;
}

export interface ActorStructure extends ResourceStructure{
  stats: Record<string, string>;
  pasive: (EffectStructure | ForeignKey)[];
  active: (EffectStructure | ForeignKey)[];
  inventory: (ItemStructure | ForeignKey)[];
  equipment: (ItemStructure | ForeignKey)[];
}
export interface ItemStructure extends ResourceStructure{
  pasive: (EffectStructure | ForeignKey)[];
  active: (EffectStructure | ForeignKey)[];
}
export interface StageStructure extends ResourceStructure{
  pasive: (EffectStructure | ForeignKey)[];
}
export interface EffectStructure extends ResourceStructure{
  code: string
}
