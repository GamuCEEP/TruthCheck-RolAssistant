import { css, customElement, html, property, Shadow } from "../../deps.ts";

@customElement("g-cover")
export class Cover extends Shadow {
  modal = null;

  static styles = css`
      #cover{
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: var(--modal-cover);
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
      <div @id="cover" class="closed" click="${this.closeAll}"></div>
  `;
  }
  _show(element: HTMLElement, show: boolean) {
    if (show && element != this.modal) {
      this.modal?.close();
      this.modal = element;
    }
    this.setVisibility(element.shadowRoot.querySelector("#modal"), show)
    this.setVisibility(this.dom.id["cover"], show)
  }
  setVisibility(element: HTMLElement, show: boolean){
    const states = [ 'closed','opened']
    element.classList.add(states[+show]);
    element.classList.remove(states[+!show]);
  }
  closeAll() {
    this.modal.close()
  }
}

export type ModalCover = Cover;
