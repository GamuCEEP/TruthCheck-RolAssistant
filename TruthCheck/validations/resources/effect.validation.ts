import { yup } from "../../deps.ts";
import { tags } from "../../config/resource.tags.ts";
import { idValidation } from "../resource.validation.ts";

export const createEffectValidation = {
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
    code: yup
      .string()
      .max(2048)
      .trim()
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
export const updateEffectValidation = {
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
    code: yup
      .string()
      .max(2048)
      .trim(),
    imageURI: yup
      .string()
      .min(1)
      .max(128),
    // tags: yup
    //   .array(yup.string().oneOf(tags))
    //   .max(50),
    isShared: yup
      .boolean(),
  }),
};
