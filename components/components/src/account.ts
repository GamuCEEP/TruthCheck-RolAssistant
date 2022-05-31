import { customElement, html, property, Shadow } from "../../deps.ts";

@customElement("g-account")
export class AccountChecker extends Shadow {
  @property()
  href = "";

  api = "/api/auth/me";

  render() {
    this.style.display = 'none'
    return html``;
  }
  async firstUpdated() {
    const origin = new URL(window.location.href).origin;
    let me
    try {
      me = await (await fetch(origin + this.api)).json();
    } catch {
      me = { status: 1 };
    }

    if (me?.status) {
      window.history.replaceState({}, "", origin + this.href);
      window.location.replace(origin + this.href);
    }
  }
}
