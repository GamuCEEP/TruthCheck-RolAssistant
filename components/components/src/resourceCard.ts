/*
Accept a json for structure
2 modes, open and closed
 -open: shows most of the info acts like a modal
 -closed: a little card with few pieces of info

Make closed info selectable on the json
Make open info selectable on the json

{
  resource:{}
  openInfo:{}
  closedInfo:{}
}

{
    "_id": "62867f1bf08701a650784492",
    "author": "6283f46d1377d4f5ea321495",
    "name": "MURCIA!!",
    "description": "Hay quien dice que no existe",
    "pasive": [
      "62867ce3ea2f41a61c04ccc2"
    ],
    "imageURI": "murgia.jpeg",
    "tags": [
      "fire"
    ],
    "createdAt": "2022-05-19T17:32:11.384Z",
    "isShared": false,
    "docVersion": 2,
    "updatedAt": "2022-05-19T17:32:45.921Z"
  }

*/

import { css, customElement, html, property, Shadow } from "../../deps.ts";
import * as JSONEditor from 'https://cdn.jsdelivr.net/npm/@json-editor/json-editor@latest/dist/nonmin/jsoneditor.js'
@customElement("g-resource")
export class ResourceCard extends Shadow {
  @property()
  model = `
  {
    schema: {
      type: "object",
      title: "Car",
      properties: {
        make: {
          type: "string",
          enum: [
            "Toyota",
            "BMW",
            "Honda",
            "Ford",
            "Chevy",
            "VW"
          ]
        },
        model: {
          type: "string"
        },
        year: {
          type: "integer",
          enum: [
            1995,1996,1997,1998,1999,
            2000,2001,2002,2003,2004,
            2005,2006,2007,2008,2009,
            2010,2011,2012,2013,2014
          ],
          default: 2008
        },
        safety: {
          type: "integer",
          format: "rating",
          maximum: "5",
          exclusiveMaximum: false,
          readonly: false
        }
      }
    }
  }
  `;
  @property()
  resourceId = null;

  href = "api/resources";

  async firstUpdated() {
    const resource =
      await (await fetch(new URL(this.baseURI).origin + this.href))
        .text();
        
  }
  render() {
    return html`
  <div @id="test"></div>
  `;
  }

  /*

  El service worker despues de cargar la pagina:
    pide todos los recursos y los cachea
  El sw tiene un endpoint resources
    puede recibir un parametro para el tipo
    una id para un recurso especifico
    si no hay id devuelve el siguiente recurso hasta que se acaben

   */
}
