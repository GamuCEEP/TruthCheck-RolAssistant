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
  @property()
  href = "/api/resources/";
  @property()
  filter = "e=>e";

  resource = null;
  schema = null;
  editor = null;

  actionMap = {
    show: null,
    create: "Create",
    edit: "Save",
  };

  oneditorready = null;

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

  async populateResources(target) {
    if (!target) return;
    let text = JSON.stringify(target);
    const resoruceRgx = /"?#(\w+)"?/g;
    const nameRgx = /"?\$(\w+)"?/g;
    const resourceLists = {};
    //Substitute resource lists
    for (const match of text.matchAll(resoruceRgx)) {
      const rawlist = resourceLists[match[1]] ??
        await this.getResources(`${this.href}${match[1]}s`);
      const list = rawlist.map((e) => eval(this.filter)(e, match[1]));
      resourceLists[match[1]] = list;

      text = text.replace(/"(#.+?)"/g, `[$1]`);
      const listToAdd = JSON.stringify(list).replace(/^\[(.*?)\]$/g, "$1");
      text = text.replace("#" + match[1], listToAdd);
      text = text.replace(/}{/g, "},{");
    }
    //Substitute resource names
    for (const match of text.matchAll(nameRgx)) {
      const nameList = resourceLists[match[1]].map((r) => r?.name);
      text = text.replace(/"(\$[a-zA-Z\$]+?)"/g, `[$1]`);
      const listToAdd = JSON.stringify(nameList).replace(/^\[(.*?)\]$/g, "$1");
      text = text.replace("$" + match[1], listToAdd);
      text = text.replace(/""/g, '","');
    }
    return JSON.parse(text);
  }

  async loadResource() {
    if (!this.resourceId) return;

    let resourceUrl = `${origin}${this.href}${this.model}s/${this.resourceId}`;
    if (this.resourceId == "me") {
      resourceUrl = `${origin}${this.href}`;
    }
    this.resource = await this.getResources(resourceUrl);
  }
  async reflectAction() {
    this.oneditorready = ()=>this.editor.enable();
    switch (this.action) {
      case "create":
        break;
      case "show":
        await this.generateResource();
        this.oneditorready = ()=>this.editor.disable();
        break;
      case "edit":
        await this.generateResource();
        break;
      default:
        console.warn("Action", this.action, "not supported");
        break;
    }
  }
  async generateResource() {
    await this.loadResource();
    this.resource = await this.formatResource(this.resource);
    // this.resource = await this.populateResources(this.resource);
  }

  async updated() {
    await this.loadSchema();
    this.schema = await this.populateResources(this.schema);
    await this.reflectAction();

    const options = {
      schema: this.schema,
    };
    if (this.resource) {
      options["startval"] = JSON.parse(JSON.stringify(this.resource));
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
    try {
      var response = await fetch(url);
      if (response.status >= 200 && response.status < 300) {
        const resource = await response.json();
        return resource;
      }
      console.warn("Resource is not a valid json", url);
    } catch {
      console.warn("Resource could not load", { url }, response);
    }
    return [];
  }

  async formatResource(resource) {
    if (!resource) {
      return;
    }
    //if its a game
    if (resource?.actors) {
      const newActors = [];
      for (const id of resource["actors"]) {
        const url = `${this.href}actors/${id.referencedResource}`;
        let data = await this.getResources(url);
        data = eval(this.filter)(data, this.model);
        newActors.push(data);
      }
      resource["players"] = newActors;
      for (const stage of resource["stages"]) {
        const url = `${this.href}stages/${stage.stage.referencedResource ?? stage.stage }`;
        let data = await this.getResources(url);
        data = eval(this.filter)(data, this.model);
        stage.stage = data;
      }
      for (const stage of resource["stages"]) {
        for (const deck of stage["deck"]) {
          const url = `${this.href}${deck.resource.referencedCollection}/${deck.resource.referencedResource}`;
          let data = await this.getResources(url);
          data = eval(this.filter)(data, this.model);
          deck.resource = data;
        }
      }
      delete resource.actors;
      delete resource._id;
      delete resource.id;
      delete resource.author;
      delete resource.docVersion;
      delete resource.isShared;
      delete resource.createdAt;
      return resource;
    }
    //If its a resource or a user
    //Id to resource
    return this.cleanResource(resource);
  }
  async cleanResource(resource) {
    for (const prop of ["pasive", "active", "inventory", "equipment"]) {
      if (!resource[prop]) continue;
      let resourceType;
      if (["pasive", "active"].includes(prop)) {
        resourceType = "effects";
      }
      if (["inventory", "equipment"].includes(prop)) {
        resourceType = "items";
      }
      const newProp = [];
      for (const id of resource[prop]) {
        const url = `${this.href}${resourceType}/${id.referencedResource}`;
        let data = await this.getResources(url);
        data = eval(this.filter)(data);
        newProp.push(data);
      }
      resource[prop] = newProp;
    }
    //Code for effects
    if (resource.code) {
      resource.code = { code: resource.code };
    }
    //Tags
    if (resource.tags) {
      resource.tags = resource.tags.map((tag: string) =>
        tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
      );
    }
    //Stats
    if (resource.stats) {
      const stats = [];
      for (const key in resource.stats) {
        stats.push({ key: key, value: resource.stats[key] });
      }
      resource.stats = stats;
    }

    delete resource.id;
    delete resource._id;
    delete resource.author;
    delete resource.imageURI;

    delete resource.createdAt;
    delete resource.isShared;
    delete resource.docVersion;

    delete resource.isDisabled;
    delete resource.updatedAt;
    delete resource.likedResources;

    return resource;
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
