import{a8 as e,a9 as t,j as n,aa as r,ab as a,ac as s,ad as i,ae as o,af as l,ag as c,ah as d}from"./index-08a517c8.js";import{r as h}from"./vendor-react-5ad2f2be.js";import{u as p,a as u}from"./vendor-redux-a2b3fa67.js";import{b as f,a as g}from"./index-e63dad20.js";import{f as m,h as b,j as x}from"./index-d7a543b9.js";import"./vendor-axios-36ca341e.js";const w=function(e){const t=[];let n=0;for(let r=0;r<e.length;r++){let a=e.charCodeAt(r);a<128?t[n++]=a:a<2048?(t[n++]=a>>6|192,t[n++]=63&a|128):55296==(64512&a)&&r+1<e.length&&56320==(64512&e.charCodeAt(r+1))?(a=65536+((1023&a)<<10)+(1023&e.charCodeAt(++r)),t[n++]=a>>18|240,t[n++]=a>>12&63|128,t[n++]=a>>6&63|128,t[n++]=63&a|128):(t[n++]=a>>12|224,t[n++]=a>>6&63|128,t[n++]=63&a|128)}return t},_={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let a=0;a<e.length;a+=3){const t=e[a],s=a+1<e.length,i=s?e[a+1]:0,o=a+2<e.length,l=o?e[a+2]:0,c=t>>2,d=(3&t)<<4|i>>4;let h=(15&i)<<2|l>>6,p=63&l;o||(p=64,s||(h=64)),r.push(n[c],n[d],n[h],n[p])}return r.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(w(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):function(e){const t=[];let n=0,r=0;for(;n<e.length;){const a=e[n++];if(a<128)t[r++]=String.fromCharCode(a);else if(a>191&&a<224){const s=e[n++];t[r++]=String.fromCharCode((31&a)<<6|63&s)}else if(a>239&&a<365){const s=((7&a)<<18|(63&e[n++])<<12|(63&e[n++])<<6|63&e[n++])-65536;t[r++]=String.fromCharCode(55296+(s>>10)),t[r++]=String.fromCharCode(56320+(1023&s))}else{const s=e[n++],i=e[n++];t[r++]=String.fromCharCode((15&a)<<12|(63&s)<<6|63&i)}}return t.join("")}(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let a=0;a<e.length;){const t=n[e.charAt(a++)],s=a<e.length?n[e.charAt(a)]:0;++a;const i=a<e.length?n[e.charAt(a)]:64;++a;const o=a<e.length?n[e.charAt(a)]:64;if(++a,null==t||null==s||null==i||null==o)throw new y;const l=t<<2|s>>4;if(r.push(l),64!==i){const e=s<<4&240|i>>2;if(r.push(e),64!==o){const e=i<<6&192|o;r.push(e)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const v=function(e){return function(e){const t=w(e);return _.encodeByteArray(t,!0)}(e).replace(/\./g,"")};
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const E=()=>
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("Unable to locate global object.")}().__FIREBASE_DEFAULTS__,k=()=>{if("undefined"==typeof document)return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(n){return}const t=e&&function(e){try{return _.decodeString(e,!0)}catch(n){}return null}(e[1]);return t&&JSON.parse(t)},j=()=>{try{return E()||(()=>{if("undefined"==typeof process||void 0===process.env)return;const e={}.__FIREBASE_DEFAULTS__;return e?JSON.parse(e):void 0})()||k()}catch(e){return}},N=e=>{const t=(e=>{var t,n;return null==(n=null==(t=j())?void 0:t.emulatorHosts)?void 0:n[e]})(e);if(!t)return;const n=t.lastIndexOf(":");if(n<=0||n+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(n+1),10);return"["===t[0]?[t.substring(1,n-1),r]:[t.substring(0,n),r]},C=()=>{var e;return null==(e=j())?void 0:e.config};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class I{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,n))}}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class T extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,T.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,S.prototype.create)}}class S{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},r=`${this.service}/${e}`,a=this.errors[e],s=a?function(e,t){return e.replace(D,(e,n)=>{const r=t[n];return null!=r?String(r):`<${n}?>`})}(a,n):"Error",i=`${this.serviceName}: ${s} (${r}).`;return new T(r,i,n)}}const D=/\{\$([^}]+)}/g;function A(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const a of n){if(!r.includes(a))return!1;const n=e[a],s=t[a];if(R(n)&&R(s)){if(!A(n,s))return!1}else if(n!==s)return!1}for(const a of r)if(!n.includes(a))return!1;return!0}function R(e){return null!==e&&"object"==typeof e}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function O(e){return e&&e._delegate?e._delegate:e}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function q(e){try{return(e.startsWith("http://")||e.startsWith("https://")?new URL(e).hostname:e).endsWith(".cloudworkstations.dev")}catch{return!1}}class L{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const U="[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new I;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch(n){}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),n=(null==e?void 0:e.optional)??!1;if(!this.isInitialized(t)&&!this.shouldAutoInitialize()){if(n)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:t})}catch(r){if(n)return null;throw r}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(function(e){return"EAGER"===e.instantiationMode}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e))try{this.getOrInitializeService({instanceIdentifier:U})}catch(t){}for(const[e,n]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:r});n.resolve(e)}catch(t){}}}}clearInstance(e=U){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=U){return this.instances.has(e)}getOptions(e=U){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[a,s]of this.instancesDeferred.entries()){n===this.normalizeInstanceIdentifier(a)&&s.resolve(r)}return r}onInit(e,t){const n=this.normalizeInstanceIdentifier(t),r=this.onInitCallbacks.get(n)??new Set;r.add(e),this.onInitCallbacks.set(n,r);const a=this.instances.get(n);return a&&e(a,n),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const r of n)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:(r=e,r===U?void 0:r),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}var r;return n||null}normalizeInstanceIdentifier(e=U){return this.component?this.component.multipleInstances?e:U:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}class P{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new B(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var z,M;(M=z||(z={}))[M.DEBUG=0]="DEBUG",M[M.VERBOSE=1]="VERBOSE",M[M.INFO=2]="INFO",M[M.WARN=3]="WARN",M[M.ERROR=4]="ERROR",M[M.SILENT=5]="SILENT";const F={debug:z.DEBUG,verbose:z.VERBOSE,info:z.INFO,warn:z.WARN,error:z.ERROR,silent:z.SILENT},$=z.INFO,H={[z.DEBUG]:"log",[z.VERBOSE]:"log",[z.INFO]:"info",[z.WARN]:"warn",[z.ERROR]:"error"},V=(e,t,...n)=>{if(t<e.logLevel)return;(new Date).toISOString();if(!H[t])throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};let W,K;const G=new WeakMap,J=new WeakMap,Y=new WeakMap,X=new WeakMap,Z=new WeakMap;let Q={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return J.get(e);if("objectStoreNames"===t)return e.objectStoreNames||Y.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ne(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function ee(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(K||(K=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(re(this),t),ne(G.get(this))}:function(...t){return ne(e.apply(re(this),t))}:function(t,...n){const r=e.call(re(this),t,...n);return Y.set(r,t.sort?t.sort():[t]),ne(r)}}function te(e){return"function"==typeof e?ee(e):(e instanceof IDBTransaction&&function(e){if(J.has(e))return;const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("complete",a),e.removeEventListener("error",s),e.removeEventListener("abort",s)},a=()=>{t(),r()},s=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",a),e.addEventListener("error",s),e.addEventListener("abort",s)});J.set(e,t)}(e),t=e,(W||(W=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some(e=>t instanceof e)?new Proxy(e,Q):e);var t}function ne(e){if(e instanceof IDBRequest)return function(e){const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("success",a),e.removeEventListener("error",s)},a=()=>{t(ne(e.result)),r()},s=()=>{n(e.error),r()};e.addEventListener("success",a),e.addEventListener("error",s)});return t.then(t=>{t instanceof IDBCursor&&G.set(t,e)}).catch(()=>{}),Z.set(t,e),t}(e);if(X.has(e))return X.get(e);const t=te(e);return t!==e&&(X.set(e,t),Z.set(t,e)),t}const re=e=>Z.get(e);const ae=["get","getKey","getAll","getAllKeys","count"],se=["put","add","delete","clear"],ie=new Map;function oe(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(ie.get(t))return ie.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,a=se.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!a&&!ae.includes(n))return;const s=async function(e,...t){const s=this.transaction(e,a?"readwrite":"readonly");let i=s.store;return r&&(i=i.index(t.shift())),(await Promise.all([i[n](...t),a&&s.done]))[0]};return ie.set(t,s),s}Q=(e=>({...e,get:(t,n,r)=>oe(t,n)||e.get(t,n,r),has:(t,n)=>!!oe(t,n)||e.has(t,n)}))(Q);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class le{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(function(e){const t=e.getComponent();return"VERSION"===(null==t?void 0:t.type)}(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null}).filter(e=>e).join(" ")}}const ce="@firebase/app",de="0.14.10",he=new class{constructor(e){this.name=e,this._logLevel=$,this._logHandler=V,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in z))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?F[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,z.DEBUG,...e),this._logHandler(this,z.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,z.VERBOSE,...e),this._logHandler(this,z.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,z.INFO,...e),this._logHandler(this,z.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,z.WARN,...e),this._logHandler(this,z.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,z.ERROR,...e),this._logHandler(this,z.ERROR,...e)}}("@firebase/app"),pe="@firebase/app-compat",ue="@firebase/analytics-compat",fe="@firebase/analytics",ge="@firebase/app-check-compat",me="@firebase/app-check",be="@firebase/auth",xe="@firebase/auth-compat",we="@firebase/database",_e="@firebase/data-connect",ye="@firebase/database-compat",ve="@firebase/functions",Ee="@firebase/functions-compat",ke="@firebase/installations",je="@firebase/installations-compat",Ne="@firebase/messaging",Ce="@firebase/messaging-compat",Ie="@firebase/performance",Te="@firebase/performance-compat",Se="@firebase/remote-config",De="@firebase/remote-config-compat",Ae="@firebase/storage",Re="@firebase/storage-compat",Oe="@firebase/firestore",qe="@firebase/ai",Le="@firebase/firestore-compat",Ue="firebase",Be="[DEFAULT]",Pe={[ce]:"fire-core",[pe]:"fire-core-compat",[fe]:"fire-analytics",[ue]:"fire-analytics-compat",[me]:"fire-app-check",[ge]:"fire-app-check-compat",[be]:"fire-auth",[xe]:"fire-auth-compat",[we]:"fire-rtdb",[_e]:"fire-data-connect",[ye]:"fire-rtdb-compat",[ve]:"fire-fn",[Ee]:"fire-fn-compat",[ke]:"fire-iid",[je]:"fire-iid-compat",[Ne]:"fire-fcm",[Ce]:"fire-fcm-compat",[Ie]:"fire-perf",[Te]:"fire-perf-compat",[Se]:"fire-rc",[De]:"fire-rc-compat",[Ae]:"fire-gcs",[Re]:"fire-gcs-compat",[Oe]:"fire-fst",[Le]:"fire-fst-compat",[qe]:"fire-vertex","fire-js":"fire-js",[Ue]:"fire-js-all"},ze=new Map,Me=new Map,Fe=new Map;function $e(e,t){try{e.container.addComponent(t)}catch(n){he.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function He(e){const t=e.name;if(Fe.has(t))return he.debug(`There were multiple attempts to register component ${t}.`),!1;Fe.set(t,e);for(const n of ze.values())$e(n,e);for(const n of Me.values())$e(n,e);return!0}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ve=new S("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class We{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new L("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ve.create("app-deleted",{appName:this._name})}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ke(e,t={}){let n=e;if("object"!=typeof t){t={name:t}}const r={name:Be,automaticDataCollectionEnabled:!0,...t},a=r.name;if("string"!=typeof a||!a)throw Ve.create("bad-app-name",{appName:String(a)});if(n||(n=C()),!n)throw Ve.create("no-options");const s=ze.get(a);if(s){if(A(n,s.options)&&A(r,s.config))return s;throw Ve.create("duplicate-app",{appName:a})}const i=new P(a);for(const l of Fe.values())i.addComponent(l);const o=new We(n,r,i);return ze.set(a,o),o}function Ge(e,t,n){let r=Pe[e]??e;n&&(r+=`-${n}`);const a=r.match(/\s|\//),s=t.match(/\s|\//);if(a||s){const e=[`Unable to register library "${r}" with version "${t}":`];return a&&e.push(`library name "${r}" contains illegal characters (whitespace or "/")`),a&&s&&e.push("and"),s&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void he.warn(e.join(" "))}He(new L(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Je="firebase-heartbeat-store";let Ye=null;function Xe(){return Ye||(Ye=function(e,t,{blocked:n,upgrade:r,blocking:a,terminated:s}={}){const i=indexedDB.open(e,t),o=ne(i);return r&&i.addEventListener("upgradeneeded",e=>{r(ne(i.result),e.oldVersion,e.newVersion,ne(i.transaction),e)}),n&&i.addEventListener("blocked",e=>n(e.oldVersion,e.newVersion,e)),o.then(e=>{s&&e.addEventListener("close",()=>s()),a&&e.addEventListener("versionchange",e=>a(e.oldVersion,e.newVersion,e))}).catch(()=>{}),o}("firebase-heartbeat-database",1,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(Je)}catch(n){}}}).catch(e=>{throw Ve.create("idb-open",{originalErrorMessage:e.message})})),Ye}async function Ze(e,t){try{const n=(await Xe()).transaction(Je,"readwrite"),r=n.objectStore(Je);await r.put(t,Qe(e)),await n.done}catch(n){if(n instanceof T)he.warn(n.message);else{const e=Ve.create("idb-set",{originalErrorMessage:null==n?void 0:n.message});he.warn(e.message)}}}function Qe(e){return`${e.name}!${e.options.appId}`}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new nt(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){var e,t;try{const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=tt();if(null==(null==(e=this._heartbeatsCache)?void 0:e.heartbeats)&&(this._heartbeatsCache=await this._heartbeatsCachePromise,null==(null==(t=this._heartbeatsCache)?void 0:t.heartbeats)))return;if(this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(e=>e.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:n}),this._heartbeatsCache.heartbeats.length>30){const e=function(e){if(0===e.length)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(e,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){he.warn(n)}}async getHeartbeatsHeader(){var e;try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==(null==(e=this._heartbeatsCache)?void 0:e.heartbeats)||0===this._heartbeatsCache.heartbeats.length)return"";const t=tt(),{heartbeatsToSend:n,unsentEntries:r}=function(e,t=1024){const n=[];let r=e.slice();for(const a of e){const e=n.find(e=>e.agent===a.agent);if(e){if(e.dates.push(a.date),rt(n)>t){e.dates.pop();break}}else if(n.push({agent:a.agent,dates:[a.date]}),rt(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}(this._heartbeatsCache.heartbeats),a=v(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),a}catch(t){return he.warn(t),""}}}function tt(){return(new Date).toISOString().substring(0,10)}class nt{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!function(){try{return"object"==typeof indexedDB}catch(e){return!1}}()&&new Promise((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",a=self.indexedDB.open(r);a.onsuccess=()=>{a.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},a.onupgradeneeded=()=>{n=!1},a.onerror=()=>{var e;t((null==(e=a.error)?void 0:e.message)||"")}}catch(n){t(n)}}).then(()=>!0).catch(()=>!1)}async read(){if(await this._canUseIndexedDBPromise){const e=await async function(e){try{const t=(await Xe()).transaction(Je),n=await t.objectStore(Je).get(Qe(e));return await t.done,n}catch(t){if(t instanceof T)he.warn(t.message);else{const e=Ve.create("idb-get",{originalErrorMessage:null==t?void 0:t.message});he.warn(e.message)}}}(this.app);return(null==e?void 0:e.heartbeats)?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const t=await this.read();return Ze(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){if(await this._canUseIndexedDBPromise){const t=await this.read();return Ze(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:[...t.heartbeats,...e.heartbeats]})}}}function rt(e){return v(JSON.stringify({version:2,heartbeats:e})).length}var at;at="",He(new L("platform-logger",e=>new le(e),"PRIVATE")),He(new L("heartbeat",e=>new et(e),"PRIVATE")),Ge(ce,de,at),Ge(ce,de,"esm2020"),Ge("fire-js","");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const st="firebasestorage.googleapis.com",it="storageBucket";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ot extends T{constructor(e,t,n=0){super(pt(e),`Firebase Storage: ${t} (${pt(e)})`),this.status_=n,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,ot.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return pt(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}\n${this.customData.serverResponse}`:this.message=this._baseMessage}}var lt,ct,dt,ht;function pt(e){return"storage/"+e}function ut(){return new ot(lt.UNKNOWN,"An unknown error occurred, please check the error payload for server response.")}function ft(e){return new ot(lt.INVALID_ARGUMENT,e)}function gt(){return new ot(lt.APP_DELETED,"The Firebase app was deleted.")}function mt(e,t){return new ot(lt.INVALID_FORMAT,"String does not match format '"+e+"': "+t)}function bt(e){throw new ot(lt.INTERNAL_ERROR,"Internal error: "+e)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(ct=lt||(lt={})).UNKNOWN="unknown",ct.OBJECT_NOT_FOUND="object-not-found",ct.BUCKET_NOT_FOUND="bucket-not-found",ct.PROJECT_NOT_FOUND="project-not-found",ct.QUOTA_EXCEEDED="quota-exceeded",ct.UNAUTHENTICATED="unauthenticated",ct.UNAUTHORIZED="unauthorized",ct.UNAUTHORIZED_APP="unauthorized-app",ct.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",ct.INVALID_CHECKSUM="invalid-checksum",ct.CANCELED="canceled",ct.INVALID_EVENT_NAME="invalid-event-name",ct.INVALID_URL="invalid-url",ct.INVALID_DEFAULT_BUCKET="invalid-default-bucket",ct.NO_DEFAULT_BUCKET="no-default-bucket",ct.CANNOT_SLICE_BLOB="cannot-slice-blob",ct.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",ct.NO_DOWNLOAD_URL="no-download-url",ct.INVALID_ARGUMENT="invalid-argument",ct.INVALID_ARGUMENT_COUNT="invalid-argument-count",ct.APP_DELETED="app-deleted",ct.INVALID_ROOT_OPERATION="invalid-root-operation",ct.INVALID_FORMAT="invalid-format",ct.INTERNAL_ERROR="internal-error",ct.UNSUPPORTED_ENVIRONMENT="unsupported-environment";class xt{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return 0===this.path.length}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let n;try{n=xt.makeFromUrl(e,t)}catch(a){return new xt(e,"")}if(""===n.path)return n;throw r=e,new ot(lt.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+r+"'.");var r}static makeFromUrl(e,t){let n=null;const r="([A-Za-z0-9.\\-_]+)";const a=new RegExp("^gs://"+r+"(/(.*))?$","i");function s(e){e.path_=decodeURIComponent(e.path)}const i=t.replace(/[.]/g,"\\."),o=[{regex:a,indices:{bucket:1,path:3},postModify:function(e){"/"===e.path.charAt(e.path.length-1)&&(e.path_=e.path_.slice(0,-1))}},{regex:new RegExp(`^https?://${i}/v[A-Za-z0-9_]+/b/${r}/o(/([^?#]*).*)?$`,"i"),indices:{bucket:1,path:3},postModify:s},{regex:new RegExp(`^https?://${t===st?"(?:storage.googleapis.com|storage.cloud.google.com)":t}/${r}/([^?#]*)`,"i"),indices:{bucket:1,path:2},postModify:s}];for(let l=0;l<o.length;l++){const t=o[l],r=t.regex.exec(e);if(r){const e=r[t.indices.bucket];let a=r[t.indices.path];a||(a=""),n=new xt(e,a),t.postModify(n);break}}if(null==n)throw function(e){return new ot(lt.INVALID_URL,"Invalid URL '"+e+"'.")}(e);return n}}class wt{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _t(e){return"string"==typeof e||e instanceof String}function yt(e){return vt()&&e instanceof Blob}function vt(){return"undefined"!=typeof Blob}function Et(e,t,n,r){if(r<t)throw ft(`Invalid value for '${e}'. Expected ${t} or greater.`);if(r>n)throw ft(`Invalid value for '${e}'. Expected ${n} or less.`)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kt(e,t,n){let r=t;return null==n&&(r=`https://${t}`),`${n}://${r}/v0${e}`}function jt(e){const t=encodeURIComponent;let n="?";for(const r in e)if(e.hasOwnProperty(r)){n=n+(t(r)+"="+t(e[r]))+"&"}return n=n.slice(0,-1),n}(ht=dt||(dt={}))[ht.NO_ERROR=0]="NO_ERROR",ht[ht.NETWORK_ERROR=1]="NETWORK_ERROR",ht[ht.ABORT=2]="ABORT";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Nt{constructor(e,t,n,r,a,s,i,o,l,c,d,h=!0,p=!1){this.url_=e,this.method_=t,this.headers_=n,this.body_=r,this.successCodes_=a,this.additionalRetryCodes_=s,this.callback_=i,this.errorCallback_=o,this.timeout_=l,this.progressCallback_=c,this.connectionFactory_=d,this.retry=h,this.isUsingEmulator=p,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((e,t)=>{this.resolve_=e,this.reject_=t,this.start_()})}start_(){const e=(e,t)=>{if(t)return void e(!1,new Ct(!1,null,!0));const n=this.connectionFactory_();this.pendingConnection_=n;const r=e=>{const t=e.loaded,n=e.lengthComputable?e.total:-1;null!==this.progressCallback_&&this.progressCallback_(t,n)};null!==this.progressCallback_&&n.addUploadProgressListener(r),n.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{null!==this.progressCallback_&&n.removeUploadProgressListener(r),this.pendingConnection_=null;const t=n.getErrorCode()===dt.NO_ERROR,a=n.getStatus();if(!t||
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e,t){const n=e>=500&&e<600,r=-1!==[408,429].indexOf(e),a=-1!==t.indexOf(e);return n||r||a}(a,this.additionalRetryCodes_)&&this.retry){const t=n.getErrorCode()===dt.ABORT;return void e(!1,new Ct(!1,null,t))}const s=-1!==this.successCodes_.indexOf(a);e(!0,new Ct(s,n))})},t=(e,t)=>{const n=this.resolve_,r=this.reject_,a=t.connection;if(t.wasSuccessCode)try{const e=this.callback_(a,a.getResponse());void 0!==e?n(e):n()}catch(s){r(s)}else if(null!==a){const e=ut();e.serverResponse=a.getErrorText(),this.errorCallback_?r(this.errorCallback_(a,e)):r(e)}else if(t.canceled){r(this.appDelete_?gt():new ot(lt.CANCELED,"User canceled the upload/download."))}else{r(new ot(lt.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again."))}};this.canceled_?t(0,new Ct(!1,null,!0)):this.backoffId_=function(e,t,n){let r=1,a=null,s=null,i=!1,o=0;function l(){return 2===o}let c=!1;function d(...e){c||(c=!0,t.apply(null,e))}function h(t){a=setTimeout(()=>{a=null,e(u,l())},t)}function p(){s&&clearTimeout(s)}function u(e,...t){if(c)return void p();if(e)return p(),void d.call(null,e,...t);if(l()||i)return p(),void d.call(null,e,...t);let n;r<64&&(r*=2),1===o?(o=2,n=0):n=1e3*(r+Math.random()),h(n)}let f=!1;function g(e){f||(f=!0,p(),c||(null!==a?(e||(o=2),clearTimeout(a),h(0)):e||(o=1)))}return h(0),s=setTimeout(()=>{i=!0,g(!0)},n),g}(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,null!==this.backoffId_&&(0,this.backoffId_)(!1),null!==this.pendingConnection_&&this.pendingConnection_.abort()}}class Ct{constructor(e,t,n){this.wasSuccessCode=e,this.connection=t,this.canceled=!!n}}function It(...e){const t="undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof WebKitBlobBuilder?WebKitBlobBuilder:void 0;if(void 0!==t){const n=new t;for(let t=0;t<e.length;t++)n.append(e[t]);return n.getBlob()}if(vt())return new Blob(e);throw new ot(lt.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Tt(e){if("undefined"==typeof atob)throw t="base-64",new ot(lt.UNSUPPORTED_ENVIRONMENT,`${t} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`);var t;return atob(e)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const St="raw",Dt="base64",At="base64url",Rt="data_url";class Ot{constructor(e,t){this.data=e,this.contentType=t||null}}function qt(e,t){switch(e){case St:return new Ot(Lt(t));case Dt:case At:return new Ot(Ut(e,t));case Rt:return new Ot(function(e){const t=new Bt(e);return t.base64?Ut(Dt,t.rest):function(e){let t;try{t=decodeURIComponent(e)}catch(n){throw mt(Rt,"Malformed data URL.")}return Lt(t)}(t.rest)}(t),new Bt(t).contentType)}throw ut()}function Lt(e){const t=[];for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);if(r<=127)t.push(r);else if(r<=2047)t.push(192|r>>6,128|63&r);else if(55296==(64512&r)){if(n<e.length-1&&56320==(64512&e.charCodeAt(n+1))){r=65536|(1023&r)<<10|1023&e.charCodeAt(++n),t.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|63&r)}else t.push(239,191,189)}else 56320==(64512&r)?t.push(239,191,189):t.push(224|r>>12,128|r>>6&63,128|63&r)}return new Uint8Array(t)}function Ut(e,t){switch(e){case Dt:{const n=-1!==t.indexOf("-"),r=-1!==t.indexOf("_");if(n||r){throw mt(e,"Invalid character '"+(n?"-":"_")+"' found: is it base64url encoded?")}break}case At:{const n=-1!==t.indexOf("+"),r=-1!==t.indexOf("/");if(n||r){throw mt(e,"Invalid character '"+(n?"+":"/")+"' found: is it base64 encoded?")}t=t.replace(/-/g,"+").replace(/_/g,"/");break}}let n;try{n=Tt(t)}catch(a){if(a.message.includes("polyfill"))throw a;throw mt(e,"Invalid character found")}const r=new Uint8Array(n.length);for(let s=0;s<n.length;s++)r[s]=n.charCodeAt(s);return r}class Bt{constructor(e){this.base64=!1,this.contentType=null;const t=e.match(/^data:([^,]+)?,/);if(null===t)throw mt(Rt,"Must be formatted 'data:[<mediatype>][;base64],<data>");const n=t[1]||null;null!=n&&(this.base64=function(e,t){if(!(e.length>=t.length))return!1;return e.substring(e.length-t.length)===t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(n,";base64"),this.contentType=this.base64?n.substring(0,n.length-7):n),this.rest=e.substring(e.indexOf(",")+1)}}class Pt{constructor(e,t){let n=0,r="";yt(e)?(this.data_=e,n=e.size,r=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),n=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),n=e.length),this.size_=n,this.type_=r}size(){return this.size_}type(){return this.type_}slice(e,t){if(yt(this.data_)){const s=this.data_,i=(r=e,a=t,(n=s).webkitSlice?n.webkitSlice(r,a):n.mozSlice?n.mozSlice(r,a):n.slice?n.slice(r,a):null);return null===i?null:new Pt(i)}{const n=new Uint8Array(this.data_.buffer,e,t-e);return new Pt(n,!0)}var n,r,a}static getBlob(...e){if(vt()){const t=e.map(e=>e instanceof Pt?e.data_:e);return new Pt(It.apply(null,t))}{const t=e.map(e=>_t(e)?qt(St,e).data:e.data_);let n=0;t.forEach(e=>{n+=e.byteLength});const r=new Uint8Array(n);let a=0;return t.forEach(e=>{for(let t=0;t<e.length;t++)r[a++]=e[t]}),new Pt(r,!0)}}uploadData(){return this.data_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zt(e){let t;try{t=JSON.parse(e)}catch(r){return null}return"object"!=typeof(n=t)||Array.isArray(n)?null:t;var n}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mt(e){const t=e.lastIndexOf("/",e.length-2);return-1===t?e:e.slice(t+1)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ft(e,t){return t}class $t{constructor(e,t,n,r){this.server=e,this.local=t||e,this.writable=!!n,this.xform=r||Ft}}let Ht=null;function Vt(){if(Ht)return Ht;const e=[];e.push(new $t("bucket")),e.push(new $t("generation")),e.push(new $t("metageneration")),e.push(new $t("name","fullPath",!0));const t=new $t("name");t.xform=function(e,t){return function(e){return!_t(e)||e.length<2?e:Mt(e)}(t)},e.push(t);const n=new $t("size");return n.xform=function(e,t){return void 0!==t?Number(t):t},e.push(n),e.push(new $t("timeCreated")),e.push(new $t("updated")),e.push(new $t("md5Hash",null,!0)),e.push(new $t("cacheControl",null,!0)),e.push(new $t("contentDisposition",null,!0)),e.push(new $t("contentEncoding",null,!0)),e.push(new $t("contentLanguage",null,!0)),e.push(new $t("contentType",null,!0)),e.push(new $t("metadata","customMetadata",!0)),Ht=e,Ht}function Wt(e,t,n){const r={type:"file"},a=n.length;for(let s=0;s<a;s++){const e=n[s];r[e.local]=e.xform(r,t[e.server])}return function(e,t){Object.defineProperty(e,"ref",{get:function(){const n=e.bucket,r=e.fullPath,a=new xt(n,r);return t._makeStorageReference(a)}})}(r,e),r}function Kt(e,t,n){const r=zt(t);if(null===r)return null;return Wt(e,r,n)}class Gt{constructor(e,t,n,r){this.url=e,this.method=t,this.handler=n,this.timeout=r,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jt(e){if(!e)throw ut()}function Yt(e,t){return function(n,r){const a=Kt(e,r,t);return Jt(null!==a),function(e,t,n,r){const a=zt(t);if(null===a)return null;if(!_t(a.downloadTokens))return null;const s=a.downloadTokens;if(0===s.length)return null;const i=encodeURIComponent;return s.split(",").map(t=>{const a=e.bucket,s=e.fullPath;return kt("/b/"+i(a)+"/o/"+i(s),n,r)+jt({alt:"media",token:t})})[0]}(a,r,e.host,e._protocol)}}function Xt(e){return function(t,n){let r;var a,s;return 401===t.getStatus()?r=t.getErrorText().includes("Firebase App Check token is invalid")?new ot(lt.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project."):new ot(lt.UNAUTHENTICATED,"User is not authenticated, please authenticate using Firebase Authentication and try again."):402===t.getStatus()?(s=e.bucket,r=new ot(lt.QUOTA_EXCEEDED,"Quota for bucket '"+s+"' exceeded, please view quota on https://firebase.google.com/pricing/.")):403===t.getStatus()?(a=e.path,r=new ot(lt.UNAUTHORIZED,"User does not have permission to access '"+a+"'.")):r=n,r.status=t.getStatus(),r.serverResponse=n.serverResponse,r}}function Zt(e){const t=Xt(e);return function(n,r){let a=t(n,r);var s;return 404===n.getStatus()&&(s=e.path,a=new ot(lt.OBJECT_NOT_FOUND,"Object '"+s+"' does not exist.")),a.serverResponse=r.serverResponse,a}}function Qt(e,t,n,r,a){const s=t.bucketOnlyServerUrl(),i={"X-Goog-Upload-Protocol":"multipart"};const o=function(){let e="";for(let t=0;t<2;t++)e+=Math.random().toString().slice(2);return e}();i["Content-Type"]="multipart/related; boundary="+o;const l=function(e,t,n){const r=Object.assign({},n);return r.fullPath=e.path,r.size=t.size(),r.contentType||(r.contentType=function(e,t){return e&&e.contentType||t&&t.type()||"application/octet-stream"}(null,t)),r}(t,r,a),c=function(e,t){const n={},r=t.length;for(let a=0;a<r;a++){const r=t[a];r.writable&&(n[r.server]=e[r.local])}return JSON.stringify(n)}(l,n),d="--"+o+"\r\nContent-Type: application/json; charset=utf-8\r\n\r\n"+c+"\r\n--"+o+"\r\nContent-Type: "+l.contentType+"\r\n\r\n",h="\r\n--"+o+"--",p=Pt.getBlob(d,r,h);if(null===p)throw new ot(lt.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.");const u={name:l.fullPath},f=kt(s,e.host,e._protocol),g=e.maxUploadRetryTime,m=new Gt(f,"POST",function(e,t){return function(n,r){const a=Kt(e,r,t);return Jt(null!==a),a}}(e,n),g);return m.urlParams=u,m.headers=i,m.body=p.uploadData(),m.errorHandler=Xt(t),m}class en{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=dt.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=dt.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=dt.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,n,r,a){if(this.sent_)throw bt("cannot .send() more than once");if(q(e)&&n&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(t,e,!0),void 0!==a)for(const s in a)a.hasOwnProperty(s)&&this.xhr_.setRequestHeader(s,a[s].toString());return void 0!==r?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw bt("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw bt("cannot .getStatus() before sending");try{return this.xhr_.status}catch(e){return-1}}getResponse(){if(!this.sent_)throw bt("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw bt("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){null!=this.xhr_.upload&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){null!=this.xhr_.upload&&this.xhr_.upload.removeEventListener("progress",e)}}class tn extends en{initXhr(){this.xhr_.responseType="text"}}function nn(){return new tn}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rn{constructor(e,t){this._service=e,this._location=t instanceof xt?t:xt.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new rn(e,t)}get root(){const e=new xt(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return Mt(this._location.path)}get storage(){return this._service}get parent(){const e=function(e){if(0===e.length)return null;const t=e.lastIndexOf("/");return-1===t?"":e.slice(0,t)}(this._location.path);if(null===e)return null;const t=new xt(this._location.bucket,e);return new rn(this._service,t)}_throwIfRoot(e){if(""===this._location.path)throw function(e){return new ot(lt.INVALID_ROOT_OPERATION,"The operation '"+e+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}(e)}}function an(e){e._throwIfRoot("getDownloadURL");const t=function(e,t,n){const r=kt(t.fullServerUrl(),e.host,e._protocol),a=e.maxOperationRetryTime,s=new Gt(r,"GET",Yt(e,n),a);return s.errorHandler=Zt(t),s}(e.storage,e._location,Vt());return e.storage.makeRequestWithTokens(t,nn).then(e=>{if(null===e)throw new ot(lt.NO_DOWNLOAD_URL,"The given file does not have any download URLs.");return e})}function sn(e,t){if(e instanceof dn){const n=e;if(null==n._bucket)throw new ot(lt.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+it+"' property when initializing the app?");const r=new rn(n,n._bucket);return null!=t?sn(r,t):r}return void 0!==t?function(e,t){const n=function(e,t){const n=t.split("/").filter(e=>e.length>0).join("/");return 0===e.length?n:e+"/"+n}(e._location.path,t),r=new xt(e._location.bucket,n);return new rn(e.storage,r)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,t):e}function on(e,t){if(t&&/^[A-Za-z]+:\/\//.test(t)){if(e instanceof dn)return new rn(e,t);throw ft("To use ref(service, url), the first argument must be a Storage instance.")}return sn(e,t)}function ln(e,t){const n=null==t?void 0:t[it];return null==n?null:xt.makeFromBucketSpec(n,e)}function cn(e,t,n,r={}){e.host=`${t}:${n}`;const a=q(t);a&&async function(e){(await fetch(e,{credentials:"include"})).ok}(`https://${e.host}/b`),e._isUsingEmulator=!0,e._protocol=a?"https":"http";const{mockUserToken:s}=r;s&&(e._overrideAuthToken="string"==typeof s?s:function(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n=t||"demo-project",r=e.iat||0,a=e.sub||e.user_id;if(!a)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const s={iss:`https://securetoken.google.com/${n}`,aud:n,iat:r,exp:r+3600,auth_time:r,sub:a,user_id:a,firebase:{sign_in_provider:"custom",identities:{}},...e};return[v(JSON.stringify({alg:"none",type:"JWT"})),v(JSON.stringify(s)),""].join(".")}(s,e.app.options.projectId))}class dn{constructor(e,t,n,r,a,s=!1){this.app=e,this._authProvider=t,this._appCheckProvider=n,this._url=r,this._firebaseVersion=a,this._isUsingEmulator=s,this._bucket=null,this._host=st,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=12e4,this._maxUploadRetryTime=6e5,this._requests=new Set,this._bucket=null!=r?xt.makeFromBucketSpec(r,this._host):ln(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,null!=this._url?this._bucket=xt.makeFromBucketSpec(this._url,e):this._bucket=ln(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){Et("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){Et("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(null!==t)return t.accessToken}return null}async _getAppCheckToken(){if(null!=(e=this.app)&&void 0!==e.settings&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;var e;const t=this._appCheckProvider.getImmediate({optional:!0});if(t){return(await t.getToken()).token}return null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new rn(this,e)}_makeRequest(e,t,n,r,a=!0){if(this._deleted)return new wt(gt());{const s=function(e,t,n,r,a,s,i=!0,o=!1){const l=jt(e.urlParams),c=e.url+l,d=Object.assign({},e.headers);return function(e,t){t&&(e["X-Firebase-GMPID"]=t)}(d,t),function(e,t){null!==t&&t.length>0&&(e.Authorization="Firebase "+t)}(d,n),function(e,t){e["X-Firebase-Storage-Version"]="webjs/"+(t??"AppManager")}(d,s),function(e,t){null!==t&&(e["X-Firebase-AppCheck"]=t)}(d,r),new Nt(c,e.method,d,e.body,e.successCodes,e.additionalRetryCodes,e.handler,e.errorHandler,e.timeout,e.progressCallback,a,i,o)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,this._appId,n,r,t,this._firebaseVersion,a,this._isUsingEmulator);return this._requests.add(s),s.getPromise().then(()=>this._requests.delete(s),()=>this._requests.delete(s)),s}}async makeRequestWithTokens(e,t){const[n,r]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,n,r).getPromise()}}const hn="@firebase/storage",pn="0.14.2",un="storage";function fn(e,t,n){return function(e,t,n){e._throwIfRoot("uploadBytes");const r=Qt(e.storage,e._location,Vt(),new Pt(t,!0),n);return e.storage.makeRequestWithTokens(r,nn).then(t=>({metadata:t,ref:e}))}(e=O(e),t,n)}function gn(e,{instanceIdentifier:t}){const n=e.getProvider("app").getImmediate(),r=e.getProvider("auth-internal"),a=e.getProvider("app-check-internal");return new dn(n,r,a,t,"12.11.0")}He(new L(un,gn,"PUBLIC").setMultipleInstances(!0)),Ge(hn,pn,""),Ge(hn,pn,"esm2020");
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Ge("firebase","12.11.0","app");const mn=function(e=function(e=Be){const t=ze.get(e);if(!t&&e===Be&&C())return Ke();if(!t)throw Ve.create("no-app",{appName:e});return t}(),t){const n=function(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}(e=O(e),un).getImmediate({identifier:t}),r=N("storage");return r&&function(e,t,n,r={}){cn(e,t,n,r)}(n,...r),n}(Ke({apiKey:"AIzaSyBrVhziOGwTUMkYdHgHAGCoJRlkyPLa6Wo",authDomain:"ghs-frontend.firebaseapp.com",projectId:"ghs-frontend",storageBucket:"ghs-frontend.firebasestorage.app",messagingSenderId:"187477774208",appId:"1:187477774208:web:0f7ca51c149a656e3ebb65"})),bn=async e=>{try{const a=(n=mn,r=`adhiveshana/${Date.now()}_${e.name}`,on(n=O(n),r)),s={contentType:"application/pdf"};await fn(a,e,s);return await(t=a,an(t=O(t)))}catch(a){throw a}var t,n,r},xn={date:"",description:"",department:""};function wn({open:e,onClose:t,onConfirm:r}){return e?n.jsx("div",{className:"ap-overlay",onClick:t,children:n.jsxs("div",{className:"ap-modal ap-modal-sm",onClick:e=>e.stopPropagation(),children:[n.jsx("div",{className:"ap-modal-icon ap-icon-danger",children:n.jsx(g,{size:22})}),n.jsx("h2",{className:"ap-modal-title",style:{color:"#dc2626"},children:"ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ"}),n.jsx("p",{className:"ap-modal-desc",children:"ನೀವು ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ."}),n.jsxs("div",{className:"ap-modal-actions",children:[n.jsx("button",{className:"ap-btn ap-btn-ghost",onClick:t,children:"ರದ್ದುಮಾಡಿ"}),n.jsx("button",{className:"ap-btn ap-btn-danger",onClick:()=>{r(),t()},children:"ಅಳಿಸಿ"})]})]})}):null}function _n({open:e,onClose:t,editData:r,onSave:a}){const[s,i]=h.useState(xn),[o,l]=h.useState(null);h.useEffect(()=>{i(r?{date:r.date||"",description:r.description||"",department:r.department||""}:xn),l(null)},[r,e]);const c=(e,t)=>i(n=>({...n,[e]:t}));return e?n.jsx("div",{className:"ap-overlay",onClick:t,children:n.jsxs("div",{className:"ap-modal ap-modal-lg",onClick:e=>e.stopPropagation(),children:[n.jsxs("div",{className:"ap-modal-header",children:[n.jsx("div",{className:"ap-modal-icon ap-icon-primary",children:r?n.jsx(f,{size:18}):n.jsx(m,{size:18})}),n.jsx("h2",{className:"ap-modal-title",children:r?"ದಾಖಲೆ ತಿದ್ದುಪಡಿ":"ಹೊಸ ದಾಖಲೆ ಸೇರಿಸಿ"})]}),n.jsxs("div",{className:"ap-form-grid",children:[n.jsxs("div",{className:"ap-field",children:[n.jsxs("label",{children:["ದಿನಾಂಕ ",n.jsx("span",{className:"ap-required",children:"*"})]}),n.jsx("input",{type:"date",value:s.date,onChange:e=>c("date",e.target.value)})]}),n.jsxs("div",{className:"ap-field",children:[n.jsx("label",{children:"ಇಲಾಖೆ"}),n.jsx("input",{placeholder:"ಇಲಾಖೆ",value:s.department,onChange:e=>c("department",e.target.value)})]}),n.jsxs("div",{className:"ap-field ap-full",children:[n.jsx("label",{children:"ವಿವರಣೆ"}),n.jsx("textarea",{rows:3,placeholder:"ವಿವರಣೆ ನಮೂದಿಸಿ...",value:s.description,onChange:e=>c("description",e.target.value)})]}),n.jsxs("div",{className:"ap-field ap-full",children:[n.jsxs("label",{children:["PDF ಫೈಲ್"," ",r&&n.jsx("span",{style:{color:"#94a3b8",fontWeight:400},children:"(ಹೊಸದು upload ಮಾಡಲು)"})]}),n.jsx("input",{type:"file",accept:"application/pdf",onChange:e=>{var t;return l((null==(t=e.target.files)?void 0:t[0])||null)}})]})]}),n.jsxs("div",{className:"ap-modal-actions",children:[n.jsx("button",{className:"ap-btn ap-btn-ghost",onClick:t,children:"ರದ್ದುಮಾಡಿ"}),n.jsx("button",{className:"ap-btn ap-btn-primary",onClick:()=>{s.date&&a(s,o)},children:"ಉಳಿಸಿ"})]})]})}):null}function yn(){const i=p(),{list:o=[]}=u(e),[l,c]=h.useState(""),[d,w]=h.useState(!1),[_,y]=h.useState(null),[v,E]=h.useState(null);h.useEffect(()=>{i(t())},[i]);const k=h.useMemo(()=>{const e=l.toLowerCase();return o.filter(t=>(t.description||"").toLowerCase().includes(e)||(t.department||"").toLowerCase().includes(e)||(t.date||"").toLowerCase().includes(e))},[o,l]);return n.jsxs(n.Fragment,{children:[n.jsx("style",{children:"\n        @keyframes ap-fade-in  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }\n        @keyframes ap-slide-up { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:none; } }\n\n        .ap-root {\n          display: flex; flex-direction: column;\n          height: calc(100vh - 158px);\n          min-height: 0;\n          background: #f0f4f8;\n          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;\n          overflow: hidden;\n        }\n\n        /* ── HEADER */\n        .ap-header {\n          background: #fff; border-bottom: 1px solid #e2e8f0;\n          padding: 10px 14px; flex-shrink: 0;\n          box-shadow: 0 2px 8px rgba(36,102,209,0.07);\n        }\n        .ap-header-top {\n          display: flex; align-items: center; justify-content: space-between; gap: 8px;\n          margin-bottom: 10px;\n        }\n        .ap-title {\n          font-size: 15px; font-weight: 700; color: #1a3d7c;\n          flex: 1; text-align: center;\n          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\n        }\n        .ap-title span { color: #2466d1; }\n        .ap-add-btn {\n          display: inline-flex; align-items: center; gap: 5px;\n          padding: 7px 14px; border-radius: 8px;\n          background: linear-gradient(135deg, #2466d1, #06b6d4);\n          color: #fff; border: none; cursor: pointer; font-size: 13px; font-weight: 600;\n          transition: opacity 0.15s, transform 0.1s;\n          box-shadow: 0 2px 8px rgba(36,102,209,0.28); flex-shrink: 0;\n        }\n        .ap-add-btn:hover { opacity: 0.9; transform: scale(1.03); }\n\n        /* ── FILTERS */\n        .ap-filters { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }\n        .ap-search-wrap { position: relative; flex: 1 1 160px; min-width: 0; }\n        .ap-search-wrap svg {\n          position: absolute; left: 10px; top: 50%; transform: translateY(-50%);\n          color: #94a3b8; font-size: 12px; pointer-events: none;\n        }\n        .ap-search-wrap input {\n          width: 100%; padding: 7px 10px 7px 32px;\n          border: 1px solid #e2e8f0; border-radius: 20px;\n          font-size: 13px; outline: none; background: #f8fafc; box-sizing: border-box;\n          transition: border-color 0.15s, box-shadow 0.15s;\n        }\n        .ap-search-wrap input:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.1); background: #fff; }\n\n        /* ── STATS */\n        .ap-stats { display: flex; gap: 10px; padding: 8px 14px 0; flex-shrink: 0; flex-wrap: wrap; }\n        .ap-stat-chip {\n          background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;\n          padding: 5px 12px; font-size: 12px; color: #64748b; font-weight: 500;\n          box-shadow: 0 1px 3px rgba(0,0,0,0.05);\n        }\n        .ap-stat-chip strong { color: #1a3d7c; font-size: 13px; }\n\n        /* ── TABLE WRAP */\n        .ap-table-wrap {\n          flex: 1; margin: 8px 0 0; min-height: 0;\n          display: flex; flex-direction: column; padding: 0 0 8px;\n        }\n        .ap-scroll {\n          flex: 1; min-height: 0; overflow-x: auto; overflow-y: auto;\n          border: 1px solid #e2e8f0; border-radius: 10px;\n          box-shadow: 0 2px 10px rgba(0,0,0,0.06); background: #fff;\n          scrollbar-width: thin; scrollbar-color: #c5c5c5 transparent;\n        }\n        .ap-scroll::-webkit-scrollbar { height: 6px; width: 6px; }\n        .ap-scroll::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 4px; }\n\n        /* ── TABLE */\n        .ap-table {\n          width: 100%; min-width: 700px;\n          border-collapse: collapse; table-layout: fixed;\n        }\n        .ap-table thead th {\n          background: linear-gradient(180deg, #06b6d4 0%, #2466d1 100%);\n          color: #fff; font-size: 12px; font-weight: 700;\n          padding: 10px 8px; text-align: center;\n          border: 1px solid rgba(255,255,255,0.2); white-space: nowrap;\n          position: sticky; top: 0; z-index: 10;\n          -webkit-print-color-adjust: exact; print-color-adjust: exact; line-height: 1.4;\n        }\n        .ap-table thead th.th-left { text-align: left; }\n        .ap-table tbody tr { animation: ap-fade-in 0.25s ease forwards; }\n        .ap-table tbody tr:nth-child(even) { background: #f8faff; }\n        .ap-table tbody tr:hover { background: #ddeeff; transition: background 0.12s; }\n        .ap-table tbody td {\n          border: 1px solid #D4D4D4; padding: 8px 9px;\n          font-size: 13px; color: #262626; line-height: 1.55;\n          vertical-align: middle; word-break: break-word;\n        }\n        .ap-table tbody td.td-center { text-align: center; }\n        .ap-table tbody td.td-num { font-weight: 700; color: #1a3d7c; text-align: center; }\n        .ap-empty td { text-align: center; padding: 48px 0; color: #94a3b8; font-size: 14px; }\n        .ap-action-cell { text-align: center; width: 72px; min-width: 72px; }\n        .ap-actions { display: flex; justify-content: center; gap: 10px; }\n        .ap-edit-btn { cursor: pointer; color: #2563eb; transition: transform 0.1s, color 0.1s; }\n        .ap-edit-btn:hover { color: #1d4ed8; transform: scale(1.2); }\n        .ap-del-btn  { cursor: pointer; color: #ef4444; transition: transform 0.1s, color 0.1s; }\n        .ap-del-btn:hover  { color: #b91c1c; transform: scale(1.2); }\n        .ap-pdf-link {\n          display: inline-flex; align-items: center; justify-content: center;\n          color: #dc2626; transition: transform 0.1s;\n        }\n        .ap-pdf-link:hover { transform: scale(1.2); }\n\n        /* ── OVERLAY / MODAL */\n        .ap-overlay {\n          position: fixed; inset: 0; background: rgba(0,0,0,0.45);\n          display: flex; justify-content: center; align-items: center;\n          z-index: 50; padding: 12px; animation: ap-fade-in 0.15s ease;\n        }\n        .ap-modal {\n          background: #fff; border-radius: 16px; padding: 24px; width: 100%;\n          box-shadow: 0 20px 60px rgba(0,0,0,0.2);\n          animation: ap-slide-up 0.2s ease; max-height: 90vh; overflow-y: auto;\n        }\n        .ap-modal-sm { max-width: 400px; text-align: center; }\n        .ap-modal-lg { max-width: 560px; }\n        .ap-modal-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }\n        .ap-modal-icon {\n          width: 38px; height: 38px; border-radius: 10px;\n          display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n        }\n        .ap-icon-primary { background: #eff6ff; color: #2466d1; }\n        .ap-icon-danger  { background: #fef2f2; color: #dc2626; margin: 0 auto 10px; border-radius: 50%; }\n        .ap-modal-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }\n        .ap-modal-desc  { font-size: 13px; color: #64748b; margin: 6px 0 20px; line-height: 1.6; }\n        .ap-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; padding-top: 14px; border-top: 1px solid #f1f5f9; }\n\n        /* ── FORM */\n        .ap-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }\n        .ap-field { display: flex; flex-direction: column; gap: 5px; }\n        .ap-field.ap-full { grid-column: 1 / -1; }\n        .ap-field label { font-size: 12px; font-weight: 600; color: #64748b; }\n        .ap-required { color: #ef4444; }\n        .ap-field input, .ap-field textarea, .ap-field select {\n          border: 1.5px solid #e2e8f0; border-radius: 8px;\n          padding: 8px 10px; font-size: 13px; outline: none;\n          transition: border-color 0.15s, box-shadow 0.15s;\n          background: #f8fafc; resize: none; font-family: inherit; color: #1e293b;\n        }\n        .ap-field input[type=\"file\"] { padding: 6px 10px; background: #fff; cursor: pointer; }\n        .ap-field input:focus, .ap-field textarea:focus, .ap-field select:focus {\n          border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.12); background: #fff;\n        }\n\n        /* ── BUTTONS */\n        .ap-btn {\n          padding: 8px 18px; border-radius: 8px;\n          font-size: 13px; font-weight: 600; border: none; cursor: pointer;\n          transition: opacity 0.15s, transform 0.1s;\n        }\n        .ap-btn:active { transform: scale(0.97); }\n        .ap-btn-primary {\n          background: linear-gradient(135deg, #2466d1, #06b6d4);\n          color: #fff; box-shadow: 0 2px 8px rgba(36,102,209,0.3);\n        }\n        .ap-btn-primary:hover { opacity: 0.9; }\n        .ap-btn-ghost { background: #f1f5f9; color: #64748b; }\n        .ap-btn-ghost:hover { background: #e2e8f0; }\n        .ap-btn-danger { background: #dc2626; color: #fff; }\n        .ap-btn-danger:hover { background: #b91c1c; }\n\n        @media (max-width: 600px) {\n          .ap-form-grid { grid-template-columns: 1fr; }\n          .ap-field.ap-full { grid-column: 1 / -1; }\n          .ap-title { font-size: 13px; }\n        }\n      "}),n.jsxs("div",{className:"ap-root",children:[n.jsxs("div",{className:"ap-header",children:[n.jsxs("div",{className:"ap-header-top",children:[n.jsxs("h1",{className:"ap-title",children:[n.jsx("span",{children:"ಪ್ರಶ್ನೋತ್ತರ"})," ದಾಖಲೆಗಳು"]}),n.jsxs("button",{className:"ap-add-btn",onClick:()=>{y(null),w(!0)},children:[n.jsx(m,{size:12})," ಸೇರಿಸಿ"]})]}),n.jsx("div",{className:"ap-filters",children:n.jsxs("div",{className:"ap-search-wrap",children:[n.jsx(b,{}),n.jsx("input",{placeholder:"ಹುಡುಕಿ... (ವಿವರಣೆ, ಇಲಾಖೆ, ದಿನಾಂಕ)",value:l,onChange:e=>c(e.target.value)})]})})]}),n.jsxs("div",{className:"ap-stats",children:[n.jsxs("div",{className:"ap-stat-chip",children:["ಒಟ್ಟು ದಾಖಲೆ: ",n.jsx("strong",{children:k.length})]}),l&&n.jsxs("div",{className:"ap-stat-chip",children:["ಫಿಲ್ಟರ್: ",n.jsxs("strong",{children:['"',l,'"']})]})]}),n.jsx("div",{className:"ap-table-wrap",children:n.jsx("div",{className:"ap-scroll",children:n.jsxs("table",{className:"ap-table",children:[n.jsxs("colgroup",{children:[n.jsx("col",{style:{width:48}}),n.jsx("col",{style:{width:110}}),n.jsx("col",{style:{width:140}}),n.jsx("col",{}),n.jsx("col",{style:{width:60}}),n.jsx("col",{style:{width:72}})]}),n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"ಕ್ರ.ಸಂ"}),n.jsx("th",{className:"th-left",children:"ದಿನಾಂಕ"}),n.jsx("th",{className:"th-left",children:"ಇಲಾಖೆ"}),n.jsx("th",{className:"th-left",children:"ವಿವರಣೆ"}),n.jsx("th",{children:"PDF"}),n.jsx("th",{children:"Action"})]})}),n.jsx("tbody",{children:0===k.length?n.jsx("tr",{className:"ap-empty",children:n.jsx("td",{colSpan:6,children:"ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ"})}):null==k?void 0:k.map((e,t)=>n.jsxs("tr",{children:[n.jsx("td",{className:"td-num",children:t+1}),n.jsx("td",{style:{whiteSpace:"nowrap"},children:e.date}),n.jsx("td",{children:e.department}),n.jsx("td",{children:e.description}),n.jsx("td",{className:"td-center",children:e.pdfUrl?n.jsx("a",{href:e.pdfUrl,target:"_blank",rel:"noreferrer",className:"ap-pdf-link",children:n.jsx(x,{size:18})}):n.jsx("span",{style:{color:"#94a3b8"},children:"—"})}),n.jsx("td",{className:"ap-action-cell",children:n.jsxs("div",{className:"ap-actions",children:[n.jsx(f,{size:16,className:"ap-edit-btn",onClick:()=>{y(e),w(!0)}}),n.jsx(g,{size:16,className:"ap-del-btn",onClick:()=>E(e._id)})]})})]},e._id))})]})})}),n.jsx(_n,{open:d,onClose:()=>{w(!1),y(null)},editData:_,onSave:async(e,n)=>{let s={...e};if(n){const e=await bn(n);s.pdfUrl=e,s.fileName=n.name}_?await i(r(_._id,s)):await i(a(s)),i(t()),w(!1),y(null)}}),n.jsx(wn,{open:!!v,onClose:()=>E(null),onConfirm:async()=>{v&&(await i(s(v)),i(t()),E(null))}})]})]})}const vn={date:"",type:"ಬಜೆಟ್ ಅಧಿವೇಶನ",department:"",description:""},En=["ಬಜೆಟ್ ಅಧಿವೇಶನ","ಮಳೆಗಾಲದ ಅಧಿವೇಶನ","ಚಳಿಗಾಲದ ಅಧಿವೇಶನ"];function kn({open:e,onClose:t,onConfirm:r}){return e?n.jsx("div",{className:"aq-overlay",onClick:t,children:n.jsxs("div",{className:"aq-modal aq-modal-sm",onClick:e=>e.stopPropagation(),children:[n.jsx("div",{className:"aq-modal-icon aq-icon-danger",children:n.jsx(g,{size:22})}),n.jsx("h2",{className:"aq-modal-title",style:{color:"#dc2626"},children:"ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ"}),n.jsx("p",{className:"aq-modal-desc",children:"ನೀವು ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ."}),n.jsxs("div",{className:"aq-modal-actions",children:[n.jsx("button",{className:"aq-btn aq-btn-ghost",onClick:t,children:"ರದ್ದುಮಾಡಿ"}),n.jsx("button",{className:"aq-btn aq-btn-danger",onClick:()=>{r(),t()},children:"ಅಳಿಸಿ"})]})]})}):null}function jn({open:e,onClose:t,editData:r,onSave:a}){const[s,i]=h.useState(vn);h.useEffect(()=>{i(r?{...r}:vn)},[r,e]);const o=(e,t)=>i(n=>({...n,[e]:t}));return e?n.jsx("div",{className:"aq-overlay",onClick:t,children:n.jsxs("div",{className:"aq-modal aq-modal-lg",onClick:e=>e.stopPropagation(),children:[n.jsxs("div",{className:"aq-modal-header",children:[n.jsx("div",{className:"aq-modal-icon aq-icon-primary",children:r?n.jsx(f,{size:18}):n.jsx(m,{size:18})}),n.jsx("h2",{className:"aq-modal-title",children:r?"ದಾಖಲೆ ತಿದ್ದುಪಡಿ":"ಹೊಸ ಪ್ರಶ್ನೆ ಸೇರಿಸಿ"})]}),n.jsxs("div",{className:"aq-form-grid",children:[n.jsxs("div",{className:"aq-field",children:[n.jsx("label",{children:"ದಿನಾಂಕ"}),n.jsx("input",{type:"date",value:s.date,onChange:e=>o("date",e.target.value)})]}),n.jsxs("div",{className:"aq-field",children:[n.jsxs("label",{children:["ಅಧಿವೇಶನ ಪ್ರಕಾರ ",n.jsx("span",{className:"aq-required",children:"*"})]}),n.jsx("select",{value:s.type,onChange:e=>o("type",e.target.value),children:En.map(e=>n.jsx("option",{children:e},e))})]}),n.jsxs("div",{className:"aq-field",children:[n.jsx("label",{children:"ಇಲಾಖೆ"}),n.jsx("input",{placeholder:"ಇಲಾಖೆ",value:s.department,onChange:e=>o("department",e.target.value)})]}),n.jsxs("div",{className:"aq-field aq-full",children:[n.jsxs("label",{children:["ವಿವರಣೆ ",n.jsx("span",{className:"aq-required",children:"*"})]}),n.jsx("textarea",{rows:4,placeholder:"ಪ್ರಶ್ನೆ / ವಿವರಣೆ ನಮೂದಿಸಿ...",value:s.description,onChange:e=>o("description",e.target.value)})]})]}),n.jsxs("div",{className:"aq-modal-actions",children:[n.jsx("button",{className:"aq-btn aq-btn-ghost",onClick:t,children:"ರದ್ದುಮಾಡಿ"}),n.jsx("button",{className:"aq-btn aq-btn-primary",onClick:()=>{s.type&&s.description&&a(s)},children:"ಉಳಿಸಿ"})]})]})}):null}function Nn(){const e=p(),{list:t=[]}=u(i),[r,a]=h.useState(""),[s,x]=h.useState(""),[w,_]=h.useState(!1),[y,v]=h.useState(null),[E,k]=h.useState(null);h.useEffect(()=>{e(o())},[e]);const j=h.useMemo(()=>{const e=e=>(e||"").toString().toLowerCase().replace(/\s+/g," ").trim(),n=e(r);return t.filter(t=>{const r=n.length<1||[t.type,t.department,t.description].some(t=>e(t).includes(n));return(!s||e(t.type)===e(s))&&r})},[t,r,s]);return n.jsxs(n.Fragment,{children:[n.jsx("style",{children:"\n        @keyframes aq-fade-in  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }\n        @keyframes aq-slide-up { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:none; } }\n\n        .aq-root {\n          display: flex; flex-direction: column;\n          height: calc(100vh - 158px);\n          min-height: 0;\n          background: #f0f4f8;\n          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;\n          overflow: hidden;\n        }\n\n        /* ── HEADER */\n        .aq-header {\n          background: #fff; border-bottom: 1px solid #e2e8f0;\n          padding: 10px 14px; flex-shrink: 0;\n          box-shadow: 0 2px 8px rgba(36,102,209,0.07);\n        }\n        .aq-header-top {\n          display: flex; align-items: center; justify-content: space-between; gap: 8px;\n          margin-bottom: 10px;\n        }\n        .aq-title {\n          font-size: 15px; font-weight: 700; color: #1a3d7c;\n          flex: 1; text-align: center;\n          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\n        }\n        .aq-title span { color: #2466d1; }\n        .aq-add-btn {\n          display: inline-flex; align-items: center; gap: 5px;\n          padding: 7px 14px; border-radius: 8px;\n          background: linear-gradient(135deg, #2466d1, #06b6d4);\n          color: #fff; border: none; cursor: pointer; font-size: 13px; font-weight: 600;\n          transition: opacity 0.15s, transform 0.1s;\n          box-shadow: 0 2px 8px rgba(36,102,209,0.28); flex-shrink: 0;\n        }\n        .aq-add-btn:hover { opacity: 0.9; transform: scale(1.03); }\n\n        /* ── FILTERS */\n        .aq-filters { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }\n        .aq-search-wrap { position: relative; flex: 1 1 160px; min-width: 0; }\n        .aq-search-wrap svg {\n          position: absolute; left: 10px; top: 50%; transform: translateY(-50%);\n          color: #94a3b8; font-size: 12px; pointer-events: none;\n        }\n        .aq-search-wrap input {\n          width: 100%; padding: 7px 10px 7px 32px;\n          border: 1px solid #e2e8f0; border-radius: 20px;\n          font-size: 13px; outline: none; background: #f8fafc; box-sizing: border-box;\n          transition: border-color 0.15s, box-shadow 0.15s;\n        }\n        .aq-search-wrap input:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.1); background: #fff; }\n\n        .aq-select {\n          padding: 7px 10px; border: 1px solid #e2e8f0; border-radius: 8px;\n          font-size: 13px; outline: none; background: #f8fafc; cursor: pointer; min-width: 160px;\n        }\n        .aq-select:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.1); }\n\n        /* ── STATS */\n        .aq-stats { display: flex; gap: 10px; padding: 8px 14px 0; flex-shrink: 0; flex-wrap: wrap; }\n        .aq-stat-chip {\n          background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;\n          padding: 5px 12px; font-size: 12px; color: #64748b; font-weight: 500;\n          box-shadow: 0 1px 3px rgba(0,0,0,0.05);\n        }\n        .aq-stat-chip strong { color: #1a3d7c; font-size: 13px; }\n\n        /* ── TABLE WRAP */\n        .aq-table-wrap {\n          flex: 1; margin: 8px 0 0; min-height: 0;\n          display: flex; flex-direction: column; padding: 0 0 8px;\n        }\n        .aq-scroll {\n          flex: 1; min-height: 0; overflow-x: auto; overflow-y: auto;\n          border: 1px solid #e2e8f0; border-radius: 10px;\n          box-shadow: 0 2px 10px rgba(0,0,0,0.06); background: #fff;\n          scrollbar-width: thin; scrollbar-color: #c5c5c5 transparent;\n        }\n        .aq-scroll::-webkit-scrollbar { height: 6px; width: 6px; }\n        .aq-scroll::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 4px; }\n\n        /* ── TABLE */\n        .aq-table {\n          width: 100%; min-width: 700px;\n          border-collapse: collapse; table-layout: fixed;\n        }\n        .aq-table thead th {\n          background: linear-gradient(180deg, #06b6d4 0%, #2466d1 100%);\n          color: #fff; font-size: 12px; font-weight: 700;\n          padding: 10px 8px; text-align: center;\n          border: 1px solid rgba(255,255,255,0.2); white-space: nowrap;\n          position: sticky; top: 0; z-index: 10;\n          -webkit-print-color-adjust: exact; print-color-adjust: exact; line-height: 1.4;\n        }\n        .aq-table thead th.th-left { text-align: left; }\n        .aq-table tbody tr { animation: aq-fade-in 0.25s ease forwards; }\n        .aq-table tbody tr:nth-child(even) { background: #f8faff; }\n        .aq-table tbody tr:hover { background: #ddeeff; transition: background 0.12s; }\n        .aq-table tbody td {\n          border: 1px solid #D4D4D4; padding: 8px 9px;\n          font-size: 13px; color: #262626; line-height: 1.55;\n          vertical-align: middle; word-break: break-word;\n        }\n        .aq-table tbody td.td-center { text-align: center; }\n        .aq-table tbody td.td-num { font-weight: 700; color: #1a3d7c; text-align: center; }\n\n        .aq-type-badge {\n          display: inline-block; padding: 2px 8px; border-radius: 12px;\n          font-size: 11px; font-weight: 600;\n          background: #eff6ff; color: #1d4ed8;\n          border: 1px solid #bfdbfe; white-space: nowrap;\n        }\n\n        .aq-empty td { text-align: center; padding: 48px 0; color: #94a3b8; font-size: 14px; }\n        .aq-action-cell { text-align: center; width: 72px; min-width: 72px; }\n        .aq-actions { display: flex; justify-content: center; gap: 10px; }\n        .aq-edit-btn { cursor: pointer; color: #2563eb; transition: transform 0.1s, color 0.1s; }\n        .aq-edit-btn:hover { color: #1d4ed8; transform: scale(1.2); }\n        .aq-del-btn  { cursor: pointer; color: #ef4444; transition: transform 0.1s, color 0.1s; }\n        .aq-del-btn:hover  { color: #b91c1c; transform: scale(1.2); }\n\n        /* ── OVERLAY / MODAL */\n        .aq-overlay {\n          position: fixed; inset: 0; background: rgba(0,0,0,0.45);\n          display: flex; justify-content: center; align-items: center;\n          z-index: 50; padding: 12px; animation: aq-fade-in 0.15s ease;\n        }\n        .aq-modal {\n          background: #fff; border-radius: 16px; padding: 24px; width: 100%;\n          box-shadow: 0 20px 60px rgba(0,0,0,0.2);\n          animation: aq-slide-up 0.2s ease; max-height: 90vh; overflow-y: auto;\n        }\n        .aq-modal-sm { max-width: 400px; text-align: center; }\n        .aq-modal-lg { max-width: 560px; }\n        .aq-modal-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }\n        .aq-modal-icon {\n          width: 38px; height: 38px; border-radius: 10px;\n          display: flex; align-items: center; justify-content: center; flex-shrink: 0;\n        }\n        .aq-icon-primary { background: #eff6ff; color: #2466d1; }\n        .aq-icon-danger  { background: #fef2f2; color: #dc2626; margin: 0 auto 10px; border-radius: 50%; }\n        .aq-modal-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }\n        .aq-modal-desc  { font-size: 13px; color: #64748b; margin: 6px 0 20px; line-height: 1.6; }\n        .aq-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; padding-top: 14px; border-top: 1px solid #f1f5f9; }\n\n        /* ── FORM */\n        .aq-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }\n        .aq-field { display: flex; flex-direction: column; gap: 5px; }\n        .aq-field.aq-full { grid-column: 1 / -1; }\n        .aq-field label { font-size: 12px; font-weight: 600; color: #64748b; }\n        .aq-required { color: #ef4444; }\n        .aq-field input, .aq-field textarea, .aq-field select {\n          border: 1.5px solid #e2e8f0; border-radius: 8px;\n          padding: 8px 10px; font-size: 13px; outline: none;\n          transition: border-color 0.15s, box-shadow 0.15s;\n          background: #f8fafc; resize: none; font-family: inherit; color: #1e293b;\n        }\n        .aq-field input:focus, .aq-field textarea:focus, .aq-field select:focus {\n          border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.12); background: #fff;\n        }\n\n        /* ── BUTTONS */\n        .aq-btn {\n          padding: 8px 18px; border-radius: 8px;\n          font-size: 13px; font-weight: 600; border: none; cursor: pointer;\n          transition: opacity 0.15s, transform 0.1s;\n        }\n        .aq-btn:active { transform: scale(0.97); }\n        .aq-btn-primary {\n          background: linear-gradient(135deg, #2466d1, #06b6d4);\n          color: #fff; box-shadow: 0 2px 8px rgba(36,102,209,0.3);\n        }\n        .aq-btn-primary:hover { opacity: 0.9; }\n        .aq-btn-ghost { background: #f1f5f9; color: #64748b; }\n        .aq-btn-ghost:hover { background: #e2e8f0; }\n        .aq-btn-danger { background: #dc2626; color: #fff; }\n        .aq-btn-danger:hover { background: #b91c1c; }\n\n        @media (max-width: 600px) {\n          .aq-form-grid { grid-template-columns: 1fr; }\n          .aq-field.aq-full { grid-column: 1 / -1; }\n          .aq-title { font-size: 13px; }\n          .aq-select { min-width: 130px; }\n        }\n      "}),n.jsxs("div",{className:"aq-root",children:[n.jsxs("div",{className:"aq-header",children:[n.jsxs("div",{className:"aq-header-top",children:[n.jsxs("h1",{className:"aq-title",children:[n.jsx("span",{children:"ಅಧಿವೇಶನ"})," ಪ್ರಶ್ನೆಗಳು"]}),n.jsxs("button",{className:"aq-add-btn",onClick:()=>{v(null),_(!0)},children:[n.jsx(m,{size:12})," ಸೇರಿಸಿ"]})]}),n.jsxs("div",{className:"aq-filters",children:[n.jsxs("div",{className:"aq-search-wrap",children:[n.jsx(b,{}),n.jsx("input",{placeholder:"ಹುಡುಕಿ... (ವಿವರಣೆ, ಇಲಾಖೆ)",value:r,onChange:e=>a(e.target.value)})]}),n.jsxs("select",{className:"aq-select",value:s,onChange:e=>x(e.target.value),children:[n.jsx("option",{value:"",children:"ಎಲ್ಲಾ ಅಧಿವೇಶನ"}),En.map(e=>n.jsx("option",{value:e,children:e},e))]})]})]}),n.jsxs("div",{className:"aq-stats",children:[n.jsxs("div",{className:"aq-stat-chip",children:["ಒಟ್ಟು ಪ್ರಶ್ನೆಗಳು: ",n.jsx("strong",{children:j.length})]}),r&&n.jsxs("div",{className:"aq-stat-chip",children:["ಫಿಲ್ಟರ್: ",n.jsxs("strong",{children:['"',r,'"']})]})]}),n.jsx("div",{className:"aq-table-wrap",children:n.jsx("div",{className:"aq-scroll",children:n.jsxs("table",{className:"aq-table",children:[n.jsxs("colgroup",{children:[n.jsx("col",{style:{width:48}}),n.jsx("col",{style:{width:160}}),n.jsx("col",{style:{width:140}}),n.jsx("col",{}),n.jsx("col",{style:{width:72}})]}),n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx("th",{children:"ಕ್ರ.ಸಂ"}),n.jsx("th",{className:"th-left",children:"ಅಧಿವೇಶನ ಪ್ರಕಾರ"}),n.jsx("th",{className:"th-left",children:"ಇಲಾಖೆ"}),n.jsx("th",{className:"th-left",children:"ವಿವರಣೆ"}),n.jsx("th",{children:"Action"})]})}),n.jsx("tbody",{children:0===j.length?n.jsx("tr",{className:"aq-empty",children:n.jsx("td",{colSpan:5,children:"ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ"})}):j.map((e,t)=>n.jsxs("tr",{children:[n.jsx("td",{className:"td-num",children:t+1}),n.jsx("td",{className:"td-center",children:n.jsx("span",{className:"aq-type-badge",children:e.type})}),n.jsx("td",{children:e.department}),n.jsx("td",{children:e.description}),n.jsx("td",{className:"aq-action-cell",children:n.jsxs("div",{className:"aq-actions",children:[n.jsx(f,{size:16,className:"aq-edit-btn",onClick:()=>{v(e),_(!0)}}),n.jsx(g,{size:16,className:"aq-del-btn",onClick:()=>k(e._id)})]})})]},e._id))})]})})}),n.jsx(jn,{open:w,onClose:()=>{_(!1),v(null)},editData:y,onSave:async t=>{y?await e(l(y._id,t)):await e(c(t)),e(o()),_(!1),v(null)}}),n.jsx(kn,{open:!!E,onClose:()=>k(null),onConfirm:async()=>{E&&(await e(d(E)),e(o()),k(null))}})]})]})}function Cn(){const[e,t]=h.useState("pdf");return n.jsxs(n.Fragment,{children:[n.jsx("style",{children:"\n        .adhi-main {\n          display: flex;\n          flex-direction: column;\n          height: calc(100vh - 158px);\n          min-height: 0;\n          background: #f0f4f8;\n          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;\n          overflow: hidden;\n        }\n\n        /* ── TAB BAR */\n        .adhi-tabs {\n          display: flex;\n          gap: 6px;\n          padding: 10px 14px 0;\n          background: #f0f4f8;\n          flex-shrink: 0;\n        }\n\n        .adhi-tab {\n          padding: 8px 20px;\n          border-radius: 8px 8px 0 0;\n          font-size: 13px;\n          font-weight: 600;\n          border: none;\n          cursor: pointer;\n          transition: all 0.15s ease;\n          position: relative;\n          outline: none;\n        }\n\n        .adhi-tab-active {\n          background: linear-gradient(135deg, #2466d1, #06b6d4);\n          color: #fff;\n          box-shadow: 0 -2px 10px rgba(36,102,209,0.25);\n        }\n        .adhi-tab-active::after {\n          content: '';\n          position: absolute;\n          bottom: -1px;\n          left: 0; right: 0;\n          height: 2px;\n          background: #fff;\n        }\n\n        .adhi-tab-inactive {\n          background: #e2e8f0;\n          color: #64748b;\n        }\n        .adhi-tab-inactive:hover {\n          background: #cbd5e1;\n          color: #1e293b;\n        }\n\n        /* ── CONTENT */\n        .adhi-content {\n          flex: 1;\n          min-height: 0;\n          background: #f0f4f8;\n          display: flex;\n          flex-direction: column;\n        }\n\n        /* Override child page heights when nested */\n        .adhi-content .ap-root,\n        .adhi-content .aq-root {\n          height: 100% !important;\n        }\n\n        @media (max-width: 480px) {\n          .adhi-tab {\n            padding: 7px 14px;\n            font-size: 12px;\n          }\n          .adhi-tabs {\n            padding: 8px 10px 0;\n          }\n        }\n      "}),n.jsxs("div",{className:"adhi-main",children:[n.jsxs("div",{className:"adhi-tabs",children:[n.jsx("button",{className:"adhi-tab "+("pdf"===e?"adhi-tab-active":"adhi-tab-inactive"),onClick:()=>t("pdf"),children:"ಪ್ರಶ್ನೋತ್ತರಗಳ ದಾಖಲೆ"}),n.jsx("button",{className:"adhi-tab "+("question"===e?"adhi-tab-active":"adhi-tab-inactive"),onClick:()=>t("question"),children:"ಕೇಳಬಹುದಾದ ಪ್ರಶ್ನೆಗಳು"})]}),n.jsx("div",{className:"adhi-content",children:"pdf"===e?n.jsx(yn,{}):n.jsx(Nn,{})})]})]})}export{Cn as default};
