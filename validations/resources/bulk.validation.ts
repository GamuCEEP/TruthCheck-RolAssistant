import { yup } from "../../deps.ts";
import { tags } from "../../config/resource.tags.ts";
import { idValidation } from "../resource.validation.ts";

export const bulkFetchValidation = {
  body: yup.object({
    //todo
    /*
      decide if its gonna be:
      id:{ resource },
      id2: { resource } ...

      or:
      resources: [resource,resource, resource, resource...]

      or:
      actors:{
        ActorResource, ActorResource...
      }, 
      items:{
        ItemResource, ItemResource...
      }...
    */
  })
}