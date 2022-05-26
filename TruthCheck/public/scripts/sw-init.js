(() => {
  if (!("serviceWorker" in navigator)) {
    console.log("Service workers are not supported");
    return;
  }
  const controller = navigator.serviceWorker.controller;
  if (controller) {
    console.log(`Page already controlled by ${controller.scriptURL}`);
    return;
  }
  globalThis.addEventListener("load", () => {
    registerSW("sw.js");
  });
})();

async function registerSW(src) {
  const registration = await navigator.serviceWorker.register(src);
  console.log("Registrado correctamente", registration.scope);
}
