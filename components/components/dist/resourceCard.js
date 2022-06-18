// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function convertDashToCamel(str) {
    return str.replace(/-([a-z0-9])/g, (g)=>g[1].toUpperCase()
    );
}
function convertCamelToDash(str) {
    return str.replace(/([a-zA-Z0-9])(?=[A-Z])/g, "$1-").toLowerCase();
}
function createTemplate(html1) {
    const template = document.createElement("template");
    template.innerHTML = html1;
    return template;
}
function stringify(input) {
    return typeof input === "string" ? input : typeof input === "number" ? input.toString() : "";
}
function isString(input) {
    return typeof input === "string";
}
function isNull(input) {
    return input === null;
}
function isTrue(input) {
    return input === true;
}
function isObject(obj) {
    return obj !== null && typeof obj === "object" && Array.isArray(obj) === false;
}
class ShadowError extends Error {
    constructor(message){
        super(message);
        this.message = message;
        this.name = this.constructor.name;
    }
}
class Shadow extends HTMLElement {
    _renderCounter = 0;
    _waitingList = new Set();
    _accessorsStore = new Map();
    _updateCustomEvent = new CustomEvent("_updated");
    _propertiesAndOptions;
    _dynamicCssStore = [];
    _isConnected = false;
    _isPaused = false;
    root;
    dom = {
        id: {},
        class: {}
    };
    initUrl = null;
    get _isReady() {
        return this._isConnected === true && this._isPaused === false && this._waitingList.size === 0;
    }
    constructor(options = {
        mode: "open"
    }){
        super();
        this.root = this.attachShadow(options);
        this._propertiesAndOptions = this.__propertiesAndOptions || [];
        if (this.firstUpdated) {
            this.addEventListener("_updated", this.firstUpdated, {
                once: true
            });
        }
        if (this.updated) {
            this.addEventListener("_updated", this.updated);
        }
    }
    connectedCallback() {
        this.init(this._propertiesAndOptions);
    }
    init(propertiesAndOptions) {
        propertiesAndOptions.push({
            property: "initUrl",
            render: false
        });
        propertiesAndOptions.forEach(this._makePropertyAccessible);
        this._isConnected = true;
        if (isTrue(this._isReady)) {
            this._actuallyRender();
        }
    }
    _makePropertyAccessible = ({ property: property1 , reflect =true , render =true , wait =false , assert =false  })=>{
        if (isTrue(wait)) {
            this._waitingList.add(property1);
        } else if (isTrue(assert) && !this[property1]) {
            throw new ShadowError(`The property ${property1} must have a truthy value.`);
        }
        this._accessorsStore.set(property1, this[property1]);
        if (isTrue(reflect)) {
            this._updateAttribute(property1, this[property1]);
        }
        Object.defineProperty(this, property1, {
            get: ()=>this._accessorsStore.get(property1)
            ,
            set: (value)=>{
                if (isTrue(assert) && !value) {
                    throw new ShadowError(`The property '${property1}' must have a truthy value.`);
                }
                this._accessorsStore.set(property1, value);
                if (isTrue(wait)) {
                    this._waitingList.delete(property1);
                }
                if (isTrue(reflect)) {
                    this._updateAttribute(property1, value);
                }
                if (isTrue(render) && isTrue(this._isReady)) {
                    this._actuallyRender();
                }
            }
        });
    };
    _updateAttribute(property2, value) {
        const attributeName = convertCamelToDash(property2);
        const attributeValue = this.getAttribute(attributeName);
        if (attributeValue !== value) {
            if (isNull(value)) return this.removeAttribute(attributeName);
            else {
                if (isString(value)) {
                    this.setAttribute(attributeName, value);
                } else {
                    const jsonValue = JSON.stringify(value);
                    if (jsonValue === undefined) {
                        throw new ShadowError(`Only JSON values can be reflected in attributes but received ` + `the value '${value}' for '${property2}'.`);
                    }
                    if (attributeValue !== jsonValue) {
                        this.setAttribute(attributeName, jsonValue);
                    }
                }
            }
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue === oldValue) {
            return undefined;
        } else if (name === "init-url" && isString(newValue)) {
            this._isPaused = true;
            this.update(name, newValue);
            this._fetchJsonAndUpdate(newValue).then(()=>{
                this._isPaused = false;
                if (isTrue(this._isReady)) {
                    this._actuallyRender();
                }
            });
        } else {
            return this.update(name, newValue);
        }
    }
    _fetchJsonAndUpdate(urlOrPath) {
        return fetch(new URL(urlOrPath, location.href).href).then((res)=>{
            if (isTrue(res.ok)) {
                return res.json().then((data)=>Object.entries(data).forEach(([property3, value])=>this[property3] = value
                    )
                );
            } else {
                throw new ShadowError(`Received status code ${res.status} instead of 200-299 range.`);
            }
        }).catch((err)=>{
            throw new ShadowError(err.message);
        });
    }
    update(name, value) {
        const property4 = convertDashToCamel(name);
        if (property4 in this) {
            if (this[property4] !== value && JSON.stringify(this[property4]) !== value) {
                try {
                    this[property4] = isNull(value) ? value : JSON.parse(value);
                } catch  {
                    this[property4] = value;
                }
            }
        } else {
            throw new ShadowError(`The property '${property4}' does not exist on '${this.constructor.name}'.`);
        }
    }
    addCss(ruleSet, render = false) {
        this._dynamicCssStore.push(createTemplate(`<style>${ruleSet}</style>`));
        if (isTrue(render) && isTrue(this._isReady)) this._actuallyRender();
    }
    _createFragment(...inputArray) {
        const documentFragment = document.createDocumentFragment();
        inputArray.flat(2).forEach((input)=>{
            if (isObject(input) && input.element instanceof Element) {
                const { element , collection  } = input;
                documentFragment.appendChild(element);
                collection.forEach(({ target , queries , eventsAndListeners  })=>{
                    queries.forEach(({ kind , selector  })=>kind === "id" ? this.dom.id[selector] = target : this.dom.class[selector] ? this.dom.class[selector].push(target) : this.dom.class[selector] = [
                            target
                        ]
                    );
                    eventsAndListeners.forEach(({ event , listener  })=>target.addEventListener(event, listener.bind(this))
                    );
                });
            } else if (isString(input)) {
                documentFragment.appendChild(createTemplate(input).content.cloneNode(true));
            } else {
                documentFragment.appendChild(document.createTextNode(stringify(input)));
            }
        });
        return documentFragment;
    }
    _actuallyRender() {
        if (this._renderCounter > 0) {
            this.dom.id = {};
            this.dom.class = {};
        }
        while(this.root.firstChild){
            this.root.removeChild(this.root.firstChild);
        }
        this.constructor.styles.forEach((template)=>this.root.append(template.content.cloneNode(true))
        );
        const fragment = this._createFragment(this.render());
        if (this._dynamicCssStore.length > 0) {
            this._dynamicCssStore.forEach((styleTemplate)=>this.root.append(styleTemplate.content.cloneNode(true))
            );
        }
        this.root.prepend(fragment);
        this.dispatchEvent(this._updateCustomEvent);
        this._renderCounter++;
    }
    render() {
        return "";
    }
    static styles = [];
    static is;
}
function __default(n1) {
    for(var l, e, s = arguments, t = 1, r = "", u = "", a = [
        0
    ], c = function(n) {
        1 === t && (n || (r = r.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? a.push(n ? s[n] : r) : 3 === t && (n || r) ? (a[1] = n ? s[n] : r, t = 2) : 2 === t && "..." === r && n ? a[2] = Object.assign(a[2] || {}, s[n]) : 2 === t && r && !n ? (a[2] = a[2] || {})[r] = !0 : t >= 5 && (5 === t ? ((a[2] = a[2] || {})[e] = n ? r ? r + s[n] : s[n] : r, t = 6) : (n || r) && (a[2][e] += n ? r + s[n] : r)), r = "";
    }, h1 = 0; h1 < n1.length; h1++){
        h1 && (1 === t && c(), c(h1));
        for(var i = 0; i < n1[h1].length; i++)l = n1[h1][i], 1 === t ? "<" === l ? (c(), a = [
            a,
            "",
            null
        ], t = 3) : r += l : 4 === t ? "--" === r && ">" === l ? (t = 1, r = "") : r = l + r[0] : u ? l === u ? u = "" : r += l : '"' === l || "'" === l ? u = l : ">" === l ? (c(), t = 1) : t && ("=" === l ? (t = 5, e = r, r = "") : "/" === l && (t < 5 || ">" === n1[h1][i + 1]) ? (c(), 3 === t && (a = a[0]), t = a, (a = a[0]).push(this.apply(null, t.slice(1))), t = 0) : " " === l || "\t" === l || "\n" === l || "\r" === l ? (c(), t = 2) : r += l), 3 === t && "!--" === r && (t = 4, a = a[0]);
    }
    return c(), a.length > 2 ? a.slice(1) : a[1];
}
const SVG_NS = "http://www.w3.org/2000/svg";
function isArrayOfListeners(input) {
    return input.every((i)=>typeof i === "function"
    );
}
function isSpecialKey(input) {
    return input === "id" || input === "class";
}
function isHReturn(input) {
    return isObject(input) && input.element instanceof Element;
}
function h(type, props, ...children) {
    const eventsAndListeners = [];
    const queries = [];
    const collection = [];
    const element = type === "svg" ? document.createElementNS(SVG_NS, "svg") : document.createElement(type);
    for(const key in props){
        if (typeof props[key] === "function") {
            eventsAndListeners.push({
                event: key,
                listener: props[key]
            });
        } else if (Array.isArray(props[key]) && isArrayOfListeners(props[key])) {
            props[key].forEach((listener)=>eventsAndListeners.push({
                    event: key,
                    listener
                })
            );
        } else if (key[0] === "@") {
            const idOrClass = key.slice(1);
            if (isSpecialKey(idOrClass)) {
                queries.push({
                    kind: idOrClass,
                    selector: props[key].replace(/ .*/, "")
                });
                element.setAttribute(idOrClass, props[key]);
            }
        } else if (props[key] === true) {
            element.setAttribute(key, "");
        } else if (typeof props[key] === "object" && props[key] !== null) {
            element.setAttribute(key, JSON.stringify(props[key]));
        } else if (typeof props[key] === "string") {
            element.setAttribute(key, props[key]);
        } else if (props[key] === null || props[key] === false || props[key] === undefined) {
            element.removeAttribute(key);
        }
    }
    if (type === "svg") {
        element.innerHTML = children.flat(2).reduce((acc, child)=>{
            return acc + (isHReturn(child) ? child.element.outerHTML : stringify(child));
        }, "");
    } else {
        for (const child of children.flat(2)){
            if (isHReturn(child)) {
                collection.push(...child.collection);
                element.appendChild(child.element);
            } else {
                const str = stringify(child);
                if (str) element.appendChild(document.createTextNode(str));
            }
        }
    }
    if (queries.length || eventsAndListeners.length) {
        collection.push({
            target: element,
            queries,
            eventsAndListeners
        });
    }
    return {
        element,
        collection
    };
}
const html = __default.bind(h);
function css(strings, ...values) {
    const cssTemplates = [];
    cssTemplates.push(createTemplate(`<style>${values.reduce((acc, value, i)=>{
        if (value instanceof HTMLTemplateElement) {
            cssTemplates.push(value);
            return acc + strings[i + 1];
        } else if (Array.isArray(value)) {
            value.forEach((el)=>cssTemplates.push(el)
            );
            return acc + strings[i + 1];
        } else {
            return acc + value + strings[i + 1];
        }
    }, strings[0])}</style>`));
    return cssTemplates;
}
function customElement(tagName) {
    return (clazz)=>{
        Object.defineProperty(clazz, "is", {
            value: tagName
        });
        window.customElements.define(tagName, clazz);
        return clazz;
    };
}
function property({ reflect =true , render =true , wait =false , assert =false  } = {}) {
    return (protoOrDescriptor, name)=>{
        if (protoOrDescriptor.constructor.observedAttributes === undefined) {
            protoOrDescriptor.constructor.observedAttributes = [];
        }
        if (reflect === true) {
            protoOrDescriptor.constructor.observedAttributes.push(convertCamelToDash(name));
        }
        if (protoOrDescriptor.__propertiesAndOptions === undefined) {
            Object.defineProperty(protoOrDescriptor, "__propertiesAndOptions", {
                enumerable: false,
                configurable: true,
                writable: false,
                value: []
            });
        }
        protoOrDescriptor.__propertiesAndOptions.push({
            property: name,
            reflect,
            render,
            wait,
            assert
        });
    };
}
function _applyDecoratedDescriptor(target, property5, decorators, descriptor, context) {
    var desc1 = {};
    Object.keys(descriptor).forEach(function(key) {
        desc1[key] = descriptor[key];
    });
    desc1.enumerable = !!desc1.enumerable;
    desc1.configurable = !!desc1.configurable;
    if ('value' in desc1 || desc1.initializer) {
        desc1.writable = true;
    }
    desc1 = decorators.slice().reverse().reduce(function(desc, decorator) {
        return decorator ? decorator(target, property5, desc) || desc : desc;
    }, desc1);
    var hasAccessor = Object.prototype.hasOwnProperty.call(desc1, 'get') || Object.prototype.hasOwnProperty.call(desc1, 'set');
    if (context && desc1.initializer !== void 0 && !hasAccessor) {
        desc1.value = desc1.initializer ? desc1.initializer.call(context) : void 0;
        desc1.initializer = undefined;
    }
    if (hasAccessor) {
        delete desc1.writable;
        delete desc1.initializer;
        delete desc1.value;
    }
    if (desc1.initializer === void 0) {
        Object.defineProperty(target, property5, desc1);
        desc1 = null;
    }
    return desc1;
}
function _initializerDefineProperty(target, property6, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property6, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}
var _class, _descriptor, _dec, _descriptor1, _dec1, _descriptor2, _dec2, _descriptor3, _dec3, _descriptor4, _dec4, _descriptor5, _dec5;
var _dec6 = customElement("g-resource");
let ResourceCard = _class = _dec6(((_class = class ResourceCard extends Shadow {
    resource = null;
    schema = null;
    editor = null;
    actionMap = {
        show: null,
        create: "Create",
        edit: "Save"
    };
    oneditorready = null;
    static styles = css`
    h3{
      margin: 10px 0 0 10px !important;
    } 
    div.je-tabholder--top{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      margin: 0;
    }
    div.je-tab--top{
      border-radius: 0;
      flex-grow: 100;
      border-bottom: 1px solid white;
    }
    div[style*="1"]{
      background-color: var(--main-color) !important;
    }
    button{
      border: none;
      color: white;
      background-color: var(--detail-color) !important;
      padding: 5px 15px !important;
      border-radius: 3px;
    }
    button:disabled{
      filter: grayscale();
      cursor: not-allowed;
    }
     textarea{
      height: 100px !important;
      resize: none;
    }
    h3{
      margin:0;
    }
    .je-object__controls{
      display: block;
      margin: 0 !important;
      height: 0 !important;
    }
    .je-indented-panel{
      border: none !important;
    }
    *:disabled{
      background-color: var(--light-color);
      color: black;
      border: initial;
    }
    #card{
      position: relative;
    }
    #card > button{
      position: absolute;
      right: 5px;
      bottom: 5px;
    }
  `;
    async loadSchema() {
        const schemaUrl = origin + "/models/" + this.model + ".json";
        this.schema = await this.getResources(schemaUrl);
    }
    async populateResources(target) {
        if (!target) return;
        let text = JSON.stringify(target);
        const resoruceRgx = /"?#(\w+)"?/g;
        const nameRgx = /"?\$(\w+)"?/g;
        const resourceLists = {};
        for (const match of text.matchAll(resoruceRgx)){
            const rawlist = resourceLists[match[1]] ?? await this.getResources(`${this.href}${match[1]}s`);
            const list = rawlist.map((e)=>eval(this.filter)(e, match[1])
            );
            resourceLists[match[1]] = list;
            text = text.replace(/"(#.+?)"/g, `[$1]`);
            const listToAdd = JSON.stringify(list).replace(/^\[(.*?)\]$/g, "$1");
            text = text.replace("#" + match[1], listToAdd);
            text = text.replace(/}{/g, "},{");
        }
        for (const match1 of text.matchAll(nameRgx)){
            const nameList = resourceLists[match1[1]].map((r)=>r?.name
            );
            text = text.replace(/"(\$[a-zA-Z\$]+?)"/g, `[$1]`);
            const listToAdd = JSON.stringify(nameList).replace(/^\[(.*?)\]$/g, "$1");
            text = text.replace("$" + match1[1], listToAdd);
            text = text.replace(/""/g, '","');
        }
        return JSON.parse(text);
    }
    async loadResource() {
        if (!this.resourceId) return;
        let resourceUrl = `${origin}${this.href}${this.model}s/${this.resourceId}`;
        if (this.resourceId == "me") {
            resourceUrl = `${origin}${this.href}`;
        }
        this.resource = await this.getResources(resourceUrl);
    }
    async reflectAction() {
        this.oneditorready = ()=>this.editor.enable()
        ;
        switch(this.action){
            case "create":
                break;
            case "show":
                await this.generateResource();
                this.oneditorready = ()=>this.editor.disable()
                ;
                break;
            case "edit":
                await this.generateResource();
                break;
            default:
                console.warn("Action", this.action, "not supported");
                break;
        }
    }
    async generateResource() {
        await this.loadResource();
        this.resource = await this.formatResource(this.resource);
    }
    async updated() {
        await this.loadSchema();
        this.schema = await this.populateResources(this.schema);
        await this.reflectAction();
        const options = {
            schema: this.schema
        };
        if (this.resource) {
            options["startval"] = JSON.parse(JSON.stringify(this.resource));
        }
        this.editor = new window["JSONEditor"](this.shadowRoot.querySelector("#card"), options);
        if (this.oneditorready) {
            this.editor.on("ready", this.oneditorready);
        }
        if (this.actionMap[this.action]) {
            const button = document.createElement("button");
            button.innerHTML = this.actionMap[this.action];
            this.dom.id["card"].appendChild(button);
            if (this.onsend) {
                button.addEventListener("click", ()=>{
                    eval(this.onsend)(this.editor.getValue());
                });
            }
        }
    }
    render() {
        return html`
      ${'<link rel="stylesheet" href="/styles/card.css">'}
      <div @id="card"></div>
    `;
    }
    async getResources(url) {
        try {
            var response = await fetch(url);
            if (response.status >= 200 && response.status < 300) {
                const resource = await response.json();
                return resource;
            }
            console.warn("Resource is not a valid json", url);
        } catch  {
            console.warn("Resource could not load", {
                url
            }, response);
        }
        return [];
    }
    async formatResource(resource) {
        if (!resource) {
            return;
        }
        if (resource?.actors) {
            const newActors = [];
            for (const id of resource["actors"]){
                const url = `${this.href}actors/${id.referencedResource}`;
                let data = await this.getResources(url);
                data = eval(this.filter)(data, this.model);
                newActors.push(data);
            }
            resource["players"] = newActors;
            for (const stage of resource["stages"]){
                const url = `${this.href}stages/${stage.stage.referencedResource ?? stage.stage}`;
                let data = await this.getResources(url);
                data = eval(this.filter)(data, this.model);
                stage.stage = data;
            }
            for (const stage1 of resource["stages"]){
                for (const deck of stage1["deck"]){
                    const url = `${this.href}${deck.resource.referencedCollection}/${deck.resource.referencedResource}`;
                    let data = await this.getResources(url);
                    data = eval(this.filter)(data, this.model);
                    deck.resource = data;
                }
            }
            delete resource.actors;
            delete resource._id;
            delete resource.id;
            delete resource.author;
            delete resource.docVersion;
            delete resource.isShared;
            delete resource.createdAt;
            return resource;
        }
        return this.cleanResource(resource);
    }
    async cleanResource(resource) {
        for (const prop of [
            "pasive",
            "active",
            "inventory",
            "equipment"
        ]){
            if (!resource[prop]) continue;
            let resourceType;
            if ([
                "pasive",
                "active"
            ].includes(prop)) {
                resourceType = "effects";
            }
            if ([
                "inventory",
                "equipment"
            ].includes(prop)) {
                resourceType = "items";
            }
            const newProp = [];
            for (const id of resource[prop]){
                const url = `${this.href}${resourceType}/${id.referencedResource}`;
                let data = await this.getResources(url);
                data = eval(this.filter)(data);
                newProp.push(data);
            }
            resource[prop] = newProp;
        }
        if (resource.code) {
            resource.code = {
                code: resource.code
            };
        }
        if (resource.tags) {
            resource.tags = resource.tags.map((tag)=>tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
            );
        }
        if (resource.stats) {
            const stats = [];
            for(const key in resource.stats){
                stats.push({
                    key: key,
                    value: resource.stats[key]
                });
            }
            resource.stats = stats;
        }
        delete resource.id;
        delete resource._id;
        delete resource.author;
        delete resource.imageURI;
        delete resource.createdAt;
        delete resource.isShared;
        delete resource.docVersion;
        delete resource.isDisabled;
        delete resource.updatedAt;
        delete resource.likedResources;
        return resource;
    }
    constructor(...args){
        super(...args);
        _initializerDefineProperty(this, "model", _descriptor, this);
        _initializerDefineProperty(this, "resourceId", _descriptor1, this);
        _initializerDefineProperty(this, "action", _descriptor2, this);
        _initializerDefineProperty(this, "onsend", _descriptor3, this);
        _initializerDefineProperty(this, "href", _descriptor4, this);
        _initializerDefineProperty(this, "filter", _descriptor5, this);
    }
}) || _class, _dec = property(), _dec1 = property(), _dec2 = property(), _dec3 = property(), _dec4 = property(), _dec5 = property(), _descriptor = _applyDecoratedDescriptor(_class.prototype, "model", [
    _dec
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return "";
    }
}), _descriptor1 = _applyDecoratedDescriptor(_class.prototype, "resourceId", [
    _dec1
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return null;
    }
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "action", [
    _dec2
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return null;
    }
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "onsend", [
    _dec3
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return null;
    }
}), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "href", [
    _dec4
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return "/api/resources/";
    }
}), _descriptor5 = _applyDecoratedDescriptor(_class.prototype, "filter", [
    _dec5
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return "e=>e";
    }
}), _class)) || _class;
export { ResourceCard as ResourceCard };
