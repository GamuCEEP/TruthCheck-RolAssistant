import { customElement, property, Shadow } from "../../deps.ts";

@customElement("g-data")
export class DataGetter extends Shadow {
  @property()
  href = null;

  @property()
  ondata = null;

  data = null;

  async firstUpdated() {
    if (!this.href || !!this.innerHTML.trim()) return;
    const data = await (await fetch(new URL(this.baseURI).origin + this.href))
      .text();
    try {
      this.data = JSON.parse(data);
    } catch {
      this.data = data;
    }
    this.ondata && eval(this.ondata)(this)

    this.init([]);
  }
}
