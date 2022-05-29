/*

Componente que se encarga de carga la información del usuario
ofrece metodos para que otros componentes accedan a ella

*/


import { customElement, Shadow } from "../../deps.ts";

@customElement("g-account")
export class AccountHandler extends Shadow {
  
  user: any = {};

  async firstUpdated() {
    await fetch('/api/auth/me', {
      method: 'GET'
    })
  }
}