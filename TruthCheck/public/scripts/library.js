//Components
import "../components/componentLibrary.js";
//SW
import "./sw-init.js";

export const $ = (e) => document.querySelector(e);

const url = $("meta[url]").attributes.item(0).value;
const originalUrl = window.location.href;
window.history.replaceState({}, "", url);