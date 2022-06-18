/*

Rodea la pagina
recibe mapa de url e icono y las muestra en iframes
si esta chikito te deja deslizar entre pantallas debajo muestra los iconos (tipo insta)
si esta grandito te deja clicar entre las paginas y lo de abajo sale arriba
coje 2 paginas
*/
import { css, customElement, html, Shadow } from "../../deps.ts";

@customElement("g-frame")
export class Frame extends Shadow {
  pagesHTML: { page: string; icon: string }[];

  selectedPage = 0;

  static styles = css`
    #wrapper{
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-rows: 1fr 50px;
    }
    #pages{
      width: 100%;
      height: 100%;
      overflow: auto;
    }
    #pages > *{
      display: none;
    }
    #pages .selected{
      display: block;
    }
    img{
      width: 40px;
      height: 40px;
    }
    #controls{
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      background-color: var(--frame-color);
      z-index: 0;
    }
    #controls button{
      position: relative;
      border: none;
      padding: 0;
      background-color: transparent;
      width: 40%;
    }
    #controls button.selected img{
      filter: invert(1) opacity(.5) drop-shadow(0 0 0 var(--detail-color))
    }
    
  `;

  render() {
    const pages = [];
    for (const page of this.querySelectorAll("page")) {
      const url = page.attributes.getNamedItem("url").value;
      const icon = page.attributes.getNamedItem("icon").value;
      const reloadable = page.attributes.getNamedItem("reloadable")?.value
      pages.push({ url: url, icon: icon, reloadable: reloadable});
    }
    return html`
    <div id="wrapper">
      <div @id="pages">
        <g-panel class="selected" href="${pages[0].url}" reloadable="${pages[0].reloadable}"></g-panel>
        <g-panel href="${pages[1].url}" reloadable="${pages[1].reloadable}"></g-panel>
      </div>
      <div @id="controls">
        <button class="selected" click="${() => this.setPage(0)}">
          <img src="${pages[0].icon}"/>
        </button>
        <button click="${() => this.setPage(1)}">
          <img src="${pages[1].icon}"/>
        </button>
      </div>
  </div>
    `;
  }

  setPage(index) {
    const pages = this.dom.id["pages"].children;
    const buttons = this.dom.id["controls"].querySelectorAll("button");
    if(pages.item(index).getAttribute('reloadable')){
      pages.item(index)['reload']()
    }

    if (index == this.selectedPage) return;
    pages.item(this.selectedPage).removeAttribute("class");
    pages.item(index).setAttribute("class", "selected");
    buttons.item(this.selectedPage).removeAttribute("class");
    buttons.item(index).setAttribute("class", "selected");
    this.selectedPage = index;
  }

}
