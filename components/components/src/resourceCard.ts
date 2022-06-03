/*
Accept a json for structure
2 modes, open and closed
 -open: shows most of the info acts like a modal
 -closed: a little card with few pieces of info

Make closed info selectable on the json
Make open info selectable on the json

*/

import { css, customElement, html, property, Shadow } from "../../deps.ts";

@customElement("g-resource")
export class ResourceCard extends Shadow {
  @property()
  model = "";
  @property()
  resourceId = null;
  @property()
  action = null;

  resource = null;
  schema = null;
  editor = null;

  href = "/api/resources/";

  static styles = css`
    #card{
      display: block;
      width: var(--card-width);
      height: var(--card-height);
    }
    h3{
      margin: 10px 0 0 10px !important;
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
    button{
      border: none;
      color: white;
      background-color: var(--detail-color) !important;
      padding: 5px 15px !important;
      border-radius: 3px;
    }
    button:disabled{
      filter: grayscale();
      cursor: not-allowed;
    }
     textarea{
      height: 100px !important;
      resize: none;
    }
    h3{
      margin:0;
    }
    .je-object__controls{
      display: block;
      margin: 0 !important;
      height: 0 !important;
    }
    .je-indented-panel{
      border: none !important;
    }
    *:disabled{
      background-color: var(--light-color);
      color: black;
      border: initial;
    }
  `;

  async loadResources() {
    const origin = new URL(this.baseURI).origin;
    const modelUrl = origin + "/models/" + this.model + ".json";
    let resourceUrl = origin + this.href + this.model + "s";
    if (this.resourceId) resourceUrl += `/${this.resourceId}`;
    try {
      this.schema = await (await fetch(modelUrl))?.json();
      if (this.action != "show") {
        this.resource = await (await fetch(resourceUrl))?.json();
      }
    } catch {}
  }
  modifySchema() {
    switch (this.action) {
      case "edit":
        break;
      case "create":
        break;
      default:
        this.editor.on("ready", () => {
          for (
            const e of this.shadowRoot.querySelectorAll(
              "input, textarea, button, select",
            )
          ) {
            e.setAttribute("disabled", "true");
          }
        });
        break;
    }
  }

  async updated() {
    await this.loadResources();
    const options = {
      schema: this.schema,
    };
    if (this.resource) {
      options["startval"] = this.resource;
      console.log(this.resource, "se encontró");
    }

    this.editor = new window["JSONEditor"](
      this.shadowRoot.querySelector("#card"),
      options,
    );
    this.modifySchema();
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
