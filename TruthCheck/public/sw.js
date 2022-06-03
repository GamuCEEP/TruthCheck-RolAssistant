self.addEventListener("fetch", main);
self.onerror = (e) => {
  console.error("Error -->", e);
};

self.addEventListener("install", () => {
  console.log("Instalado");
});

self.addEventListener("activate", async () => {
  console.log("Activo");
  TCCache = await caches.open("TruthCheck");
});
/**@type {Cache} */
let TCCache;

async function main(ev) {
  ev.respondWith(
    requestManager(ev),
  );
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
  default: defaultHandler,
};

/**
 * @param { FetchEvent } ev
 */
async function requestManager(ev) {
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
    return fetch(request, {
      headers: {
        ...await createAuthHeader(),
      },
    });
  }
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
  if (authResponse.status != 200) {
    return authResponse;
  }
  await saveLogin(await authResponse.json());
  return Response.redirect("/home");
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
  if (authResponse.status >= 200 && authResponse.status < 300) {
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
      refreshToken: (await dataFromCache("tokens")).refresh.token,
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
}
/**
 * @param { Request } request
 * @returns { Promise<Response> }
 */
async function defaultHandler(request) {
  return fetch(request, {
    headers: {
      ...await createAuthHeader(),
    },
  });
}

/*
Helpers
*/
/**
 * @param { Request } request
 * @returns { Promise<Response> | null }
 */
async function authHelper(credentials, request, url) {
  if (Object.entries(credentials).some((e) => e[1] == "")) {
    console.log("Falta data");
    return returnToReferer(request, "missingData");
  }
  const response = await postJson(url, credentials);
  if (response.status != 200) { // only errors have status
    return returnToReferer(request.referrer, "error");
  }
  return response;
}

function returnToReferer(request, param) {
  return Response.redirect(`${request.referrer}?${param}`);
}

function postJson(url, data) {
  console.log("Posting data", data, "to", url);
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
/*






*/

const authPath = "/api/auth";
const resourcePath = "/api/resources";
/**
 * @param { FetchEvent } ev
 */
async function updateRequest(ev) {
  const request = ev.request.clone();

  return fetch(request.url);
}

async function handleDefaultRequests(ev) {
  return fetch(ev.request.url, {
    headers: {
      ...await createAuthHeader(),
    },
  });
}
/**
 * @param { FetchEvent } ev
 */
async function handleAuthenticationRequests(ev) {
  const request = ev.request.clone();
  console.log("Handled by AuthHandler");

  if (request.method != "POST") {
    console.log("Method distinct from POST");
    return handleDefaultRequests(request);
  }

  const form = await request.formData();

  console.log("Doing", pathname(request.url));

  return authServices[pathname(request.url)]();
}

async function handleResourceRequests(ev) {
}

async function saveLogin(response) {
  if (response.tokens && response.user) {
    dataToCache("tokens", response.tokens);
    dataToCache("user", response.user);
  }
}

/*#### Helper functions ####*/

function toLocalStorage(key, data) {
  try {
    globalThis.localStorage.setItem(key, data);
    return true;
  } catch {
    return false;
  }
}
function fromLocalStorage(key) {
  return globalThis.localStorage.getItem(key);
}
async function deleteCache(request) {
  if (!TCCache) return;
  await TCCache.delete(request);
}
async function fromCache(request) {
  if (!TCCache) return null;
  return await TCCache.match(request);
}
async function toCache(request) {
  if (!TCCache) return;
  await TCCache.add(request);
}
async function dataToCache(key, data) {
  if (!TCCache) return;
  await TCCache.put(key, new Response(JSON.stringify(data)));
}
async function dataFromCache(key) {
  if (!TCCache) return null;
  const entry = await TCCache.match(key);
  if (!entry) return null;
  try {
    return await entry.json();
  } catch {
    return await entry.text();
  }
}
async function createRequest(data) {
  const json = {};
  Object.entries(data).forEach((entry) => {
    json[entry[0]] = entry[1];
  });
  console.log("Data to send:", json, JSON.stringify(json));
  return {
    method: "POST",
    body: JSON.stringify(json),
    headers: {
      "Content-Type": "application/json",
      ...await createAuthHeader(),
    },
  };
}

async function createAuthHeader() {
  const tokens = await dataFromCache("tokens");
  if (!tokens || !tokens["access"]) {
    return {};
  }
  const accesToken = tokens["access"]["token"];
  return { "Authorization": `Bearer ${accesToken}` };
}

async function getJson(url, initData) {
  try {
    var request = await createRequest(initData);
    var response = await fetch(url, request);
    return await (response).json();
  } catch {
    return {
      error: `Response was not a json`,
      response,
      request,
      status: "not a json",
    };
  }
}
function pathname(url) {
  return new URL(url).pathname;
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
    // @ts-ignore
    handler = handler["default"];
    break;
  }
  return handler;
}
