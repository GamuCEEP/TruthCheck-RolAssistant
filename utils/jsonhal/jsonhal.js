//Designed for client side

const curier = {
  expand: (base, suffix) => {
    return base.replace(/\/{.*}/g, (suffix[0] == '/' ? suffix : '/'+suffix));
  },
};

class jsonhal {
  constructor(request) {
    this.request = request.clone();
  }

  raw() {
    return this.request.clone().json();
  }

  async expand() {
    const hal = await this.raw();

    if (!hal._links?.curies) return hal;
    const curies = hal._links.curies;

    for (const curie of curies) {
      const name = curie.name;
      const template = curie.href;
      for (const key in hal._links) {
        if (key.startsWith(name + ":")) {
          hal._links[key] = curier.expand(template, hal._links[key].href);
        }
      }
    }
    delete hal._links.curies;
    return hal;
  }

  async getLink(link, namespace = "") {
    const links = (await this.raw())._links;
    if(!links) return undefined;
    if(namespace == '') return links[link]?.href;
    return links[namespace + ':' + link]?.href;
  }

  async resource(){
    const raw = await this.raw()
    delete raw._links
    delete raw._embeded
    return raw
  }

}

const req = new Request("https://google.com", {
  method: "POST",
  body: `
    {
      "_links": {
        "self": { "href": "/orders" },
        "curies": [{
          "name": "acme",
          "href": "http://docs.acme.com/relations/{rel}"
        }],
        "acme:widgets": { "href": "/widgets" }
      },
      "data":"patata",
      "cosas": 4,
      "_embeded": {}
    }`,
});


const handler = new jsonhal(req)
console.log(await handler.resource())