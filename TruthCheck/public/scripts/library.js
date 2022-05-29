//Components
import "../components/componentLibrary.js";
//SW
import "./sw-init.js";

export const $ = e => document.querySelector(e)


export const url = $('meta[url]').attributes.item(0).value
export const originalUrl = window.location.href
window.history.replaceState({},'', url)