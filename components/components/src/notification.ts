import { css, customElement, html, property, Shadow } from "../../deps.ts";

@customElement("g-notification")
export class Notification extends Shadow {
  open = false;

  static styles = css`
    #notification{
      display: flex;
      box-sizing:border-box;
      width: 80%;
      height: 40px;
      border-radius: 3px;
      position: fixed;
      z-index: 2;
      bottom: 80px;
      left: 10%;
      padding: 5px 40px;
    }
    #notification[hidden]{
      display: none;
    }
    #notification[shown]{
      animation: 500ms cubic-bezier(0.12, 1.38, 0.58, 1.7) 0s 1 normal forwards running popIn ;
    }
    #message{
      margin: auto 0;
      display: block;
      align-self: center;
    }
    #closeBtn{
      position: absolute;
      top: 8px;
      right: 5px;
      font-size: 20px;
      border: none;
      background-color: transparent;
    }
    #closeBtn:hover{
      transform: translateY(-2px)
    }
    .info{
      color: black;
      background-color: var(--notification-info);
    }
    .critical{
      color: black;
      background-color: var(--notification-critical);
    }
    .error{
      color: black;
      background-color: var(--notification-error);
    }
    @keyframes popIn{
      from{
        transform: translateY(100px)
      }
      to{
        transform: translateY(0px)
      }
    }
  `;
  render() {
    return html`
    <div @id="notification" hidden click="${this.close}">
      <button @id="closeBtn">X</button>
      <p @id="message">There was an error</p>
    </div>
    `;
  }

  notify(message: string, type: string) {
    this.dom.id["notification"].removeAttribute("hidden");
    this.dom.id["notification"].setAttribute("shown", "");
    this.dom.id["message"].innerText = message;
    this.dom.id["notification"].setAttribute("class", type);
    setTimeout(()=>this.close(), 5000)
  }
  close() {
    this.dom.id["notification"].setAttribute("hidden", "");
    this.dom.id["notification"].removeAttribute("shown");
  }
}
