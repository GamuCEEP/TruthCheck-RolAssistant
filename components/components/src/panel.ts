/*

Un panel donde se muestra un documento externo

*/

import { css, customElement, html, property, Shadow } from "../../deps.ts";

@customElement("g-panel")
export class Panel extends Shadow {
  @property()
  href = null;

  html = "";

  async firstUpdated() {
    if (!this.href || !!this.innerHTML.trim()) return;
    const html = await (await fetch(new URL(this.baseURI).origin + this.href))
      .text();
    this.html = `${html}`;

    this.init([]);
  }

  render() {
    return html`${this.html}`;
  }
  updated() {
    const scripts = this.shadowRoot.querySelectorAll("script");
    for (const script of scripts) {
      const final = document.createElement("script");
      final.innerHTML = script.innerHTML;
      final.type = script.type;
      const parent = script.parentNode;
      parent.removeChild(script);
      parent.appendChild(final);
    }
  }

  reload(){
    this.init([])
  }
}
