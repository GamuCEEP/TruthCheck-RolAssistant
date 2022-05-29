/*

  Boton cuando le das se abre un menu
  el menu puede cambiar de tamaño
  flota por encima de todo
  si clicas fuera se cierra

  recibe html
*/

import { css, customElement, html, property, Shadow } from "../../deps.ts";

@customElement("g-menu")
export class Menu extends Shadow {
  @property()
  href = null;
  isGoingToOpen = true;

  static styles = css`
      #panel{
        display: block;
        background-color: #999;
        position: relative;
        transform-origin: top right;
        transition: transform 5ms ease;
        width: min-content;
      }
      #panel:focus{
        transform: scale(1)
      }
      #panel{
        transform: scale(0)
      }
  `;
  render() {
    return html`
        <g-panel @id="panel" tabindex="1" href="${this.href}"></g-panel>
  `;
  }
  toggle() {
    console.log('clickaste el boton aaaaaa', this.isGoingToOpen)
    this.dom.id["panel"].focus();
  }
}
