(() => {
  self.addEventListener("fetch", main);
  self.onerror = (e) => {
    console.error("Error -->", e);
  };

  self.addEventListener("install", () => {
    console.log("Instalado");
  });

  self.addEventListener('message', e=>{
    if(e.data == 'autoLoggin') autoLoggin()
  })

  self.addEventListener("activate", () => {
    console.log("Activo");
  });

  function main(ev) {
    ev.respondWith(
      requestManager(ev),
    );
  }
  //#region Core
  /**
   * @param {string} url
   * @param {RequestInit} requestInit
   * @param {boolean} cache
   * @returns {Promise<Response>}
   */
  async function fetch(url, requestInit, cache = true) {
    if(cache){
      const cache = await fromCache(url, cacheTypes.util) 
      if(cache) return cache
      const response = self.fetch(url, requestInit)
      toCache(url, (await response).clone(), cacheTypes.util)
      return response
    }

    return self.fetch(url, requestInit)
  }

  const handlers = {
    api: {
      auth: {
        me: meHandler,
        login: login,
        refresh: refresh,
        default: returnToReferer,
      },
      default: resourceHandler,
    },
    sw: {
      id: getIdList,
    },
    default: defaultHandler,
  };
  //#endregion
  //#region Api handlers
  /**
   * @param { FetchEvent } ev
   */
  function requestManager(ev) {
    const request = ev.request.clone();
    const pathname = new URL(request.url).pathname;

    const handler = getHandler(pathname, handlers);
    return handler(request);
  }

  /**
   * @param { Request } request
   * @returns { Promise<Response> }
   */
  async function meHandler(request) {
    if (request.method == "POST") return register(request);
    if (request.method == "GET") {
      return fetch(request.url, {
        headers: {
          ...await createAuthHeader(),
        },
      });
    }
    //Me update is divided in 2 endpoints,
    // 'api/auth/me' for name change
    // 'api/resources/:id?liked' | 'api/resources/:id?disliked'
    if (request.method == "PUT") {
      const form = await request.clone().formData();
      return authHelper(
        {
          name: form.get("name"),
        },
        request,
        "/api/auth/me",
      );
    }
  }
  async function autoLoggin(){
    const userCredentials = await dataFromCache('credentials', cacheTypes.private)
    if(!userCredentials) return;
    const data = {
      email: userCredentials.email,
      password: userCredentials.password
    }
    const authResponse = await authHelper(
      data,
      {referrer: '/home'},
      "/api/auth/login",
    );
    if (status(authResponse) != "ok") {
      return authResponse;
    }
    await saveLogin(await authResponse.json());

  }
  /**
   * @param { Request } request
   * @returns { Promise<Response> }
   */
  async function login(request) {
    if (request.method != "POST") return returnToReferer(request, "error");
    const form = await request.clone().formData();
    const authResponse = await authHelper(
      {
        email: form.get("email"),
        password: form.get("password"),
      },
      request,
      "/api/auth/login",
    );
    //save credentials for auto login next time
    dataToCache('credentials', {
      email: form.get("email"), password: form.get("password")
    }, cacheTypes.private)

    if (status(authResponse) != "ok") {
      return authResponse;
    }
    await saveLogin(await authResponse.json());
    return Response.redirect(origin + "/home");
  }
  /**
   * @param { Request } request
   * @returns { Promise<Response> }
   */
  async function register(request) {
    if (request.method != "POST") return returnToReferer(request, "error");
    const form = await request.clone().formData();
    const authResponse = await authHelper(
      {
        email: form.get("email"),
        password: form.get("password"),
        name: form.get("name"),
      },
      request,
      "/api/auth/me",
    );
    if (status(authResponse) != "ok") {
      return authResponse;
    }
    return login(request);
  }
  /**
   * @param { Request } request
   * @returns { Promise<Response> }
   */
  async function refresh(request) {
    if (request.method != "POST") return returnToReferer(request);
    const authResponse = await authHelper(
      {
        refreshToken: (await dataFromCache("tokens", cacheTypes.private)).refresh.token,
      },
      request,
      "/api/auth/refresh",
    );
    if (authResponse) return authResponse;
  }
  /**
   * @param { Request } request
   * @returns { Promise<Response> }
   */
  async function resourceHandler(request) {
    try {
      var data = await request.clone().json();
    } catch {
      data = await request.clone().text();
    }
    const methods = {
      /**
       * @param {Request} request
       */
      POST: async (request) => {
        console.log("Posting resource");
        return authFetch(request.url, data, "POST");
      },
      /**
       * @param {Request} request
       */
      GET: async (request) => {
        console.log("Getting resource");
        return fetch(request.url, await authInit({}));
      },
      /**
       * @param {Request} request
       */
      PUT: async (request) => {
        console.log("Putting resource");
        const params = getParams(request.url);
        if (params.liked || params.disliked) {
          return authFetch("/api/auth/me", {
            likedResources: {
              add: data.likedResources.add,
              remove: data.likedResources.remove,
            },
          }, "PUT");
        }
        return authFetch(request.url, data, "put");
      },
      /**
       * @param {Request} request
       */
      DELETE: async (request) => {
        console.log("Deleting resource");
        return authFetch(request.url, {}, "delete");
      },
    };
    return methods[request.method](request);
  }
  /**
   * @param { Request } request
   * @returns { Promise<Response> }
   */
  async function defaultHandler(request) {
    return fetch(request.url, {
      headers: {
        ...await createAuthHeader(),
      },
    });
  }
  //#endregion

  //region Sw handlers
  /**
   * @param {Request} request
   * @returns
   */
  async function getIdList(request) {
    const resourceType = request.url.split("/").pop();
    const url = `${origin}/api/resources/${resourceType}s`;
    const response = await fetch(url, await authInit({}));

    if (status(response) != "ok") return new Response("[]");

    const result = [];//maybe it falis if resource is only one or null
    for(const resource of await response.clone().json()){
      result.push(resource.id ?? resource._id)
    }
    
    return new Response(JSON.stringify(result));
  }
  //#endregion

  //#region Helpers
  /**
   * @param { {referrer: string} } request
   * @returns { Promise<Response> | null }
   */
  async function authHelper(credentials, request, url) {
    if (Object.entries(credentials).some((e) => e[1] == "")) {
      console.log("Falta data");
      return returnToReferer(request, "missingData");
    }
    const response = await authFetch(url, credentials);
    if (status(response) != "ok") {
      return returnToReferer(request, "error");
    }
    return response;
  }

  async function saveLogin(response) {
    if (response.tokens && response.user) {
      dataToCache("tokens", response.tokens, cacheTypes.private);
      dataToCache("user", response.user, cacheTypes.shared);
    }
  }

  function getHandler(pathname, routes) {
    const steps = pathname.split("/").filter((v) => v != "");
    let handler = routes;
    for (const step of steps) {
      if (typeof handler != "object") break;
      if (handler[step] != null) {
        handler = handler[step];
        continue;
      }
      handler = handler["default"];
      break;
    }
    if(typeof handler != 'function') console.log('OHHHHH NOOOOOO', {handler, pathname})
    return handler;
  }

  // Función para cargar los recusrsos y cachearlos
  // Endpoints para:
  //  - Listas con todos los recursos accesibles para usar
  //  - me(ya esta, falta cache pero se va a cachear todo)
  /*  - get the next resource for explore view






  */

  /*                             *\
  | ### Local storage helpers ### |
  \*                             */
  function toLocalStorage(key, data) {
    globalThis.localStorage.setItem(key, data);
  }
  function fromLocalStorage(key) {
    return globalThis.localStorage.getItem(key);
  }

  /*                       *\
  | ### Caching helpers ### |
  \*                       */
  const cacheTypes = {
    "private": "TruthCheckPrivate",
    "shared": "TruthCheckPublic",
    "util": "TruthCheckUtil"
  };
  function getCache(cache = cacheTypes.shared) {
    return caches.open(cache);
  }
  async function deleteCache(request, cacheName) {
    const cache = await getCache(cacheName);
    await cache.delete(request);
  }
  async function fromCache(request, cacheName) {
    const cache = await getCache(cacheName);
    return cache.match(request);
  }
  async function toCache(url, response, cacheName) {
    const cache = await getCache(cacheName);
    await cache.put(url, await response);
  }
  async function dataToCache(key, data, cacheName) {
    const cache = await getCache(cacheName);
    await cache.put(key, new Response(JSON.stringify(data)));
  }
  async function dataFromCache(key, cacheName = cacheTypes.shared) {
    const cache = await getCache(cacheName);
    const entry = await cache.match(key);
    if (!entry) return null;
    try {
      return entry.json();
    } catch {
      return entry.text();
    }
  }

  /*                       *\
  | ### Request helpers ### |
  \*                       */
  function getParams(requestURL) {
    const params = new URL(requestURL).searchParams;
    if (params.toString() == "") return [];
    const result = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  /**
   * @param { {referrer: string} } request
   * @param {string=} [param]
   * @returns {Response}
   */
  function returnToReferer(request, param) {
    return Response.redirect(`${request.referrer}?${param}`);
  }

  async function authFetch(url, data, method = "POST") {
    console.log("Posting data", JSON.stringify(data), "to", url);
    const requestInit = {
      method: method,
      ...await authInit(data),
    };
    return fetch(url, requestInit);
  }
  async function authInit(data) {
    const result = {
      headers: {
        ...await createAuthHeader(),
      },
    };
    if (Object.keys(data).length != 0) {
      result["body"] = JSON.stringify(data);
      result.headers["Content-Type"] = "application/json";
    }
    return result;
  }

  async function createAuthHeader() {
    const tokens = await dataFromCache("tokens", cacheTypes.private);
    if (!tokens || !tokens["access"]) {
      return {};
    }
    const accesToken = tokens["access"]["token"];
    return { "Authorization": `Bearer ${accesToken}` };
  }

  function pathname(url) {
    return new URL(url).pathname;
  }

  /*                        *\
  | ### Response helpers ### |
  \*                        */
  const ResponseStatus = [
    "info",
    "ok",
    "redirect",
    "badRequest",
    "serverError",
  ];
  /**
   * @returns {'info'|'ok'|'redirect'|'badRequest'|'serverError'}
   */
  function status(request) {
    const status = request.status;
    // First number of the status
    const index = ("" + status).charAt(0);
    //@ts-ignore
    return ResponseStatus[index - 1];
  }
  //#endregion
})();
