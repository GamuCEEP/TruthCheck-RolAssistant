import { yup } from "../../deps.ts";
import { tags } from "../../config/resource.tags.ts";
import { idValidation } from "../resource.validation.ts";

export const createItemValidation = {
  body: yup.object({
    name: yup
      .string()
      .min(1)
      .max(256)
      .trim()
      .required(),
    description: yup
      .string()
      .min(1)
      .max(1024)
      .trim()
      .required(),
    stats: yup
      .lazy((val: any) => {
        const obj: any = {};
        for (const key in val) {
          obj[key] = yup.string().min(1).max(32);
        }
        return yup.object(obj).required();
      }),
    pasive: yup
      .array(idValidation())
      .max(50)
      .required(),
    active: yup
      .array(idValidation())
      .max(50)
      .required(),
    imageURI: yup
      .string()
      .min(1)
      .max(128)
      .required(),
    tags: yup
      .array(yup.string().oneOf(tags))
      .max(50)
      .required(),
  }),
};
export const updateItemValidation = {
  params: yup.object({
    id: idValidation(),
  }),
  body: yup.object({
    name: yup
      .string()
      .min(1)
      .max(256)
      .trim(),
    description: yup
      .string()
      .min(1)
      .max(1024)
      .trim(),
    stats: yup
      .lazy((val: any) => {
        const obj: any = {};
        for (const key in val) {
          obj[key] = yup.string().min(1).max(32);
        }
        return yup.object(obj);
      }),
    pasive: yup
      .array(idValidation())
      .max(50),
    active: yup
      .array(idValidation())
      .max(50),
    imageURI: yup
      .string()
      .min(1)
      .max(128),
    tags: yup
      .array(yup.string().oneOf(tags))
      .max(50),
    isShared: yup
      .boolean(),
  }),
};
