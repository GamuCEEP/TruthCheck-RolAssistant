import { Bson } from "../deps.ts";

//#region General types
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
export interface ForeignKey {
  referencedCollection: string;
  referencedResource: string;
}
//#endregion

//#region Auth types
export interface TokenStructure {
  access: { expires: Date; token: string };
  refresh: { expires: Date; token: string };
}
export interface JwtPayload {
  iss: string;
  iat: number;
  id: string;
  exp: number;
}
export interface LoginStructure {
  tokens: TokenStructure | Error;
  user: UserStructure;
}
//#endregion

//#region User types
export interface UserStructure {
  id: string;
  name: string;
  email: string;
  role: string;
  likedResources: ForeignKey[];
  isDisabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CreateUserStructure {
  name: string;
  email: string;
  password: string;
}
export interface UpdateUserStructure {
  name?: string;
  isDisabled?: boolean;
  likedResources?: { add?: ForeignKey[]; remove?: ForeignKey[] };
}
//#endregion

//#region Resource basics
interface ResourceStructure {
  id: string;
  author: UserStructure | string;
  name: string;
  description: string;
  imageURI: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
  isShared: boolean;
}
interface CreateResourceStructure {
  author: string;
  name: string;
  description: string;
  imageURI: string;
  tags: string[];
}
interface UpdateResourceStructure {
  name?: string;
  description?: string;
  imageURI?: string;
  tags?: string[];
  isShared?: boolean;
}

export interface FetchResourceStructure {
  [key: string]: (
    | ActorStructure
    | ItemStructure
    | StageStructure
    | EffectStructure
  )[];
}
//#endregion

//#region Actor types
export interface ActorStructure extends ResourceStructure {
  stats: Record<string, string>;
  pasive: ForeignKey[];
  active: ForeignKey[];
  inventory: ForeignKey[];
  equipment: ForeignKey[];
}
export interface CreateActorStructure extends CreateResourceStructure {
  stats: Record<string, string>;
  pasive: string[];
  active: string[];
  inventory: string[];
  equipment: string[];
}
export interface UpdateActorStructure extends UpdateResourceStructure {
  stats?: Record<string, string>;
  pasive?: string[];
  active?: string[];
  inventory?: string[];
  equipment?: string[];
}
//#endregion

//#region Item types
export interface ItemStructure extends ResourceStructure {
  stats: Record<string, string>;
  pasive: ForeignKey[];
  active: ForeignKey[];
}
export interface CreateItemStructure extends CreateResourceStructure {
  stats: Record<string, string>;
  pasive: string[];
  active: string[];
}
export interface UpdateItemStructure extends UpdateResourceStructure {
  stats?: Record<string, string>;
  pasive?: string[];
  active?: string[];
}
//#endregion

//#region Stage types
export interface StageStructure extends ResourceStructure {
  pasive: ForeignKey[];
}
export interface CreateStageStructure extends CreateResourceStructure {
  pasive: string[];
}
export interface UpdateStageStructure extends UpdateResourceStructure {
  pasive?: string[];
}
//#endregion

//#region Effect types
export interface EffectStructure extends ResourceStructure {
  code: string;
}
export interface CreateEffectStructure extends CreateResourceStructure {
  code: string;
}
export interface UpdateEffectStructure extends UpdateResourceStructure {
  code?: string;
}
//#endregion

//#region Game
export interface GameStructure {
  id: string;
  author: string;
  name: string;
  description: string;
  isShared: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  actors: ForeignKey[];
  stages: {
    stage: ForeignKey;
    deck: {
      odds: number;
      resource: ForeignKey;
      condition?: string;
    }[];
  }[];
}
export interface UpdateGameStructure {
  name?: string;
  description?: string;
  isShared?: boolean;
  actors?: string[];
  stages?: {
    stage: string;
    deck?: {
      odds?: number;
      resource: ForeignKey;
      condition?: string;
    }[];
  }[];
}
export interface CreateGameStructure {
  author: string;
  name: string;
  description: string;
  actors: string[];
  stages: {
    stage: string;
    deck: {
      odds: number;
      resource: ForeignKey;
      condition?: string;
    }[];
  }[];
}

//#endregion
