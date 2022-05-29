/*

Un panel donde se muestra un documento externo

*/

import { customElement, html, property, Shadow } from "../../deps.ts";

@customElement("g-panel")
export class Panel extends Shadow {
  @property()
  href = null;

  html = "";
  onmodalready = new Event("modal-ready");

  async firstUpdated() {
    if (!this.href || !!this.innerHTML.trim()) return;
    const html = await (await fetch(new URL(this.baseURI).origin + this.href)).text();
    this.html = html;

    this.init([]);
    this.dispatchEvent(this.onmodalready);
  }

  render() {
    return html`${this.html}`;
  }
}
