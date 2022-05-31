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

const authPaths = [
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/me",
];

/**
 * @param { FetchEvent } ev
 */
async function handleRequest(ev) {
  if (ev.request.method == "GET") {
    return fetch(ev.request.url, {
      headers: {
        ...await createAuthHeader(),
      },
    });
  }

  const pathName = new URL(ev.request.url).pathname;
  if (authPaths.includes(pathName)) {
    console.info("Authentication");
    return auth(ev);
  }

  return updateRequest(ev);
}

/**
 * @param { FetchEvent } ev
 */
async function updateRequest(ev) {
  const request = ev.request;

  return fetch(ev.request.url);
}

async function auth(ev) {
  const request = ev.request;
  const form = await request.formData();

  if (form) {
    const response = await (await fetch(request.url, await form2Request(form)))
      .json();
    if (response.status) {
      const origin = new URL(request.url).origin;
      return Response.redirect("/login?error");
    }

    const loginData = {
      method: "POST",
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const user = await (await fetch("/api/auth/login", loginData)).json();
    console.log("Logueando despues del registro", user, loginData);

    if (user.tokens && user.user) {
      dataToCache("tokens", user.tokens);
      dataToCache("user", user.user);
      return Response.redirect("/home");
    }
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

async function form2Request(formData) {
  const json = {};
  formData.forEach((val, key) => {
    json[key] = val;
  });
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
