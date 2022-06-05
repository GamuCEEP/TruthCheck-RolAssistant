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
  @property()
  onsend = null;

  resource = null;
  schema = null;
  editor = null;

  actionMap = {
    show: null,
    create: "Create",
    edit: "Save",
  };

  oneditorready = null;

  href = "/api/resources/";

  static styles = css`
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
    #card{
      position: relative;
    }
    #card > button{
      position: absolute;
      right: 5px;
      bottom: 5px;
    }
  `;

  async loadSchema() {
    const schemaUrl = origin + "/models/" + this.model + ".json";
    this.schema = await this.getResources(schemaUrl);
  }

  async populateResources() {
    let text = JSON.stringify(this.schema);
    const resoruceRgx = /"#(\w+)"/g;
    const nameRgx = /"\$(\w+)"/g;
    const resourceLists = {};
    //Substitute resource lists
    for (const match of text.matchAll(resoruceRgx)) {
      const rawlist = resourceLists[match[1]] ??
        await this.getResources(`${this.href}${match[1]}s`);
      const list = rawlist.map((r) => {
        return { //Get only the properties we want
          id: r.id,
          name: r.name,
          description: r.description,
        };
      });
      resourceLists[match[1]] = list;
      text = text.replace(match[0], JSON.stringify(list));
    }
    //Substitute resource names
    for (const match of text.matchAll(nameRgx)) {
      const nameList = resourceLists[match[1]].map((r) => r.name);
      text = text.replace(match[0], JSON.stringify(nameList));
    }
    this.schema = JSON.parse(text);
  }

  async loadResource() {
    if (!this.resourceId) return;
    const resourceUrl =
      `${origin}${this.href}${this.model}s/${this.resourceId}`;
    this.resource = await this.getResources(resourceUrl);
  }
  reflectAction() {
    switch (this.action) {
      case "create":
        break;
      case "show":
        this.loadResource();
        this.oneditorready = () => {
          this.editor.disable();
        };
        break;
      case "edit":
        this.loadResource();
        break;
      default:
        console.warn("Action", this.action, "not supported");
        break;
    }
  }

  async updated() {
    await this.loadSchema();
    await this.populateResources();
    await this.reflectAction();

    const options = {
      schema: this.schema,
    };
    if (this.resource) {
      options["startval"] = this.resource;
    }

    this.editor = new window["JSONEditor"](
      this.shadowRoot.querySelector("#card"),
      options,
    );
    if (this.oneditorready) {
      this.editor.on("ready", this.oneditorready);
    }
    if (this.actionMap[this.action]) {
      const button = document.createElement("button");
      button.innerHTML = this.actionMap[this.action];
      this.dom.id["card"].appendChild(button);
      if (this.onsend) {
        button.addEventListener("click", () => {
          eval(this.onsend)(this.editor.getValue());
        });
      }
    }
  }
  render() {
    return html`
      ${'<link rel="stylesheet" href="/styles/card.css">'}
      <div @id="card"></div>
    `;
  }

  async getResources(url) {
    try{

      const response = await fetch(url);
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      console.warn("Resource is not a valid json", url);
    }catch{
      console.warn('Resource coul not load')
    }
    return [];
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
