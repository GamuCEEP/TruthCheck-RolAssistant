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

@customElement("g-resource")
export class ResourceCard extends Shadow {
  @property()
  model = "";
  @property()
  resourceId = null;

  resource = null;
  schema = null;
  editor = null;

  href = "/api/resources/";

  static styles = css`
    /* #card{
      display: block;
      width: var(--card-width);
      height: var(--card-height);
    }
     h3{
      margin: 10px 0 0 10px;
    } 
    div.je-tabholder--top{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      margin: 0;
    }
    div.je-tab--top{
      border-radius: 0;
      flex-grow: 100;
      border-bottom: 1px solid white;
    }
    div[style*="1"]{
      background-color: var(--main-color) !important;
    }
    button, input:checked{
      border: none;
      color: white;
      background-color: var(--detail-color) !important;
      padding: 5px 15px !important;
      border-radius: 3px;
    }
     textarea{
      height: 100px !important;
      resize: none;
    }  */
  `;

  async firstUpdated() {
    const origin = new URL(this.baseURI).origin;
    const modelUrl = origin + "/models/" + this.model + ".json";
    let resourceUrl = origin + this.href + this.model;
    if (this.resourceId) resourceUrl += `/${this.resourceId}`;
    try {
      this.schema = await (await fetch(modelUrl))?.json();
      this.resource = await (await fetch(resourceUrl))?.json();
    } catch {}
    const options = {
      schema: this.schema,
      use_default_values: true,
    };
    if (this.resource) options["startval"] = this.resource;
    this.editor = new window["JSONEditor"](
      this.shadowRoot.querySelector("#card"),
      options,
    );
  }
  render() {
    return html`
      ${'<link rel="stylesheet" href="/styles/card.css">'}
      <div id="card"></div>
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
