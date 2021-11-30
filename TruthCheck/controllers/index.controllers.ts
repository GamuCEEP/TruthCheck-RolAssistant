import { Request, Response } from "https://deno.land/x/oak@v10.0.0/mod.ts";

export const getIndex = async (
  { response }: { response: Response },
) => {
  response.body = await Deno.readFile("./public/index.html");
};

export const getIndexStyles = async (
  { response }: { response: Response },
) => {
  response.body = await Deno.readFile("./public/style.css");
};
