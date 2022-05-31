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
import * as JSONEditor from "https://cdn.jsdelivr.net/npm/@json-editor/json-editor@latest/dist/nonmin/jsoneditor.js";

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
  updated() {
    // Set ACE Editor basePath to same path as CDN Library.
    window["ace"]?.config.set(
      "basePath",
      "https://cdn.jsdelivr.net/npm/ace-builds@latest/src-noconflict/",
    );

    // Initialize the editor with a JSON schema
    //deno-lint-ignore 
    const editor = new JSONEditor(this.dom.id["test"], {
      schema: {
        "title": "SQL Editor",
        "type": "object",
        "required": [
          "query",
        ],
        "properties": {
          "query": {
            "type": "string",
            "format": "sql",
            "options": {
              "ace": {
                "theme": "ace/theme/vibrant_ink",
                "tabSize": 2,
                "useSoftTabs": true,
                "wrap": true,
              },
            },
          },
        },
      },
      startval: {
        "query":
          "SELECT f.animal_id AS animal_id, \n       f.animal_type AS animal_type, \n       d.animal_description AS animal_description, \n       f.animal_name AS animal_name, \n       'Farm' AS domain, \n       att.animal_type_description AS description \n  \nFROM tutorial.farm f \n  \nLEFT OUTER JOIN tutorial.animal_types att \nON f.animal_type = att.animal_type_id \n  \nLEFT OUTER JOIN tutorial.animal_descriptions d \nON f.animal_description = d.animal_description_id \n  \nUNION ALL \n  \nSELECT w.animal_id AS animal_id, \n       w.animal_type AS animal_type, \n       d.animal_description AS animal_description, \n       w.animal_name AS animal_name, \n       'Wild' AS domain, \n       att.animal_type_description AS description \n  \nFROM tutorial.wild w \n  \nLEFT OUTER JOIN tutorial.animal_types att \nON w.animal_type = att.animal_type_id \n  \nLEFT OUTER JOIN tutorial.animal_descriptions d \nON w.animal_description = d.animal_description_id \n  \nWHERE w.animal_id IN (SELECT animal_id FROM wild WHERE animal_id <= 3)",
      },
    });

    // Hook up the submit button to log to the console
    // document.getElementById('submit').addEventListener('click',function() {
    // Get the value from the editor
    // console.log(editor.getValue());
    // });
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
