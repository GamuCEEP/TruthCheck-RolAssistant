//Components
import "../components/componentLibrary.js";
//SW
import "./sw-init.js";

export const $ = (e) => document.querySelector(e);

export const url = $("meta[url]").attributes.item(0).value;
export const originalUrl = window.location.href;
window.history.replaceState({}, "", url);

/**
 * @param {string} selector
 * @param {ShadowRoot | HTMLElement} el
 * @returns
 */
export function querySelectorAllShadows(selector, el = document.body) {
  // recurse on childShadows
  const childShadows = Array.from(el.querySelectorAll("*"))
    .map((el) => el.shadowRoot).filter(Boolean);

  const childResults = childShadows.map((child) =>
    querySelectorAllShadows(selector, child)
  );

  // fuse all results into singular, flat array
  const result = Array.from(el.querySelectorAll(selector));
  return result.concat(childResults).flat();
}
