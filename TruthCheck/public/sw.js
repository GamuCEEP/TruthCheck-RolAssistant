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
    handleRequest(ev),
  );
}

const authPath = "/api/auth";
const resourcePath = "/api/resources";
/**
 * @param { FetchEvent } ev
 */
async function handleRequest(ev) {
  const request = ev.request.clone();
  const pathName = new URL(request.url).pathname;
  //if its an auth call
  if (pathName.startsWith(authPath)) {
    return handleAuthenticationRequests(ev);
  }

  if (pathName.startsWith(resourcePath)) {
    return handleResourceRequests(ev);
  }

  //if its a page resource call
  if (request.method == "GET") {
    handleDefaultRequests(ev);
  }

  return updateRequest(ev);
}

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

  const authServices = {
    "/api/auth/login": login, // login
    "/api/auth/me": register, // register
    "/api/auth/refresh": "", // extend session
  };

  const form = await request.formData();

  console.log("Doing", pathname(request.url));

  return authServices[pathname(request.url)]();

  async function login() {
    const email = form.get("email");
    const password = form.get("password");
    const authResponse = await auth({ email, password }, "/api/auth/login");
    if(authResponse) return authResponse
    await saveLogin(login);
    return Response.redirect("/home");
  }
  async function register() {
    const email = form.get("email");
    const password = form.get("password");
    const name = form.get("name");
    await auth({ email, password, name }, "/api/auth/me");
    console.log("Login after registration");
    return await login();
  }

  async function auth(credentials, url) {
    console.log("Auth with", credentials);
    if (Object.entries(credentials).some((_, v) => v == null)) {
      console.log("Falta data");
      return Response.redirect(request.referrer + "?missingData");
    }
    const response = await getJson(url, credentials);
    if (response.status) { // only errors have status
      console.log("Response has status", response);
      return Response.redirect(`${request.referrer}?error`);
    }
  }
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
  console.log('Data to send:', json, JSON.stringify(json))
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
  return await (await fetch(await url, await createRequest(initData))).json();
}
function pathname(url) {
  return new URL(url).pathname;
}
