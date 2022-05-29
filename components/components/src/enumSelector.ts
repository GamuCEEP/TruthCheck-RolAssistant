import { AllowedExpressions } from "https://deno.land/x/shadow@v1.0.7/html.ts";
import {
  Attribute,
  css,
  customElement,
  html,
  mod,
  property,
  Shadow,
} from "../../deps.ts";

@customElement("g-selector")
export class EnumSelector extends Shadow {
  @property()
  options = "";
  @property()
  selectedIndex = 0;
  @property()
  shown = 3;

  optionArray: string[] = [];
  private htmlOption = (option: string, index: number) =>
    html`
      <button click="${this.select}" @class="option ${index}">
        ${option}
      </button>
    `;
  selected = () => this.dom.class["option"][Math.floor(this.shown / 2)];
  static styles = css`
    div{
      display:flex;
    }
    button{
      border: none;
      background-color: transparent;
    }
    .option{
      color: red;
    }
    .selected{
      color: green;
    }
  `;

  render() {
    this.optionArray = this.options?.split(",");
    return html`
    <div>
      <button id="previous" click=${this.previous}> ${"<"} </button>
      <div>
        ${this.shownOptions().map((a) => a)}
      </div>
      <button id="next" click="${this.next}"> ${">"} </button>
    </div>
    `;
  }
  next() {
    this.selectedIndex = mod(this.selectedIndex + 1, this.optionArray.length);
  }
  previous() {
    this.selectedIndex = mod(this.selectedIndex - 1, this.optionArray.length);
  }
  select(e: Event) {
    //@ts-ignore class item 1 is garanteed to be the index
    this.selectedIndex = parseInt((e.target as HTMLElement).classList.item(1));
  }
  private shownOptions() {
    const list: AllowedExpressions[] = [];
    const diff = Math.floor(this.shown / 2);
    for (let i = -diff; i <= diff; i++) {
      const index = mod(this.selectedIndex + i, this.optionArray.length);
      list.push(this.htmlOption(this.optionArray[index], index));
    }
    // @ts-ignore AllowedExpresions type gets filled with element
    (list[diff]["element"] as HTMLElement).classList.add("selected");
    return list;
  }
}
