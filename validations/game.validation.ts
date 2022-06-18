import { yup } from "../deps.ts";
import { foreignKeyValidation, idValidation } from "./resource.validation.ts";

export const createGameValidation = {
  body: yup.object({
    name: yup
      .string()
      .required(),
    description: yup
      .string()
      .required(),
    actors: yup
      .array(
        yup.string(),
      )
      .max(10)
      .required(),
    stages: yup.array(
      yup.object({
        stage: idValidation(),
        deck: yup.array(
          yup.object({
            odds: yup
              .number()
              .integer()
              .required(),
            resource: foreignKeyValidation([
              "items",
              "stages",
              "actors",
              "effects",
            ])
              .required(),
            condition: yup.string(),
          }),
        ).required(),
      }),
    ).required(),
  }).noUnknown(false),
};

export const updateGameValidation = {
  params: yup.object({
    id: idValidation(),
  }),
  body: yup.object({
    name: yup
      .string(),
    description: yup
      .string(),
    isShared: yup
      .boolean(),
    actors: yup
      .array(
        yup.string(),
      )
      .max(10),
    stages: yup.object({
      stage: idValidation(),
      deck: yup.object({
        odds: yup
          .number()
          .integer(),
        resource: foreignKeyValidation([
          "items",
          "stages",
          "actors",
          "effects",
        ]).required(),
        condition: yup.string(),
      }),
    }),
  }).noUnknown(false),
};
