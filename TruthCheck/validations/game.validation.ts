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
    imgaeURI: yup
      .string()
      .required(),
    actors: yup
      .array(
        yup.string(),
      )
      .max(10)
      .required(),
    stages: yup.object({
      phase: yup
        .array(
          yup.number()
            .integer(),
        ).required(),
      stage: idValidation(),
      deck: yup.object({
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
      }).required(),
    }).required(),
  }),
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
    imgaeURI: yup
      .string(),
    isShared: yup
      .boolean(),
    actors: yup
      .array(
        yup.string(),
      )
      .max(10),
    stages: yup.object({
      phase: yup
        .array(
          yup.number()
            .integer(),
        ),
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
  }),
};
