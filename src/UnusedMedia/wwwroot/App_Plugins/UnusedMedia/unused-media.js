var it = Object.defineProperty;
var rt = (s, e, t) => e in s ? it(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var Ae = (s, e, t) => rt(s, typeof e != "symbol" ? e + "" : e, t);
import { UMB_AUTH_CONTEXT as nt } from "@umbraco-cms/backoffice/auth";
import { UmbLitElement as je } from "@umbraco-cms/backoffice/lit-element";
import { UMB_NOTIFICATION_CONTEXT as De } from "@umbraco-cms/backoffice/notification";
import { UMB_ACTION_EVENT_CONTEXT as X } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadChildrenOfEntityEvent as F } from "@umbraco-cms/backoffice/entity-action";
const at = [
  {
    name: "Unused Media Entrypoint",
    alias: "UnusedMedia.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => Promise.resolve().then(() => wt)
  }
], ot = [
  {
    name: "Unused Media Dashboard",
    alias: "UnusedMedia.Dashboard",
    type: "dashboard",
    js: () => Promise.resolve().then(() => Ft),
    meta: {
      label: "Unused Media",
      pathname: "unused-media"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Media"
      }
    ]
  }
], lt = [
  {
    name: "Recycle bin dashboard",
    alias: "EnhancedRecycleBin.Dashboard",
    type: "dashboard",
    js: () => Promise.resolve().then(() => ts),
    meta: {
      label: "Enhanced Recycle Bin",
      pathname: "enhanced-recycle-bin"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Media"
      }
    ]
  }
], ls = [
  ...at,
  ...ot,
  ...lt
];
var ht = /\{[^{}]+\}/g, ee = ({ allowReserved: s, name: e, value: t }) => {
  if (t == null) return "";
  if (typeof t == "object") throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");
  return `${e}=${s ? t : encodeURIComponent(t)}`;
}, ct = (s) => {
  switch (s) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, dt = (s) => {
  switch (s) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
}, ut = (s) => {
  switch (s) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, Ne = ({ allowReserved: s, explode: e, name: t, style: i, value: r }) => {
  if (!e) {
    let o = (s ? r : r.map((l) => encodeURIComponent(l))).join(dt(i));
    switch (i) {
      case "label":
        return `.${o}`;
      case "matrix":
        return `;${t}=${o}`;
      case "simple":
        return o;
      default:
        return `${t}=${o}`;
    }
  }
  let a = ct(i), n = r.map((o) => i === "label" || i === "simple" ? s ? o : encodeURIComponent(o) : ee({ allowReserved: s, name: t, value: o })).join(a);
  return i === "label" || i === "matrix" ? a + n : n;
}, He = ({ allowReserved: s, explode: e, name: t, style: i, value: r }) => {
  if (r instanceof Date) return `${t}=${r.toISOString()}`;
  if (i !== "deepObject" && !e) {
    let o = [];
    Object.entries(r).forEach(([h, c]) => {
      o = [...o, h, s ? c : encodeURIComponent(c)];
    });
    let l = o.join(",");
    switch (i) {
      case "form":
        return `${t}=${l}`;
      case "label":
        return `.${l}`;
      case "matrix":
        return `;${t}=${l}`;
      default:
        return l;
    }
  }
  let a = ut(i), n = Object.entries(r).map(([o, l]) => ee({ allowReserved: s, name: i === "deepObject" ? `${t}[${o}]` : o, value: l })).join(a);
  return i === "label" || i === "matrix" ? a + n : n;
}, pt = ({ path: s, url: e }) => {
  let t = e, i = e.match(ht);
  if (i) for (let r of i) {
    let a = !1, n = r.substring(1, r.length - 1), o = "simple";
    n.endsWith("*") && (a = !0, n = n.substring(0, n.length - 1)), n.startsWith(".") ? (n = n.substring(1), o = "label") : n.startsWith(";") && (n = n.substring(1), o = "matrix");
    let l = s[n];
    if (l == null) continue;
    if (Array.isArray(l)) {
      t = t.replace(r, Ne({ explode: a, name: n, style: o, value: l }));
      continue;
    }
    if (typeof l == "object") {
      t = t.replace(r, He({ explode: a, name: n, style: o, value: l }));
      continue;
    }
    if (o === "matrix") {
      t = t.replace(r, `;${ee({ name: n, value: l })}`);
      continue;
    }
    let h = encodeURIComponent(o === "label" ? `.${l}` : l);
    t = t.replace(r, h);
  }
  return t;
}, Ie = ({ allowReserved: s, array: e, object: t } = {}) => (i) => {
  let r = [];
  if (i && typeof i == "object") for (let a in i) {
    let n = i[a];
    if (n != null) {
      if (Array.isArray(n)) {
        r = [...r, Ne({ allowReserved: s, explode: !0, name: a, style: "form", value: n, ...e })];
        continue;
      }
      if (typeof n == "object") {
        r = [...r, He({ allowReserved: s, explode: !0, name: a, style: "deepObject", value: n, ...t })];
        continue;
      }
      r = [...r, ee({ allowReserved: s, name: a, value: n })];
    }
  }
  return r.join("&");
}, ft = (s) => {
  if (!s) return;
  let e = s.split(";")[0].trim();
  if (e.startsWith("application/json") || e.endsWith("+json")) return "json";
  if (e === "multipart/form-data") return "formData";
  if (["application/", "audio/", "image/", "video/"].some((t) => e.startsWith(t))) return "blob";
  if (e.startsWith("text/")) return "text";
}, mt = ({ baseUrl: s, path: e, query: t, querySerializer: i, url: r }) => {
  let a = r.startsWith("/") ? r : `/${r}`, n = s + a;
  e && (n = pt({ path: e, url: n }));
  let o = t ? i(t) : "";
  return o.startsWith("?") && (o = o.substring(1)), o && (n += `?${o}`), n;
}, we = (s, e) => {
  var i;
  let t = { ...s, ...e };
  return (i = t.baseUrl) != null && i.endsWith("/") && (t.baseUrl = t.baseUrl.substring(0, t.baseUrl.length - 1)), t.headers = ze(s.headers, e.headers), t;
}, ze = (...s) => {
  let e = new Headers();
  for (let t of s) {
    if (!t || typeof t != "object") continue;
    let i = t instanceof Headers ? t.entries() : Object.entries(t);
    for (let [r, a] of i) if (a === null) e.delete(r);
    else if (Array.isArray(a)) for (let n of a) e.append(r, n);
    else a !== void 0 && e.set(r, typeof a == "object" ? JSON.stringify(a) : a);
  }
  return e;
}, ne = class {
  constructor() {
    Ae(this, "_fns");
    this._fns = [];
  }
  clear() {
    this._fns = [];
  }
  exists(e) {
    return this._fns.indexOf(e) !== -1;
  }
  eject(e) {
    let t = this._fns.indexOf(e);
    t !== -1 && (this._fns = [...this._fns.slice(0, t), ...this._fns.slice(t + 1)]);
  }
  use(e) {
    this._fns = [...this._fns, e];
  }
}, _t = () => ({ error: new ne(), request: new ne(), response: new ne() }), $t = { bodySerializer: (s) => JSON.stringify(s) }, yt = Ie({ allowReserved: !1, array: { explode: !0, style: "form" }, object: { explode: !0, style: "deepObject" } }), gt = { "Content-Type": "application/json" }, qe = (s = {}) => ({ ...$t, baseUrl: "", fetch: globalThis.fetch, headers: gt, parseAs: "auto", querySerializer: yt, ...s }), bt = (s = {}) => {
  let e = we(qe(), s), t = () => ({ ...e }), i = (n) => (e = we(e, n), t()), r = _t(), a = async (n) => {
    let o = { ...e, ...n, headers: ze(e.headers, n.headers) };
    o.body && o.bodySerializer && (o.body = o.bodySerializer(o.body)), o.body || o.headers.delete("Content-Type");
    let l = mt({ baseUrl: o.baseUrl ?? "", path: o.path, query: o.query, querySerializer: typeof o.querySerializer == "function" ? o.querySerializer : Ie(o.querySerializer), url: o.url }), h = { redirect: "follow", ...o }, c = new Request(l, h);
    for (let y of r.request._fns) c = await y(c, o);
    let d = o.fetch, u = await d(c);
    for (let y of r.response._fns) u = await y(u, c, o);
    let f = { request: c, response: u };
    if (u.ok) {
      if (u.status === 204 || u.headers.get("Content-Length") === "0") return { data: {}, ...f };
      if (o.parseAs === "stream") return { data: u.body, ...f };
      let y = (o.parseAs === "auto" ? ft(u.headers.get("Content-Type")) : o.parseAs) ?? "json", re = await u[y]();
      return y === "json" && o.responseTransformer && (re = await o.responseTransformer(re)), { data: re, ...f };
    }
    let m = await u.text();
    try {
      m = JSON.parse(m);
    } catch {
    }
    let j = m;
    for (let y of r.error._fns) j = await y(m, u, c, o);
    if (j = j || {}, o.throwOnError) throw j;
    return { error: j, ...f };
  };
  return { connect: (n) => a({ ...n, method: "CONNECT" }), delete: (n) => a({ ...n, method: "DELETE" }), get: (n) => a({ ...n, method: "GET" }), getConfig: t, head: (n) => a({ ...n, method: "HEAD" }), interceptors: r, options: (n) => a({ ...n, method: "OPTIONS" }), patch: (n) => a({ ...n, method: "PATCH" }), post: (n) => a({ ...n, method: "POST" }), put: (n) => a({ ...n, method: "PUT" }), request: a, setConfig: i, trace: (n) => a({ ...n, method: "TRACE" }) };
};
const O = bt(qe());
class P {
  static unusedMedia(e) {
    return ((e == null ? void 0 : e.client) ?? O).get({
      ...e,
      url: "/umbraco/unusedmedia/api/v1/all"
    });
  }
  static delete(e) {
    return ((e == null ? void 0 : e.client) ?? O).post({
      ...e,
      url: "/umbraco/unusedmedia/api/v1/delete"
    });
  }
  static recycleBinMedia(e) {
    return ((e == null ? void 0 : e.client) ?? O).get({
      ...e,
      url: "/umbraco/unusedmedia/api/v1/get-recycle-bin"
    });
  }
  static restoreAll(e) {
    return ((e == null ? void 0 : e.client) ?? O).put({
      ...e,
      url: "/umbraco/unusedmedia/api/v1/restore"
    });
  }
}
const vt = (s, e) => {
  s.consumeContext(nt, async (t) => {
    if (!t) return;
    const i = t.getOpenApiConfiguration();
    O.setConfig({
      baseUrl: i.base,
      credentials: i.credentials
    }), O.interceptors.request.use(async (r, a) => {
      const n = await i.token();
      return r.headers.set("Authorization", `Bearer ${n}`), r;
    });
  });
}, At = (s, e) => {
  console.log("Goodbye from my extension 👋");
}, wt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  onInit: vt,
  onUnload: At
}, Symbol.toStringTag, { value: "Module" }));
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = globalThis, _e = J.ShadowRoot && (J.ShadyCSS === void 0 || J.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, $e = Symbol(), Ee = /* @__PURE__ */ new WeakMap();
let Be = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== $e) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (_e && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = Ee.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Ee.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Et = (s) => new Be(typeof s == "string" ? s : s + "", void 0, $e), We = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((i, r, a) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[a + 1], s[0]);
  return new Be(t, s, $e);
}, St = (s, e) => {
  if (_e) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), r = J.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = t.cssText, s.appendChild(i);
  }
}, Se = _e ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return Et(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: xt, defineProperty: Ct, getOwnPropertyDescriptor: Ut, getOwnPropertyNames: Mt, getOwnPropertySymbols: Ot, getPrototypeOf: Pt } = Object, A = globalThis, xe = A.trustedTypes, Tt = xe ? xe.emptyScript : "", ae = A.reactiveElementPolyfillSupport, I = (s, e) => s, K = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? Tt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
  let t = s;
  switch (e) {
    case Boolean:
      t = s !== null;
      break;
    case Number:
      t = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(s);
      } catch {
        t = null;
      }
  }
  return t;
} }, ye = (s, e) => !xt(s, e), Ce = { attribute: !0, type: String, converter: K, reflect: !1, useDefault: !1, hasChanged: ye };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), A.litPropertyMetadata ?? (A.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let M = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ce) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(e, i, t);
      r !== void 0 && Ct(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: r, set: a } = Ut(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: r, set(n) {
      const o = r == null ? void 0 : r.call(this);
      a == null || a.call(this, n), this.requestUpdate(e, o, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ce;
  }
  static _$Ei() {
    if (this.hasOwnProperty(I("elementProperties"))) return;
    const e = Pt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(I("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(I("properties"))) {
      const t = this.properties, i = [...Mt(t), ...Ot(t)];
      for (const r of i) this.createProperty(r, t[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, r] of t) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const r = this._$Eu(t, i);
      r !== void 0 && this._$Eh.set(r, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const r of i) t.unshift(Se(r));
    } else e !== void 0 && t.push(Se(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return St(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostConnected) == null ? void 0 : i.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostDisconnected) == null ? void 0 : i.call(t);
    });
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    var a;
    const i = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, i);
    if (r !== void 0 && i.reflect === !0) {
      const n = (((a = i.converter) == null ? void 0 : a.toAttribute) !== void 0 ? i.converter : K).toAttribute(t, i.type);
      this._$Em = e, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var a, n;
    const i = this.constructor, r = i._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const o = i.getPropertyOptions(r), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((a = o.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? o.converter : K;
      this._$Em = r;
      const h = l.fromAttribute(t, o.type);
      this[r] = h ?? ((n = this._$Ej) == null ? void 0 : n.get(r)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(e, t, i) {
    var r;
    if (e !== void 0) {
      const a = this.constructor, n = this[e];
      if (i ?? (i = a.getPropertyOptions(e)), !((i.hasChanged ?? ye)(n, t) || i.useDefault && i.reflect && n === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(a._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: r, wrapped: a }, n) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), a !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [a, n] of this._$Ep) this[a] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [a, n] of r) {
        const { wrapped: o } = n, l = this[a];
        o !== !0 || this._$AL.has(a) || l === void 0 || this.C(a, void 0, n, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (i = this._$EO) == null || i.forEach((r) => {
        var a;
        return (a = r.hostUpdate) == null ? void 0 : a.call(r);
      }), this.update(t)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var r;
      return (r = i.hostUpdated) == null ? void 0 : r.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
M.elementStyles = [], M.shadowRootOptions = { mode: "open" }, M[I("elementProperties")] = /* @__PURE__ */ new Map(), M[I("finalized")] = /* @__PURE__ */ new Map(), ae == null || ae({ ReactiveElement: M }), (A.reactiveElementVersions ?? (A.reactiveElementVersions = [])).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, Z = z.trustedTypes, Ue = Z ? Z.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Le = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, Qe = "?" + v, Rt = `<${Qe}>`, U = document, q = () => U.createComment(""), B = (s) => s === null || typeof s != "object" && typeof s != "function", ge = Array.isArray, kt = (s) => ge(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", oe = `[ 	
\f\r]`, D = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Me = /-->/g, Oe = />/g, S = RegExp(`>|${oe}(?:([^\\s"'>=/]+)(${oe}*=${oe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Pe = /'/g, Te = /"/g, Ve = /^(?:script|style|textarea|title)$/i, jt = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), Y = jt(1), T = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), Re = /* @__PURE__ */ new WeakMap(), x = U.createTreeWalker(U, 129);
function Je(s, e) {
  if (!ge(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ue !== void 0 ? Ue.createHTML(e) : e;
}
const Dt = (s, e) => {
  const t = s.length - 1, i = [];
  let r, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = D;
  for (let o = 0; o < t; o++) {
    const l = s[o];
    let h, c, d = -1, u = 0;
    for (; u < l.length && (n.lastIndex = u, c = n.exec(l), c !== null); ) u = n.lastIndex, n === D ? c[1] === "!--" ? n = Me : c[1] !== void 0 ? n = Oe : c[2] !== void 0 ? (Ve.test(c[2]) && (r = RegExp("</" + c[2], "g")), n = S) : c[3] !== void 0 && (n = S) : n === S ? c[0] === ">" ? (n = r ?? D, d = -1) : c[1] === void 0 ? d = -2 : (d = n.lastIndex - c[2].length, h = c[1], n = c[3] === void 0 ? S : c[3] === '"' ? Te : Pe) : n === Te || n === Pe ? n = S : n === Me || n === Oe ? n = D : (n = S, r = void 0);
    const f = n === S && s[o + 1].startsWith("/>") ? " " : "";
    a += n === D ? l + Rt : d >= 0 ? (i.push(h), l.slice(0, d) + Le + l.slice(d) + v + f) : l + v + (d === -2 ? o : f);
  }
  return [Je(s, a + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class W {
  constructor({ strings: e, _$litType$: t }, i) {
    let r;
    this.parts = [];
    let a = 0, n = 0;
    const o = e.length - 1, l = this.parts, [h, c] = Dt(e, t);
    if (this.el = W.createElement(h, i), x.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = x.nextNode()) !== null && l.length < o; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(Le)) {
          const u = c[n++], f = r.getAttribute(d).split(v), m = /([.?@])?(.*)/.exec(u);
          l.push({ type: 1, index: a, name: m[2], strings: f, ctor: m[1] === "." ? Ht : m[1] === "?" ? It : m[1] === "@" ? zt : te }), r.removeAttribute(d);
        } else d.startsWith(v) && (l.push({ type: 6, index: a }), r.removeAttribute(d));
        if (Ve.test(r.tagName)) {
          const d = r.textContent.split(v), u = d.length - 1;
          if (u > 0) {
            r.textContent = Z ? Z.emptyScript : "";
            for (let f = 0; f < u; f++) r.append(d[f], q()), x.nextNode(), l.push({ type: 2, index: ++a });
            r.append(d[u], q());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Qe) l.push({ type: 2, index: a });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(v, d + 1)) !== -1; ) l.push({ type: 7, index: a }), d += v.length - 1;
      }
      a++;
    }
  }
  static createElement(e, t) {
    const i = U.createElement("template");
    return i.innerHTML = e, i;
  }
}
function R(s, e, t = s, i) {
  var n, o;
  if (e === T) return e;
  let r = i !== void 0 ? (n = t._$Co) == null ? void 0 : n[i] : t._$Cl;
  const a = B(e) ? void 0 : e._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== a && ((o = r == null ? void 0 : r._$AO) == null || o.call(r, !1), a === void 0 ? r = void 0 : (r = new a(s), r._$AT(s, t, i)), i !== void 0 ? (t._$Co ?? (t._$Co = []))[i] = r : t._$Cl = r), r !== void 0 && (e = R(s, r._$AS(s, e.values), r, i)), e;
}
class Nt {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: i } = this._$AD, r = ((e == null ? void 0 : e.creationScope) ?? U).importNode(t, !0);
    x.currentNode = r;
    let a = x.nextNode(), n = 0, o = 0, l = i[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let h;
        l.type === 2 ? h = new L(a, a.nextSibling, this, e) : l.type === 1 ? h = new l.ctor(a, l.name, l.strings, this, e) : l.type === 6 && (h = new qt(a, this, e)), this._$AV.push(h), l = i[++o];
      }
      n !== (l == null ? void 0 : l.index) && (a = x.nextNode(), n++);
    }
    return x.currentNode = U, r;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class L {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, i, r) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = R(this, e, t), B(e) ? e === p || e == null || e === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : e !== this._$AH && e !== T && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : kt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== p && B(this._$AH) ? this._$AA.nextSibling.data = e : this.T(U.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var a;
    const { values: t, _$litType$: i } = e, r = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = W.createElement(Je(i.h, i.h[0]), this.options)), i);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === r) this._$AH.p(t);
    else {
      const n = new Nt(r, this), o = n.u(this.options);
      n.p(t), this.T(o), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = Re.get(e.strings);
    return t === void 0 && Re.set(e.strings, t = new W(e)), t;
  }
  k(e) {
    ge(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, r = 0;
    for (const a of e) r === t.length ? t.push(i = new L(this.O(q()), this.O(q()), this, this.options)) : i = t[r], i._$AI(a), r++;
    r < t.length && (this._$AR(i && i._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, t); e !== this._$AB; ) {
      const r = e.nextSibling;
      e.remove(), e = r;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class te {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, r, a) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = p;
  }
  _$AI(e, t = this, i, r) {
    const a = this.strings;
    let n = !1;
    if (a === void 0) e = R(this, e, t, 0), n = !B(e) || e !== this._$AH && e !== T, n && (this._$AH = e);
    else {
      const o = e;
      let l, h;
      for (e = a[0], l = 0; l < a.length - 1; l++) h = R(this, o[i + l], t, l), h === T && (h = this._$AH[l]), n || (n = !B(h) || h !== this._$AH[l]), h === p ? e = p : e !== p && (e += (h ?? "") + a[l + 1]), this._$AH[l] = h;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ht extends te {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === p ? void 0 : e;
  }
}
class It extends te {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== p);
  }
}
class zt extends te {
  constructor(e, t, i, r, a) {
    super(e, t, i, r, a), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = R(this, e, t, 0) ?? p) === T) return;
    const i = this._$AH, r = e === p && i !== p || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, a = e !== p && (i === p || r);
    r && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class qt {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    R(this, e);
  }
}
const le = z.litHtmlPolyfillSupport;
le == null || le(W, L), (z.litHtmlVersions ?? (z.litHtmlVersions = [])).push("3.3.1");
const Bt = (s, e, t) => {
  const i = (t == null ? void 0 : t.renderBefore) ?? e;
  let r = i._$litPart$;
  if (r === void 0) {
    const a = (t == null ? void 0 : t.renderBefore) ?? null;
    i._$litPart$ = r = new L(e.insertBefore(q(), a), a, void 0, t ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis;
class G extends M {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Bt(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return T;
  }
}
var ke;
G._$litElement$ = !0, G.finalized = !0, (ke = C.litElementHydrateSupport) == null || ke.call(C, { LitElement: G });
const he = C.litElementPolyfillSupport;
he == null || he({ LitElement: G });
(C.litElementVersions ?? (C.litElementVersions = [])).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ge = (s) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(s, e);
  }) : customElements.define(s, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Wt = { attribute: !0, type: String, converter: K, reflect: !1, hasChanged: ye }, Lt = (s = Wt, e, t) => {
  const { kind: i, metadata: r } = t;
  let a = globalThis.litPropertyMetadata.get(r);
  if (a === void 0 && globalThis.litPropertyMetadata.set(r, a = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), a.set(t.name, s), i === "accessor") {
    const { name: n } = t;
    return { set(o) {
      const l = e.get.call(this);
      e.set.call(this, o), this.requestUpdate(n, l, s);
    }, init(o) {
      return o !== void 0 && this.C(n, void 0, s, o), o;
    } };
  }
  if (i === "setter") {
    const { name: n } = t;
    return function(o) {
      const l = this[n];
      e.call(this, o), this.requestUpdate(n, l, s);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Qt(s) {
  return (e, t) => typeof t == "object" ? Lt(s, e, t) : ((i, r, a) => {
    const n = r.hasOwnProperty(a);
    return r.constructor.createProperty(a, i), n ? Object.getOwnPropertyDescriptor(r, a) : void 0;
  })(s, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function k(s) {
  return Qt({ ...s, state: !0, attribute: !1 });
}
var Vt = Object.defineProperty, Jt = Object.getOwnPropertyDescriptor, Xe = (s) => {
  throw TypeError(s);
}, se = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Jt(e, t) : e, a = s.length - 1, n; a >= 0; a--)
    (n = s[a]) && (r = (i ? n(e, t, r) : n(r)) || r);
  return i && r && Vt(e, t, r), r;
}, be = (s, e, t) => e.has(s) || Xe("Cannot " + t), g = (s, e, t) => (be(s, e, "read from private field"), e.get(s)), Q = (s, e, t) => e.has(s) ? Xe("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(s) : e.set(s, t), Gt = (s, e, t, i) => (be(s, e, "write to private field"), e.set(s, t), t), ce = (s, e, t) => (be(s, e, "access private method"), t), _, ue, pe, N, Fe, Ke, Ze;
let w = class extends je {
  constructor() {
    super(), Q(this, N), this._searchQuery = "", Q(this, _), this.getUnusedMedia = async () => {
      this._unusedImages = [];
      const { data: s, error: e } = await P.unusedMedia();
      if (e) {
        g(this, _) && g(this, _).peek("warning", {
          data: {
            headline: "Could not get unused media",
            message: "Something went wrong when trying to get the unused media."
          }
        });
        return;
      }
      s !== void 0 && (this._unusedImages = s.items);
    }, Q(this, ue, async (s) => {
      const e = s.target;
      e.state = "waiting", await P.delete({ body: this._unusedImages }), g(this, _) && g(this, _).peek("positive", {
        data: {
          headline: "Deleted unused media",
          message: `Successfully deleted ${this._unusedImages.length} unused media items.`
        }
      });
      const t = await this.getContext(X);
      t == null || t.dispatchEvent(new F({
        entityType: "media-root",
        unique: null
      })), await this.getUnusedMedia(), e.state = "success";
    }), Q(this, pe, async (s) => {
      const e = s.target;
      e.state = "waiting", await P.delete({ body: this._selection }), g(this, _) && g(this, _).peek("positive", {
        data: {
          headline: "Deleted unused media",
          message: `Successfully deleted ${this._selection.length} unused media items.`
        }
      });
      const t = await this.getContext(X);
      t == null || t.dispatchEvent(new F({
        entityType: "media-root",
        unique: null
      })), this._selection = [], await this.getUnusedMedia(), e.state = "success";
    }), this.consumeContext(De, (s) => {
      Gt(this, _, s);
    }), this._unusedImages = [], this._selection = [], this.getUnusedMedia();
  }
  get _filteredImages() {
    if (!this._searchQuery.trim())
      return this._unusedImages;
    const s = this._searchQuery.toLowerCase();
    return this._unusedImages.filter(
      (e) => e.name.toLowerCase().includes(s)
    );
  }
  render() {
    return Y`

      <uui-box>
        <div id="header">
          <h1>Welcome to the unused media dashboard</h1>
          <p>This will show unused media by the click of a button</p>
          <div id="toolbar">
            <uui-input
              id="search"
              placeholder="Search media..."
              label="Search media"
              @input="${ce(this, N, Ze)}">
              <uui-icon name="icon-search" slot="prepend"></uui-icon>
            </uui-input>
            <uui-button look="primary" color="danger" label="Delete ALL unused media"
                        @click="${g(this, ue)}"></uui-button>
            <uui-button look="primary" color="positive" label="Delete selected"
                        @click="${g(this, pe)}"></uui-button>
          </div>
        </div>

        <div id="grid">
          ${this._filteredImages.map((s) => Y`
              <uui-card-media
                .name="${s.name}"
                selectable
                select-only
                @selected=${() => ce(this, N, Fe).call(this, s)}
                @deselected=${() => ce(this, N, Ke).call(this, s)}
                ?selected=${this._selection.includes(s)}>
                <umb-imaging-thumbnail
                  .unique="${s.key}"
                  .icon=${s.icon}></umb-imaging-thumbnail>
              </uui-card-media>`)}
        </div>
      </uui-box>
    `;
  }
};
_ = /* @__PURE__ */ new WeakMap();
ue = /* @__PURE__ */ new WeakMap();
pe = /* @__PURE__ */ new WeakMap();
N = /* @__PURE__ */ new WeakSet();
Fe = function(s) {
  this._selection.push(s), this.requestUpdate("_selection");
};
Ke = function(s) {
  this._selection = this._selection.filter((e) => e !== s);
};
Ze = function(s) {
  this._searchQuery = s.target.value;
};
w.styles = We`
    :host {
      padding: 20px;
      display: block;
      box-sizing: border-box;
    }

    #header {
      padding: 10px;
    }

    #toolbar {
      display: flex;
      gap: var(--uui-size-space-3, 12px);
      align-items: center;
      flex-wrap: wrap;
      margin-top: var(--uui-size-space-4, 15px);
    }

    #search {
      width: 300px;
    }

    #grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 200px));
      gap: var(--uui-size-space-5, 18px);
    }

    uui-card-media {
      width: 200px;
      height: 200px;
    }
  `;
se([
  k()
], w.prototype, "_unusedImages", 2);
se([
  k()
], w.prototype, "_selection", 2);
se([
  k()
], w.prototype, "_searchQuery", 2);
w = se([
  Ge("unused-media-dashboard")
], w);
const Xt = w, Ft = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get UnusedMediaDashboardElement() {
    return w;
  },
  default: Xt
}, Symbol.toStringTag, { value: "Module" }));
var Kt = Object.defineProperty, Zt = Object.getOwnPropertyDescriptor, Ye = (s) => {
  throw TypeError(s);
}, ie = (s, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Zt(e, t) : e, a = s.length - 1, n; a >= 0; a--)
    (n = s[a]) && (r = (i ? n(e, t, r) : n(r)) || r);
  return i && r && Kt(e, t, r), r;
}, ve = (s, e, t) => e.has(s) || Ye("Cannot " + t), b = (s, e, t) => (ve(s, e, "read from private field"), e.get(s)), V = (s, e, t) => e.has(s) ? Ye("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(s) : e.set(s, t), Yt = (s, e, t, i) => (ve(s, e, "write to private field"), e.set(s, t), t), de = (s, e, t) => (ve(s, e, "access private method"), t), $, fe, me, H, et, tt, st;
let E = class extends je {
  constructor() {
    super(), V(this, H), this._searchQuery = "", V(this, $), this.getRecycleBinMedia = async () => {
      this._trashedMedia = [];
      const { data: s, error: e } = await P.recycleBinMedia();
      if (e) {
        b(this, $) && b(this, $).peek("warning", {
          data: {
            headline: "Could not get media from recycle bin",
            message: "Something went wrong when trying to get the media from the recycle bin."
          }
        });
        return;
      }
      s !== void 0 && (this._trashedMedia = s.items);
    }, V(this, fe, async (s) => {
      const e = s.target;
      e.state = "waiting", await P.restoreAll({ body: this._trashedMedia }), b(this, $) && b(this, $).peek("positive", {
        data: {
          headline: "Restored all trashed media",
          message: `Successfully restored ${this._trashedMedia.length} trashed media items.`
        }
      });
      const t = await this.getContext(X);
      t == null || t.dispatchEvent(new F({
        entityType: "media-root",
        unique: null
      })), await this.getRecycleBinMedia(), e.state = "success";
    }), V(this, me, async (s) => {
      const e = s.target;
      e.state = "waiting", await P.restoreAll({ body: this._selection }), b(this, $) && b(this, $).peek("positive", {
        data: {
          headline: "Restored selected media",
          message: `Successfully restored ${this._selection.length} trashed media items.`
        }
      });
      const t = await this.getContext(X);
      t == null || t.dispatchEvent(new F({
        entityType: "media-root",
        unique: null
      })), this._selection = [], await this.getRecycleBinMedia(), e.state = "success";
    }), this.consumeContext(De, (s) => {
      Yt(this, $, s);
    }), this._trashedMedia = [], this._selection = [], this.getRecycleBinMedia();
  }
  get _filteredMedia() {
    if (!this._searchQuery.trim())
      return this._trashedMedia;
    const s = this._searchQuery.toLowerCase();
    return this._trashedMedia.filter(
      (e) => e.name.toLowerCase().includes(s)
    );
  }
  render() {
    return Y`

      <uui-box>
        <div id="header">
          <h1>Welcome to the enhanced recycle bin dashboard</h1>
          <p>This will allow you to browse trashed content, much like you know the media section, and choose which to restore</p>
          <div id="toolbar">
            <uui-input
              id="search"
              placeholder="Search media..."
              label="Search media"
              @input="${de(this, H, st)}">
              <uui-icon name="icon-search" slot="prepend"></uui-icon>
            </uui-input>
            <uui-button look="primary" color="warning" label="Restore ALL trashed media"
                        @click="${b(this, fe)}"></uui-button>
            <uui-button look="primary" color="positive" label="Restore selected"
                        @click="${b(this, me)}"></uui-button>
          </div>
        </div>

        <div id="grid">
          ${this._filteredMedia.map((s) => Y`
              <uui-card-media
                .name="${s.name}"
                selectable
                select-only
                @selected=${() => de(this, H, et).call(this, s)}
                @deselected=${() => de(this, H, tt).call(this, s)}
                ?selected=${this._selection.includes(s)}>
                <umb-imaging-thumbnail
                  .unique="${s.key}"
                  .icon=${s.icon}></umb-imaging-thumbnail>
              </uui-card-media>`)}
        </div>
      </uui-box>
    `;
  }
};
$ = /* @__PURE__ */ new WeakMap();
fe = /* @__PURE__ */ new WeakMap();
me = /* @__PURE__ */ new WeakMap();
H = /* @__PURE__ */ new WeakSet();
et = function(s) {
  this._selection.push(s), this.requestUpdate("_selection");
};
tt = function(s) {
  this._selection = this._selection.filter((e) => e !== s);
};
st = function(s) {
  this._searchQuery = s.target.value;
};
E.styles = We`
    :host {
      padding: 20px;
      display: block;
      box-sizing: border-box;
    }

    #header {
      padding: 10px;
    }

    #toolbar {
      display: flex;
      gap: var(--uui-size-space-3, 12px);
      align-items: center;
      flex-wrap: wrap;
      margin-top: var(--uui-size-space-4, 15px);
    }

    #search {
      width: 300px;
    }

    #grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 200px));
      gap: var(--uui-size-space-5, 18px);
    }

    uui-card-media {
      width: 200px;
      height: 200px;
    }
  `;
ie([
  k()
], E.prototype, "_trashedMedia", 2);
ie([
  k()
], E.prototype, "_selection", 2);
ie([
  k()
], E.prototype, "_searchQuery", 2);
E = ie([
  Ge("enhanced-recycle-bin-dashboard")
], E);
const es = E, ts = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get EnhancedRecycleBinDashboardElement() {
    return E;
  },
  default: es
}, Symbol.toStringTag, { value: "Module" }));
export {
  ls as manifests
};
//# sourceMappingURL=unused-media.js.map
