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
export class Panel extends Shadow {
  @property()
  version = 0;
  @property()
  accept = "";

  resource = null;
  validkeys = [];
  card = null;

  render() {
    this.getResource();
    this.createCard();
    return html`
    ${this.card}
    `;
  }
  getResource() {
    try {
      this.resource = JSON.parse(this.innerHTML);
      this.validkeys = this.accept.split(",").map(v=>v.trim());
    } catch {
      this.resource = this.innerHTML;
    }
  }
  createCard() {
    if (!this.resource["_id"]) { //Comprobación peligrosa
      return;
    }
    for (const entry of Object.entries(this.resource)) {
      if (this.validkeys.includes(entry[0])) {
        this.createPart(entry[0], entry[1]);
      }
    }
  }
  getType(val){
    /*de momento para diferenciar si los string son imagenes o no
      los numeros se mustran igual que los string
      para los object se vuelve a llamar a si misma y añade un field set
      para arrays se hace una lista
      para las imagenes se crea el img con href
      la colocación se hará por css(si quieres empezar por ahí)
      
    */
  }
  createPart(key: string, value: any) {
    console.log(typeof value, key);
  }
}
