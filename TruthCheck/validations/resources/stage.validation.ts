import { yup } from "../../deps.ts";
import { tags } from "../../config/resource.tags.ts";
import { idValidation } from "../resource.validation.ts";

export const createStageValidation = {
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
    pasive: yup
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
export const updateStageValidation = {
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
    pasive: yup
      .array(idValidation())
      .max(50)
      .length(50),
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
