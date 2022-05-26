/*

Un boton cuando lo clicas se abre un menú y se tapa el fondo con un cover
si clicas el cover se cierra el modal
el modal tiene un boton para cerrarse

recibe o una url o html

*/

// Actualmente es un menu, copiar a menu y modificar para que sea un modal

import { css, customElement, html, property, Shadow } from "../../deps.ts";
import type { ModalCover } from "./modalCover.ts";

@customElement("g-modal")
export class Modal extends Shadow {
  html = "";
  cover = (() => {
    let cover = document.querySelector("g-cover");
    if (cover) return cover;
    cover = document.createElement("g-cover");
    document.body.appendChild(cover);
    return cover;
  })();
  @property()
  href = null;
  @property()
  clear = false;

  static styles = css`
      #modal{
        display: block;
        background-color: var(--modal-bg);
        padding: 20px;
        border-radius: 5px;
        position: absolute;
        left: 0;
        right: 0;
        width: min-content;
        margin: auto;
        transform-origin: top right;
        transition: transform 500ms ease;
      }
      #close{
        position: absolute;
        top: 5px;
        right: 5px;
        border: none;
        background-color: transparent;
        transform-origin: center;
      }
      #close:hover{
        transform: translate(2px, -2px)
      }
      .opened{
        transform: scale(1) !important; 
      }
      .closed{
        transform: scale(0) !important;
      }

  `;

  render() {
    return html`
      <div @id="modal" class="closed">
        <button @id="close" click=${this.close}>X</button>
        <g-panel @id="panel" href="${this.href}"></g-panel>
      </div>
  `;
  }
  firstUpdated() {
    this.dom.id["panel"].addEventListener("modal-ready", () => {
      document.body.appendChild(this);
    });
  }
  open() {
    (this.cover as ModalCover)._show(this, true);
  }
  close() {
    (this.cover as ModalCover)._show(this, false);
  }
}
