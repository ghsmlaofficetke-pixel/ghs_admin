import{u as Se,c as ke,aj as ut,r as w,ak as Y,j as a,al as ht,am as ft,an as pt,ao as mt,ap as gt,aq as bt,ar as _t,as as xt}from"./index-a5eb3a39.js";import{b as je,a as Oe}from"./index-48ca19c3.js";import{m as Be,j as wt}from"./index-3a09be8d.js";const yt=()=>{};/**
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
 */const Pe=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let r=t.charCodeAt(s);r<128?e[n++]=r:r<2048?(e[n++]=r>>6|192,e[n++]=r&63|128):(r&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=r>>18|240,e[n++]=r>>12&63|128,e[n++]=r>>6&63|128,e[n++]=r&63|128):(e[n++]=r>>12|224,e[n++]=r>>6&63|128,e[n++]=r&63|128)}return e},Et=function(t){const e=[];let n=0,s=0;for(;n<t.length;){const r=t[n++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const o=t[n++];e[s++]=String.fromCharCode((r&31)<<6|o&63)}else if(r>239&&r<365){const o=t[n++],i=t[n++],c=t[n++],l=((r&7)<<18|(o&63)<<12|(i&63)<<6|c&63)-65536;e[s++]=String.fromCharCode(55296+(l>>10)),e[s++]=String.fromCharCode(56320+(l&1023))}else{const o=t[n++],i=t[n++];e[s++]=String.fromCharCode((r&15)<<12|(o&63)<<6|i&63)}}return e.join("")},Ue={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<t.length;r+=3){const o=t[r],i=r+1<t.length,c=i?t[r+1]:0,l=r+2<t.length,d=l?t[r+2]:0,f=o>>2,b=(o&3)<<4|c>>4;let m=(c&15)<<2|d>>6,h=d&63;l||(h=64,i||(m=64)),s.push(n[f],n[b],n[m],n[h])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Pe(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Et(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<t.length;){const o=n[t.charAt(r++)],c=r<t.length?n[t.charAt(r)]:0;++r;const d=r<t.length?n[t.charAt(r)]:64;++r;const b=r<t.length?n[t.charAt(r)]:64;if(++r,o==null||c==null||d==null||b==null)throw new Nt;const m=o<<2|c>>4;if(s.push(m),d!==64){const h=c<<4&240|d>>2;if(s.push(h),b!==64){const g=d<<6&192|b;s.push(g)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Nt extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const vt=function(t){const e=Pe(t);return Ue.encodeByteArray(e,!0)},W=function(t){return vt(t).replace(/\./g,"")},It=function(t){try{return Ue.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Ct(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const At=()=>Ct().__FIREBASE_DEFAULTS__,Tt=()=>{if(typeof process>"u"||typeof process.env>"u")return;const t={}.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Rt=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&It(t[1]);return e&&JSON.parse(e)},Le=()=>{try{return yt()||At()||Tt()||Rt()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Dt=t=>{var e,n;return(n=(e=Le())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},St=t=>{const e=Dt(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),s]:[e.substring(0,n),s]},Me=()=>{var t;return(t=Le())==null?void 0:t.config};/**
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
 */class kt{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}/**
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
 */function jt(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},s=e||"demo-project",r=t.iat||0,o=t.sub||t.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const i={iss:`https://securetoken.google.com/${s}`,aud:s,iat:r,exp:r+3600,auth_time:r,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}},...t},c="";return[W(JSON.stringify(n)),W(JSON.stringify(i)),c].join(".")}function Ot(){try{return typeof indexedDB=="object"}catch{return!1}}function Bt(){return new Promise((t,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var o;e(((o=r.error)==null?void 0:o.message)||"")}}catch(n){e(n)}})}/**
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
 */const Pt="FirebaseError";class U extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=Pt,Object.setPrototypeOf(this,U.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,$e.prototype.create)}}class $e{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},r=`${this.service}/${e}`,o=this.errors[e],i=o?Ut(o,s):"Error",c=`${this.serviceName}: ${i} (${r}).`;return new U(r,c,s)}}function Ut(t,e){return t.replace(Lt,(n,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const Lt=/\{\$([^}]+)}/g;function re(t,e){if(t===e)return!0;const n=Object.keys(t),s=Object.keys(e);for(const r of n){if(!s.includes(r))return!1;const o=t[r],i=e[r];if(be(o)&&be(i)){if(!re(o,i))return!1}else if(o!==i)return!1}for(const r of s)if(!n.includes(r))return!1;return!0}function be(t){return t!==null&&typeof t=="object"}/**
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
 */function K(t){return t&&t._delegate?t._delegate:t}/**
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
 */function Fe(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Mt(t){return(await fetch(t,{credentials:"include"})).ok}class ${constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const j="[DEFAULT]";/**
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
 */class $t{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new kt;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(e==null?void 0:e.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(r){if(s)return null;throw r}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Ht(e))try{this.getOrInitializeService({instanceIdentifier:j})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const o=this.getOrInitializeService({instanceIdentifier:r});s.resolve(o)}catch{}}}}clearInstance(e=j){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=j){return this.instances.has(e)}getOptions(e=j){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[o,i]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(o);s===c&&i.resolve(r)}return r}onInit(e,n){const s=this.normalizeInstanceIdentifier(n),r=this.onInitCallbacks.get(s)??new Set;r.add(e),this.onInitCallbacks.set(s,r);const o=this.instances.get(s);return o&&e(o,s),()=>{r.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const r of s)try{r(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Ft(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=j){return this.component?this.component.multipleInstances?e:j:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Ft(t){return t===j?void 0:t}function Ht(t){return t.instantiationMode==="EAGER"}/**
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
 */class zt{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new $t(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var p;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(p||(p={}));const Vt={debug:p.DEBUG,verbose:p.VERBOSE,info:p.INFO,warn:p.WARN,error:p.ERROR,silent:p.SILENT},Wt=p.INFO,qt={[p.DEBUG]:"log",[p.VERBOSE]:"log",[p.INFO]:"info",[p.WARN]:"warn",[p.ERROR]:"error"},Gt=(t,e,...n)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),r=qt[e];if(r)console[r](`[${s}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Kt{constructor(e){this.name=e,this._logLevel=Wt,this._logHandler=Gt,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in p))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Vt[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,p.DEBUG,...e),this._logHandler(this,p.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,p.VERBOSE,...e),this._logHandler(this,p.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,p.INFO,...e),this._logHandler(this,p.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,p.WARN,...e),this._logHandler(this,p.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,p.ERROR,...e),this._logHandler(this,p.ERROR,...e)}}const Xt=(t,e)=>e.some(n=>t instanceof n);let _e,xe;function Jt(){return _e||(_e=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Yt(){return xe||(xe=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const He=new WeakMap,oe=new WeakMap,ze=new WeakMap,Z=new WeakMap,ue=new WeakMap;function Zt(t){const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("success",o),t.removeEventListener("error",i)},o=()=>{n(S(t.result)),r()},i=()=>{s(t.error),r()};t.addEventListener("success",o),t.addEventListener("error",i)});return e.then(n=>{n instanceof IDBCursor&&He.set(n,t)}).catch(()=>{}),ue.set(e,t),e}function Qt(t){if(oe.has(t))return;const e=new Promise((n,s)=>{const r=()=>{t.removeEventListener("complete",o),t.removeEventListener("error",i),t.removeEventListener("abort",i)},o=()=>{n(),r()},i=()=>{s(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",o),t.addEventListener("error",i),t.addEventListener("abort",i)});oe.set(t,e)}let ae={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return oe.get(t);if(e==="objectStoreNames")return t.objectStoreNames||ze.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return S(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function en(t){ae=t(ae)}function tn(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=t.call(Q(this),e,...n);return ze.set(s,e.sort?e.sort():[e]),S(s)}:Yt().includes(t)?function(...e){return t.apply(Q(this),e),S(He.get(this))}:function(...e){return S(t.apply(Q(this),e))}}function nn(t){return typeof t=="function"?tn(t):(t instanceof IDBTransaction&&Qt(t),Xt(t,Jt())?new Proxy(t,ae):t)}function S(t){if(t instanceof IDBRequest)return Zt(t);if(Z.has(t))return Z.get(t);const e=nn(t);return e!==t&&(Z.set(t,e),ue.set(e,t)),e}const Q=t=>ue.get(t);function sn(t,e,{blocked:n,upgrade:s,blocking:r,terminated:o}={}){const i=indexedDB.open(t,e),c=S(i);return s&&i.addEventListener("upgradeneeded",l=>{s(S(i.result),l.oldVersion,l.newVersion,S(i.transaction),l)}),n&&i.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),c.then(l=>{o&&l.addEventListener("close",()=>o()),r&&l.addEventListener("versionchange",d=>r(d.oldVersion,d.newVersion,d))}).catch(()=>{}),c}const rn=["get","getKey","getAll","getAllKeys","count"],on=["put","add","delete","clear"],ee=new Map;function we(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(ee.get(e))return ee.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,r=on.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(r||rn.includes(n)))return;const o=async function(i,...c){const l=this.transaction(i,r?"readwrite":"readonly");let d=l.store;return s&&(d=d.index(c.shift())),(await Promise.all([d[n](...c),r&&l.done]))[0]};return ee.set(e,o),o}en(t=>({...t,get:(e,n,s)=>we(e,n)||t.get(e,n,s),has:(e,n)=>!!we(e,n)||t.has(e,n)}));/**
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
 */class an{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(cn(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function cn(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const ie="@firebase/app",ye="0.14.10";/**
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
 */const R=new Kt("@firebase/app"),ln="@firebase/app-compat",dn="@firebase/analytics-compat",un="@firebase/analytics",hn="@firebase/app-check-compat",fn="@firebase/app-check",pn="@firebase/auth",mn="@firebase/auth-compat",gn="@firebase/database",bn="@firebase/data-connect",_n="@firebase/database-compat",xn="@firebase/functions",wn="@firebase/functions-compat",yn="@firebase/installations",En="@firebase/installations-compat",Nn="@firebase/messaging",vn="@firebase/messaging-compat",In="@firebase/performance",Cn="@firebase/performance-compat",An="@firebase/remote-config",Tn="@firebase/remote-config-compat",Rn="@firebase/storage",Dn="@firebase/storage-compat",Sn="@firebase/firestore",kn="@firebase/ai",jn="@firebase/firestore-compat",On="firebase",Bn="12.11.0";/**
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
 */const ce="[DEFAULT]",Pn={[ie]:"fire-core",[ln]:"fire-core-compat",[un]:"fire-analytics",[dn]:"fire-analytics-compat",[fn]:"fire-app-check",[hn]:"fire-app-check-compat",[pn]:"fire-auth",[mn]:"fire-auth-compat",[gn]:"fire-rtdb",[bn]:"fire-data-connect",[_n]:"fire-rtdb-compat",[xn]:"fire-fn",[wn]:"fire-fn-compat",[yn]:"fire-iid",[En]:"fire-iid-compat",[Nn]:"fire-fcm",[vn]:"fire-fcm-compat",[In]:"fire-perf",[Cn]:"fire-perf-compat",[An]:"fire-rc",[Tn]:"fire-rc-compat",[Rn]:"fire-gcs",[Dn]:"fire-gcs-compat",[Sn]:"fire-fst",[jn]:"fire-fst-compat",[kn]:"fire-vertex","fire-js":"fire-js",[On]:"fire-js-all"};/**
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
 */const q=new Map,Un=new Map,le=new Map;function Ee(t,e){try{t.container.addComponent(e)}catch(n){R.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function G(t){const e=t.name;if(le.has(e))return R.debug(`There were multiple attempts to register component ${e}.`),!1;le.set(e,t);for(const n of q.values())Ee(n,t);for(const n of Un.values())Ee(n,t);return!0}function Ln(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Mn(t){return t==null?!1:t.settings!==void 0}/**
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
 */const $n={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},k=new $e("app","Firebase",$n);/**
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
 */class Fn{constructor(e,n,s){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new $("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw k.create("app-deleted",{appName:this._name})}}/**
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
 */const Hn=Bn;function Ve(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const s={name:ce,automaticDataCollectionEnabled:!0,...e},r=s.name;if(typeof r!="string"||!r)throw k.create("bad-app-name",{appName:String(r)});if(n||(n=Me()),!n)throw k.create("no-options");const o=q.get(r);if(o){if(re(n,o.options)&&re(s,o.config))return o;throw k.create("duplicate-app",{appName:r})}const i=new zt(r);for(const l of le.values())i.addComponent(l);const c=new Fn(n,s,i);return q.set(r,c),c}function zn(t=ce){const e=q.get(t);if(!e&&t===ce&&Me())return Ve();if(!e)throw k.create("no-app",{appName:t});return e}function P(t,e,n){let s=Pn[t]??t;n&&(s+=`-${n}`);const r=s.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const i=[`Unable to register library "${s}" with version "${e}":`];r&&i.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&o&&i.push("and"),o&&i.push(`version name "${e}" contains illegal characters (whitespace or "/")`),R.warn(i.join(" "));return}G(new $(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
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
 */const Vn="firebase-heartbeat-database",Wn=1,F="firebase-heartbeat-store";let te=null;function We(){return te||(te=sn(Vn,Wn,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(F)}catch(n){console.warn(n)}}}}).catch(t=>{throw k.create("idb-open",{originalErrorMessage:t.message})})),te}async function qn(t){try{const n=(await We()).transaction(F),s=await n.objectStore(F).get(qe(t));return await n.done,s}catch(e){if(e instanceof U)R.warn(e.message);else{const n=k.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});R.warn(n.message)}}}async function Ne(t,e){try{const s=(await We()).transaction(F,"readwrite");await s.objectStore(F).put(e,qe(t)),await s.done}catch(n){if(n instanceof U)R.warn(n.message);else{const s=k.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});R.warn(s.message)}}}function qe(t){return`${t.name}!${t.options.appId}`}/**
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
 */const Gn=1024,Kn=30;class Xn{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Yn(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,n;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=ve();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(i=>i.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:r}),this._heartbeatsCache.heartbeats.length>Kn){const i=Zn(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(i,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){R.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=ve(),{heartbeatsToSend:s,unsentEntries:r}=Jn(this._heartbeatsCache.heartbeats),o=W(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(n){return R.warn(n),""}}}function ve(){return new Date().toISOString().substring(0,10)}function Jn(t,e=Gn){const n=[];let s=t.slice();for(const r of t){const o=n.find(i=>i.agent===r.agent);if(o){if(o.dates.push(r.date),Ie(n)>e){o.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),Ie(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class Yn{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ot()?Bt().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await qn(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Ne(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Ne(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function Ie(t){return W(JSON.stringify({version:2,heartbeats:t})).length}function Zn(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let s=1;s<t.length;s++)t[s].date<n&&(n=t[s].date,e=s);return e}/**
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
 */function Qn(t){G(new $("platform-logger",e=>new an(e),"PRIVATE")),G(new $("heartbeat",e=>new Xn(e),"PRIVATE")),P(ie,ye,t),P(ie,ye,"esm2020"),P("fire-js","")}Qn("");/**
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
 */const Ge="firebasestorage.googleapis.com",Ke="storageBucket",es=2*60*1e3,ts=10*60*1e3;/**
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
 */class x extends U{constructor(e,n,s=0){super(ne(e),`Firebase Storage: ${n} (${ne(e)})`),this.status_=s,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,x.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return ne(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var _;(function(t){t.UNKNOWN="unknown",t.OBJECT_NOT_FOUND="object-not-found",t.BUCKET_NOT_FOUND="bucket-not-found",t.PROJECT_NOT_FOUND="project-not-found",t.QUOTA_EXCEEDED="quota-exceeded",t.UNAUTHENTICATED="unauthenticated",t.UNAUTHORIZED="unauthorized",t.UNAUTHORIZED_APP="unauthorized-app",t.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",t.INVALID_CHECKSUM="invalid-checksum",t.CANCELED="canceled",t.INVALID_EVENT_NAME="invalid-event-name",t.INVALID_URL="invalid-url",t.INVALID_DEFAULT_BUCKET="invalid-default-bucket",t.NO_DEFAULT_BUCKET="no-default-bucket",t.CANNOT_SLICE_BLOB="cannot-slice-blob",t.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",t.NO_DOWNLOAD_URL="no-download-url",t.INVALID_ARGUMENT="invalid-argument",t.INVALID_ARGUMENT_COUNT="invalid-argument-count",t.APP_DELETED="app-deleted",t.INVALID_ROOT_OPERATION="invalid-root-operation",t.INVALID_FORMAT="invalid-format",t.INTERNAL_ERROR="internal-error",t.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(_||(_={}));function ne(t){return"storage/"+t}function he(){const t="An unknown error occurred, please check the error payload for server response.";return new x(_.UNKNOWN,t)}function ns(t){return new x(_.OBJECT_NOT_FOUND,"Object '"+t+"' does not exist.")}function ss(t){return new x(_.QUOTA_EXCEEDED,"Quota for bucket '"+t+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function rs(){const t="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new x(_.UNAUTHENTICATED,t)}function os(){return new x(_.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function as(t){return new x(_.UNAUTHORIZED,"User does not have permission to access '"+t+"'.")}function is(){return new x(_.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function cs(){return new x(_.CANCELED,"User canceled the upload/download.")}function ls(t){return new x(_.INVALID_URL,"Invalid URL '"+t+"'.")}function ds(t){return new x(_.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+t+"'.")}function us(){return new x(_.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+Ke+"' property when initializing the app?")}function hs(){return new x(_.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function fs(){return new x(_.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function ps(t){return new x(_.UNSUPPORTED_ENVIRONMENT,`${t} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function de(t){return new x(_.INVALID_ARGUMENT,t)}function Xe(){return new x(_.APP_DELETED,"The Firebase app was deleted.")}function ms(t){return new x(_.INVALID_ROOT_OPERATION,"The operation '"+t+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function M(t,e){return new x(_.INVALID_FORMAT,"String does not match format '"+t+"': "+e)}function L(t){throw new x(_.INTERNAL_ERROR,"Internal error: "+t)}/**
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
 */class I{constructor(e,n){this.bucket=e,this.path_=n}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,n){let s;try{s=I.makeFromUrl(e,n)}catch{return new I(e,"")}if(s.path==="")return s;throw ds(e)}static makeFromUrl(e,n){let s=null;const r="([A-Za-z0-9.\\-_]+)";function o(N){N.path.charAt(N.path.length-1)==="/"&&(N.path_=N.path_.slice(0,-1))}const i="(/(.*))?$",c=new RegExp("^gs://"+r+i,"i"),l={bucket:1,path:3};function d(N){N.path_=decodeURIComponent(N.path)}const f="v[A-Za-z0-9_]+",b=n.replace(/[.]/g,"\\."),m="(/([^?#]*).*)?$",h=new RegExp(`^https?://${b}/${f}/b/${r}/o${m}`,"i"),g={bucket:1,path:3},y=n===Ge?"(?:storage.googleapis.com|storage.cloud.google.com)":n,u="([^?#]*)",C=new RegExp(`^https?://${y}/${r}/${u}`,"i"),v=[{regex:c,indices:l,postModify:o},{regex:h,indices:g,postModify:d},{regex:C,indices:{bucket:1,path:2},postModify:d}];for(let N=0;N<v.length;N++){const H=v[N],X=H.regex.exec(e);if(X){const dt=X[H.indices.bucket];let J=X[H.indices.path];J||(J=""),s=new I(dt,J),H.postModify(s);break}}if(s==null)throw ls(e);return s}}class gs{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
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
 */function bs(t,e,n){let s=1,r=null,o=null,i=!1,c=0;function l(){return c===2}let d=!1;function f(...u){d||(d=!0,e.apply(null,u))}function b(u){r=setTimeout(()=>{r=null,t(h,l())},u)}function m(){o&&clearTimeout(o)}function h(u,...C){if(d){m();return}if(u){m(),f.call(null,u,...C);return}if(l()||i){m(),f.call(null,u,...C);return}s<64&&(s*=2);let v;c===1?(c=2,v=0):v=(s+Math.random())*1e3,b(v)}let g=!1;function y(u){g||(g=!0,m(),!d&&(r!==null?(u||(c=2),clearTimeout(r),b(0)):u||(c=1)))}return b(0),o=setTimeout(()=>{i=!0,y(!0)},n),y}function _s(t){t(!1)}/**
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
 */function xs(t){return t!==void 0}function ws(t){return typeof t=="object"&&!Array.isArray(t)}function fe(t){return typeof t=="string"||t instanceof String}function Ce(t){return pe()&&t instanceof Blob}function pe(){return typeof Blob<"u"}function Ae(t,e,n,s){if(s<e)throw de(`Invalid value for '${t}'. Expected ${e} or greater.`);if(s>n)throw de(`Invalid value for '${t}'. Expected ${n} or less.`)}/**
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
 */function me(t,e,n){let s=e;return n==null&&(s=`https://${e}`),`${n}://${s}/v0${t}`}function Je(t){const e=encodeURIComponent;let n="?";for(const s in t)if(t.hasOwnProperty(s)){const r=e(s)+"="+e(t[s]);n=n+r+"&"}return n=n.slice(0,-1),n}var O;(function(t){t[t.NO_ERROR=0]="NO_ERROR",t[t.NETWORK_ERROR=1]="NETWORK_ERROR",t[t.ABORT=2]="ABORT"})(O||(O={}));/**
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
 */function ys(t,e){const n=t>=500&&t<600,r=[408,429].indexOf(t)!==-1,o=e.indexOf(t)!==-1;return n||r||o}/**
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
 */class Es{constructor(e,n,s,r,o,i,c,l,d,f,b,m=!0,h=!1){this.url_=e,this.method_=n,this.headers_=s,this.body_=r,this.successCodes_=o,this.additionalRetryCodes_=i,this.callback_=c,this.errorCallback_=l,this.timeout_=d,this.progressCallback_=f,this.connectionFactory_=b,this.retry=m,this.isUsingEmulator=h,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((g,y)=>{this.resolve_=g,this.reject_=y,this.start_()})}start_(){const e=(s,r)=>{if(r){s(!1,new z(!1,null,!0));return}const o=this.connectionFactory_();this.pendingConnection_=o;const i=c=>{const l=c.loaded,d=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(l,d)};this.progressCallback_!==null&&o.addUploadProgressListener(i),o.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&o.removeUploadProgressListener(i),this.pendingConnection_=null;const c=o.getErrorCode()===O.NO_ERROR,l=o.getStatus();if(!c||ys(l,this.additionalRetryCodes_)&&this.retry){const f=o.getErrorCode()===O.ABORT;s(!1,new z(!1,null,f));return}const d=this.successCodes_.indexOf(l)!==-1;s(!0,new z(d,o))})},n=(s,r)=>{const o=this.resolve_,i=this.reject_,c=r.connection;if(r.wasSuccessCode)try{const l=this.callback_(c,c.getResponse());xs(l)?o(l):o()}catch(l){i(l)}else if(c!==null){const l=he();l.serverResponse=c.getErrorText(),this.errorCallback_?i(this.errorCallback_(c,l)):i(l)}else if(r.canceled){const l=this.appDelete_?Xe():cs();i(l)}else{const l=is();i(l)}};this.canceled_?n(!1,new z(!1,null,!0)):this.backoffId_=bs(e,n,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&_s(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class z{constructor(e,n,s){this.wasSuccessCode=e,this.connection=n,this.canceled=!!s}}function Ns(t,e){e!==null&&e.length>0&&(t.Authorization="Firebase "+e)}function vs(t,e){t["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function Is(t,e){e&&(t["X-Firebase-GMPID"]=e)}function Cs(t,e){e!==null&&(t["X-Firebase-AppCheck"]=e)}function As(t,e,n,s,r,o,i=!0,c=!1){const l=Je(t.urlParams),d=t.url+l,f=Object.assign({},t.headers);return Is(f,e),Ns(f,n),vs(f,o),Cs(f,s),new Es(d,t.method,f,t.body,t.successCodes,t.additionalRetryCodes,t.handler,t.errorHandler,t.timeout,t.progressCallback,r,i,c)}/**
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
 */function Ts(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function Rs(...t){const e=Ts();if(e!==void 0){const n=new e;for(let s=0;s<t.length;s++)n.append(t[s]);return n.getBlob()}else{if(pe())return new Blob(t);throw new x(_.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function Ds(t,e,n){return t.webkitSlice?t.webkitSlice(e,n):t.mozSlice?t.mozSlice(e,n):t.slice?t.slice(e,n):null}/**
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
 */function Ss(t){if(typeof atob>"u")throw ps("base-64");return atob(t)}/**
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
 */const T={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class se{constructor(e,n){this.data=e,this.contentType=n||null}}function ks(t,e){switch(t){case T.RAW:return new se(Ye(e));case T.BASE64:case T.BASE64URL:return new se(Ze(t,e));case T.DATA_URL:return new se(Os(e),Bs(e))}throw he()}function Ye(t){const e=[];for(let n=0;n<t.length;n++){let s=t.charCodeAt(n);if(s<=127)e.push(s);else if(s<=2047)e.push(192|s>>6,128|s&63);else if((s&64512)===55296)if(!(n<t.length-1&&(t.charCodeAt(n+1)&64512)===56320))e.push(239,191,189);else{const o=s,i=t.charCodeAt(++n);s=65536|(o&1023)<<10|i&1023,e.push(240|s>>18,128|s>>12&63,128|s>>6&63,128|s&63)}else(s&64512)===56320?e.push(239,191,189):e.push(224|s>>12,128|s>>6&63,128|s&63)}return new Uint8Array(e)}function js(t){let e;try{e=decodeURIComponent(t)}catch{throw M(T.DATA_URL,"Malformed data URL.")}return Ye(e)}function Ze(t,e){switch(t){case T.BASE64:{const r=e.indexOf("-")!==-1,o=e.indexOf("_")!==-1;if(r||o)throw M(t,"Invalid character '"+(r?"-":"_")+"' found: is it base64url encoded?");break}case T.BASE64URL:{const r=e.indexOf("+")!==-1,o=e.indexOf("/")!==-1;if(r||o)throw M(t,"Invalid character '"+(r?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let n;try{n=Ss(e)}catch(r){throw r.message.includes("polyfill")?r:M(t,"Invalid character found")}const s=new Uint8Array(n.length);for(let r=0;r<n.length;r++)s[r]=n.charCodeAt(r);return s}class Qe{constructor(e){this.base64=!1,this.contentType=null;const n=e.match(/^data:([^,]+)?,/);if(n===null)throw M(T.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const s=n[1]||null;s!=null&&(this.base64=Ps(s,";base64"),this.contentType=this.base64?s.substring(0,s.length-7):s),this.rest=e.substring(e.indexOf(",")+1)}}function Os(t){const e=new Qe(t);return e.base64?Ze(T.BASE64,e.rest):js(e.rest)}function Bs(t){return new Qe(t).contentType}function Ps(t,e){return t.length>=e.length?t.substring(t.length-e.length)===e:!1}/**
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
 */class D{constructor(e,n){let s=0,r="";Ce(e)?(this.data_=e,s=e.size,r=e.type):e instanceof ArrayBuffer?(n?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),s=this.data_.length):e instanceof Uint8Array&&(n?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),s=e.length),this.size_=s,this.type_=r}size(){return this.size_}type(){return this.type_}slice(e,n){if(Ce(this.data_)){const s=this.data_,r=Ds(s,e,n);return r===null?null:new D(r)}else{const s=new Uint8Array(this.data_.buffer,e,n-e);return new D(s,!0)}}static getBlob(...e){if(pe()){const n=e.map(s=>s instanceof D?s.data_:s);return new D(Rs.apply(null,n))}else{const n=e.map(i=>fe(i)?ks(T.RAW,i).data:i.data_);let s=0;n.forEach(i=>{s+=i.byteLength});const r=new Uint8Array(s);let o=0;return n.forEach(i=>{for(let c=0;c<i.length;c++)r[o++]=i[c]}),new D(r,!0)}}uploadData(){return this.data_}}/**
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
 */function et(t){let e;try{e=JSON.parse(t)}catch{return null}return ws(e)?e:null}/**
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
 */function Us(t){if(t.length===0)return null;const e=t.lastIndexOf("/");return e===-1?"":t.slice(0,e)}function Ls(t,e){const n=e.split("/").filter(s=>s.length>0).join("/");return t.length===0?n:t+"/"+n}function tt(t){const e=t.lastIndexOf("/",t.length-2);return e===-1?t:t.slice(e+1)}/**
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
 */function Ms(t,e){return e}class E{constructor(e,n,s,r){this.server=e,this.local=n||e,this.writable=!!s,this.xform=r||Ms}}let V=null;function $s(t){return!fe(t)||t.length<2?t:tt(t)}function nt(){if(V)return V;const t=[];t.push(new E("bucket")),t.push(new E("generation")),t.push(new E("metageneration")),t.push(new E("name","fullPath",!0));function e(o,i){return $s(i)}const n=new E("name");n.xform=e,t.push(n);function s(o,i){return i!==void 0?Number(i):i}const r=new E("size");return r.xform=s,t.push(r),t.push(new E("timeCreated")),t.push(new E("updated")),t.push(new E("md5Hash",null,!0)),t.push(new E("cacheControl",null,!0)),t.push(new E("contentDisposition",null,!0)),t.push(new E("contentEncoding",null,!0)),t.push(new E("contentLanguage",null,!0)),t.push(new E("contentType",null,!0)),t.push(new E("metadata","customMetadata",!0)),V=t,V}function Fs(t,e){function n(){const s=t.bucket,r=t.fullPath,o=new I(s,r);return e._makeStorageReference(o)}Object.defineProperty(t,"ref",{get:n})}function Hs(t,e,n){const s={};s.type="file";const r=n.length;for(let o=0;o<r;o++){const i=n[o];s[i.local]=i.xform(s,e[i.server])}return Fs(s,t),s}function st(t,e,n){const s=et(e);return s===null?null:Hs(t,s,n)}function zs(t,e,n,s){const r=et(e);if(r===null||!fe(r.downloadTokens))return null;const o=r.downloadTokens;if(o.length===0)return null;const i=encodeURIComponent;return o.split(",").map(d=>{const f=t.bucket,b=t.fullPath,m="/b/"+i(f)+"/o/"+i(b),h=me(m,n,s),g=Je({alt:"media",token:d});return h+g})[0]}function Vs(t,e){const n={},s=e.length;for(let r=0;r<s;r++){const o=e[r];o.writable&&(n[o.server]=t[o.local])}return JSON.stringify(n)}class rt{constructor(e,n,s,r){this.url=e,this.method=n,this.handler=s,this.timeout=r,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
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
 */function ot(t){if(!t)throw he()}function Ws(t,e){function n(s,r){const o=st(t,r,e);return ot(o!==null),o}return n}function qs(t,e){function n(s,r){const o=st(t,r,e);return ot(o!==null),zs(o,r,t.host,t._protocol)}return n}function at(t){function e(n,s){let r;return n.getStatus()===401?n.getErrorText().includes("Firebase App Check token is invalid")?r=os():r=rs():n.getStatus()===402?r=ss(t.bucket):n.getStatus()===403?r=as(t.path):r=s,r.status=n.getStatus(),r.serverResponse=s.serverResponse,r}return e}function Gs(t){const e=at(t);function n(s,r){let o=e(s,r);return s.getStatus()===404&&(o=ns(t.path)),o.serverResponse=r.serverResponse,o}return n}function Ks(t,e,n){const s=e.fullServerUrl(),r=me(s,t.host,t._protocol),o="GET",i=t.maxOperationRetryTime,c=new rt(r,o,qs(t,n),i);return c.errorHandler=Gs(e),c}function Xs(t,e){return t&&t.contentType||e&&e.type()||"application/octet-stream"}function Js(t,e,n){const s=Object.assign({},n);return s.fullPath=t.path,s.size=e.size(),s.contentType||(s.contentType=Xs(null,e)),s}function Ys(t,e,n,s,r){const o=e.bucketOnlyServerUrl(),i={"X-Goog-Upload-Protocol":"multipart"};function c(){let v="";for(let N=0;N<2;N++)v=v+Math.random().toString().slice(2);return v}const l=c();i["Content-Type"]="multipart/related; boundary="+l;const d=Js(e,s,r),f=Vs(d,n),b="--"+l+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+f+`\r
--`+l+`\r
Content-Type: `+d.contentType+`\r
\r
`,m=`\r
--`+l+"--",h=D.getBlob(b,s,m);if(h===null)throw hs();const g={name:d.fullPath},y=me(o,t.host,t._protocol),u="POST",C=t.maxUploadRetryTime,A=new rt(y,u,Ws(t,n),C);return A.urlParams=g,A.headers=i,A.body=h.uploadData(),A.errorHandler=at(e),A}class Zs{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=O.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=O.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=O.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,n,s,r,o){if(this.sent_)throw L("cannot .send() more than once");if(Fe(e)&&s&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(n,e,!0),o!==void 0)for(const i in o)o.hasOwnProperty(i)&&this.xhr_.setRequestHeader(i,o[i].toString());return r!==void 0?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw L("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw L("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw L("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw L("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class Qs extends Zs{initXhr(){this.xhr_.responseType="text"}}function it(){return new Qs}/**
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
 */class B{constructor(e,n){this._service=e,n instanceof I?this._location=n:this._location=I.makeFromUrl(n,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,n){return new B(e,n)}get root(){const e=new I(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return tt(this._location.path)}get storage(){return this._service}get parent(){const e=Us(this._location.path);if(e===null)return null;const n=new I(this._location.bucket,e);return new B(this._service,n)}_throwIfRoot(e){if(this._location.path==="")throw ms(e)}}function er(t,e,n){t._throwIfRoot("uploadBytes");const s=Ys(t.storage,t._location,nt(),new D(e,!0),n);return t.storage.makeRequestWithTokens(s,it).then(r=>({metadata:r,ref:t}))}function tr(t){t._throwIfRoot("getDownloadURL");const e=Ks(t.storage,t._location,nt());return t.storage.makeRequestWithTokens(e,it).then(n=>{if(n===null)throw fs();return n})}function nr(t,e){const n=Ls(t._location.path,e),s=new I(t._location.bucket,n);return new B(t.storage,s)}/**
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
 */function sr(t){return/^[A-Za-z]+:\/\//.test(t)}function rr(t,e){return new B(t,e)}function ct(t,e){if(t instanceof ge){const n=t;if(n._bucket==null)throw us();const s=new B(n,n._bucket);return e!=null?ct(s,e):s}else return e!==void 0?nr(t,e):t}function or(t,e){if(e&&sr(e)){if(t instanceof ge)return rr(t,e);throw de("To use ref(service, url), the first argument must be a Storage instance.")}else return ct(t,e)}function Te(t,e){const n=e==null?void 0:e[Ke];return n==null?null:I.makeFromBucketSpec(n,t)}function ar(t,e,n,s={}){t.host=`${e}:${n}`;const r=Fe(e);r&&Mt(`https://${t.host}/b`),t._isUsingEmulator=!0,t._protocol=r?"https":"http";const{mockUserToken:o}=s;o&&(t._overrideAuthToken=typeof o=="string"?o:jt(o,t.app.options.projectId))}class ge{constructor(e,n,s,r,o,i=!1){this.app=e,this._authProvider=n,this._appCheckProvider=s,this._url=r,this._firebaseVersion=o,this._isUsingEmulator=i,this._bucket=null,this._host=Ge,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=es,this._maxUploadRetryTime=ts,this._requests=new Set,r!=null?this._bucket=I.makeFromBucketSpec(r,this._host):this._bucket=Te(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=I.makeFromBucketSpec(this._url,e):this._bucket=Te(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){Ae("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){Ae("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const n=await e.getToken();if(n!==null)return n.accessToken}return null}async _getAppCheckToken(){if(Mn(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new B(this,e)}_makeRequest(e,n,s,r,o=!0){if(this._deleted)return new gs(Xe());{const i=As(e,this._appId,s,r,n,this._firebaseVersion,o,this._isUsingEmulator);return this._requests.add(i),i.getPromise().then(()=>this._requests.delete(i),()=>this._requests.delete(i)),i}}async makeRequestWithTokens(e,n){const[s,r]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,n,s,r).getPromise()}}const Re="@firebase/storage",De="0.14.2";/**
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
 */const lt="storage";function ir(t,e,n){return t=K(t),er(t,e,n)}function cr(t){return t=K(t),tr(t)}function lr(t,e){return t=K(t),or(t,e)}function dr(t=zn(),e){t=K(t);const s=Ln(t,lt).getImmediate({identifier:e}),r=St("storage");return r&&ur(s,...r),s}function ur(t,e,n,s={}){ar(t,e,n,s)}function hr(t,{instanceIdentifier:e}){const n=t.getProvider("app").getImmediate(),s=t.getProvider("auth-internal"),r=t.getProvider("app-check-internal");return new ge(n,s,r,e,Hn)}function fr(){G(new $(lt,hr,"PUBLIC").setMultipleInstances(!0)),P(Re,De,""),P(Re,De,"esm2020")}fr();var pr="firebase",mr="12.11.0";/**
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
 */P(pr,mr,"app");const gr={apiKey:"AIzaSyBrVhziOGwTUMkYdHgHAGCoJRlkyPLa6Wo",authDomain:"ghs-frontend.firebaseapp.com",projectId:"ghs-frontend",storageBucket:"ghs-frontend.firebasestorage.app",messagingSenderId:"187477774208",appId:"1:187477774208:web:0f7ca51c149a656e3ebb65"},br=Ve(gr),_r=dr(br),xr=async t=>{try{const e=lr(_r,`adhiveshana/${Date.now()}_${t.name}`);return await ir(e,t,{contentType:"application/pdf"}),await cr(e)}catch(e){throw console.error("Upload error:",e),e}},wr=({close:t,editData:e,onSave:n})=>{const[s,r]=w.useState({date:"",description:"",department:""}),[o,i]=w.useState(null);return w.useEffect(()=>{e&&r({date:e.date||"",description:e.description||"",department:e.department||""})},[e]),a.jsx("div",{className:"fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-3",onClick:t,children:a.jsxs("div",{className:"bg-white rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-xl",onClick:c=>c.stopPropagation(),children:[a.jsx("h2",{className:"text-lg font-semibold text-gray-800",children:e?"ಪ್ರಶ್ನೋತ್ತರಗಳ ತಿದ್ದುಪಡಿ":"ಪ್ರಶ್ನೋತ್ತರಗಳನ್ನು ಸೇರಿಸಿ"}),a.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[a.jsx("input",{type:"date",value:s.date,onChange:c=>r({...s,date:c.target.value}),className:"border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"}),a.jsx("input",{placeholder:"ಇಲಾಖೆ",value:s.department,onChange:c=>r({...s,department:c.target.value}),className:"border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"}),a.jsx("textarea",{placeholder:"ವಿವರಣೆ",value:s.description,onChange:c=>r({...s,description:c.target.value}),className:"border border-slate-400 p-2 rounded text-sm col-span-full focus:ring-2 focus:ring-blue-100 outline-none"}),a.jsx("input",{type:"file",accept:"application/pdf",onChange:c=>{var l;return i(((l=c.target.files)==null?void 0:l[0])||null)},className:"border border-slate-400 p-2 rounded text-sm col-span-full focus:ring-2 focus:ring-blue-100 outline-none bg-white"})]}),a.jsxs("div",{className:"flex justify-end gap-2 pt-2",children:[a.jsx("button",{onClick:t,className:"px-4 py-2 border rounded text-sm hover:bg-gray-100",children:"ರದ್ದು"}),a.jsx("button",{onClick:()=>n(s,o),className:"px-5 py-2 rounded text-sm text-white bg-gradient-to-r from-[#2466d1] to-cyan-500 hover:scale-105 transition",children:"ಉಳಿಸಿ"})]})]})})};function yr(){const t=Se(),{list:e=[]}=ke(ut),[n,s]=w.useState(""),[r,o]=w.useState(!1),[i,c]=w.useState(null),[l,d]=w.useState(null);w.useEffect(()=>{t(Y())},[t]);const f=w.useMemo(()=>{const h=n.toLowerCase();return e.filter(g=>{var y,u;return((y=g.description)==null?void 0:y.toLowerCase().includes(h))||((u=g.department)==null?void 0:u.toLowerCase().includes(h))})},[e,n]),b=async(h,g)=>{let y={...h};if(g){const u=await xr(g);y.pdfUrl=u,y.fileName=g.name}i?await t(ht(i._id,y)):await t(ft(y)),t(Y()),o(!1),c(null)},m=async()=>{l&&(await t(pt(l)),t(Y()),d(null))};return a.jsxs("div",{className:"flex flex-col h-[calc(100vh-230px)] bg-gray-100",children:[a.jsxs("div",{className:"bg-white shadow px-3 py-3 sticky top-0 z-30",children:[a.jsxs("div",{className:"flex items-center justify-between",children:[a.jsx("button",{onClick:()=>window.history.back(),className:"w-9 h-9 flex items-center sm:hidden justify-center rounded-full bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white",children:a.jsx(Be,{size:14})}),a.jsx("h1",{className:"font-bold text-[12px] sm:text-[16px] sm:text-start text-center",children:"ಕೇಳಲಾದ ಪ್ರಶ್ನೋತ್ತರಗಳ ದಾಖಲೆಗಳು"}),a.jsx("button",{onClick:()=>{c(null),o(!0)},className:"px-3 py-1 rounded bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white text-sm",children:"+ ಸೇರಿಸಿ"})]}),a.jsx("input",{placeholder:"ಹುಡುಕಿ...",value:n,onChange:h=>s(h.target.value),className:"mt-2 w-full border p-2 rounded text-sm"})]}),a.jsx("div",{className:"flex-1 pt-2 min-h-0",children:a.jsx("div",{className:"bg-white rounded-xl shadow h-full flex flex-col",children:a.jsx("div",{className:"overflow-auto border rounded flex-1",children:a.jsxs("table",{className:"min-w-full table-fixed border text-sm",children:[a.jsx("thead",{className:"bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white sticky top-0 z-20",children:a.jsxs("tr",{children:[a.jsx("th",{className:"border p-2 w-[70px]",children:"Sl.No"}),a.jsx("th",{className:"border p-2 w-[130px]",children:"ದಿನಾಂಕ"}),a.jsx("th",{className:"border p-2 w-[160px]",children:"ಇಲಾಖೆ"}),a.jsx("th",{className:"border p-2 min-w-[250px] max-w-[350px]",children:"ವಿವರಣೆ"}),a.jsx("th",{className:"border p-2 w-[80px] text-center",children:"PDF"}),a.jsx("th",{className:"border p-2 w-[100px] text-center",children:"ಕ್ರಿಯೆ"})]})}),a.jsx("tbody",{children:(f==null?void 0:f.length)===0?a.jsx("tr",{children:a.jsx("td",{colSpan:6,className:"p-6 text-center text-gray-400",children:"ಡೇಟಾ ಇಲ್ಲ"})}):f==null?void 0:f.map((h,g)=>a.jsxs("tr",{className:"hover:bg-gray-50",children:[a.jsx("td",{className:"border p-2 text-center",children:g+1}),a.jsx("td",{className:"border p-2 whitespace-nowrap",children:h.date}),a.jsx("td",{className:"border p-2 break-words",children:h.department}),a.jsx("td",{className:"border p-2 break-words leading-6 max-w-[350px]",children:h.description}),a.jsx("td",{className:"border p-2 text-center",children:h.pdfUrl?a.jsx("a",{href:h.pdfUrl,target:"_blank",children:a.jsx(wt,{className:"text-red-500 text-lg mx-auto"})}):"-"}),a.jsx("td",{className:"border p-2 text-center",children:a.jsxs("div",{className:"flex justify-center gap-3",children:[a.jsx(je,{onClick:()=>{c(h),o(!0)},className:"text-blue-500 cursor-pointer"}),a.jsx(Oe,{onClick:()=>d(h._id),className:"text-red-500 cursor-pointer"})]})})]},h._id))})]})})})}),l&&a.jsx("div",{className:"fixed inset-0 bg-black/40 flex items-center justify-center z-50",onClick:()=>d(null),children:a.jsxs("div",{className:"bg-white p-5 rounded-xl w-full max-w-sm shadow-lg",onClick:h=>h.stopPropagation(),children:[a.jsx("h2",{className:"text-lg font-bold mb-3 text-red-600",children:"ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ"}),a.jsxs("p",{className:"text-sm text-gray-700 mb-4",children:["ನೀವು ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?",a.jsx("br",{}),"ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ."]}),a.jsxs("div",{className:"flex justify-end gap-2",children:[a.jsx("button",{onClick:()=>d(null),className:"px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm",children:"ರದ್ದುಮಾಡಿ"}),a.jsx("button",{onClick:m,className:"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm",children:"ಅಳಿಸಿ"})]})]})}),r&&a.jsx(wr,{editData:i,close:()=>{o(!1),c(null)},onSave:b})]})}const Er=({close:t,editData:e,onSave:n})=>{const[s,r]=w.useState({date:"",type:"ಬಜೆಟ್ ಅಧಿವೇಶನ",department:"",description:""});return w.useEffect(()=>{e&&r(e)},[e]),a.jsx("div",{className:"fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-3",onClick:t,children:a.jsxs("div",{className:"bg-white rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-xl",onClick:o=>o.stopPropagation(),children:[a.jsx("h2",{className:"text-lg font-semibold text-gray-800",children:e?"ತಿದ್ದುಪಡಿ":"ಹೊಸ ಪ್ರಶ್ನೆ"}),a.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[a.jsxs("select",{value:s.type,onChange:o=>r({...s,type:o.target.value}),className:"border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none",children:[a.jsx("option",{children:"ಬಜೆಟ್ ಅಧಿವೇಶನ"}),a.jsx("option",{children:"ಮಳೆಗಾಲದ ಅಧಿವೇಶನ"}),a.jsx("option",{children:"ಚಳಿಗಾಲದ ಅಧಿವೇಶನ"})]}),a.jsx("input",{placeholder:"ಇಲಾಖೆ",value:s.department,onChange:o=>r({...s,department:o.target.value}),className:"border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"}),a.jsx("textarea",{placeholder:"ವಿವರಣೆ",value:s.description,onChange:o=>r({...s,description:o.target.value}),className:"border border-slate-400 p-2 rounded text-sm col-span-full focus:ring-2 focus:ring-blue-100 outline-none"})]}),a.jsxs("div",{className:"flex justify-end gap-2 pt-2",children:[a.jsx("button",{onClick:t,className:"px-4 py-2 border rounded text-sm hover:bg-gray-100",children:"ರದ್ದು"}),a.jsx("button",{onClick:()=>n(s),className:"px-5 py-2 rounded text-sm text-white bg-gradient-to-r from-[#2466d1] to-cyan-500 hover:scale-105 transition",children:"ಉಳಿಸಿ"})]})]})})};function Nr(){const t=Se(),{list:e=[]}=ke(mt),[n,s]=w.useState(""),[r,o]=w.useState(!1),[i,c]=w.useState(null),[l,d]=w.useState(null),[f,b]=w.useState(1),m=10;w.useEffect(()=>{t(gt())},[]);const h=w.useMemo(()=>{const u=n.toLowerCase();return e.filter(C=>{var A,v;return((A=C.description)==null?void 0:A.toLowerCase().includes(u))||((v=C.department)==null?void 0:v.toLowerCase().includes(u))})},[e,n]);Math.ceil(h.length/m);const g=w.useMemo(()=>{const u=(f-1)*m;return h.slice(u,u+m)},[h,f]),y=async u=>{i?await t(_t(i._id,u)):await t(xt(u)),o(!1),c(null)};return a.jsxs("div",{className:"flex flex-col h-[calc(100vh-240px)] bg-gray-100",children:[a.jsxs("div",{className:"bg-white shadow px-3 py-3 sticky top-0 z-30",children:[a.jsxs("div",{className:"flex items-center justify-between sm:hidden",children:[a.jsx("button",{onClick:()=>window.history.back(),className:"w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white",children:a.jsx(Be,{size:14})}),a.jsx("h1",{className:"font-semibold text-[12px] flex-1 text-center",children:"ಅಧಿವೇಶನದಲ್ಲಿ ಕೇಳಬಹುದಾದ ಪ್ರಶ್ನೆಗಳು"}),a.jsx("button",{onClick:()=>{c(null),o(!0)},className:"w-20 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white",children:"+ ಸೇರಿಸಿ"})]}),a.jsx("div",{className:"mt-2 sm:hidden",children:a.jsx("input",{placeholder:"ಹುಡುಕಿ...",value:n,onChange:u=>{s(u.target.value),b(1)},className:"w-full border p-2 rounded text-sm"})}),a.jsxs("div",{className:"hidden sm:flex items-center justify-between gap-4",children:[a.jsx("h1",{className:"font-bold text-[16px] text-start",children:"ಅಧಿವೇಶನದಲ್ಲಿ ಕೇಳಬಹುದಾದ ಪ್ರಶ್ನೆಗಳು"}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("input",{placeholder:"ಹುಡುಕಿ...",value:n,onChange:u=>{s(u.target.value),b(1)},className:"border px-3 py-1 rounded text-sm w-64"}),a.jsx("button",{onClick:()=>{c(null),o(!0)},className:"bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white px-4 py-1 rounded text-sm whitespace-nowrap",children:"+ ಸೇರಿಸಿ"})]})]})]}),a.jsx("div",{className:"flex-1 pt-3 min-h-0",children:a.jsx("div",{className:"bg-white rounded-xl shadow flex flex-col h-full",children:a.jsx("div",{className:"overflow-auto border rounded flex-1",children:a.jsxs("table",{className:"min-w-full table-fixed border text-sm",children:[a.jsx("thead",{className:"bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white sticky top-0 z-20",children:a.jsxs("tr",{children:[a.jsx("th",{className:"border p-2 w-[80px] text-center",children:"Sl.No"}),a.jsx("th",{className:"border p-2 w-[150px]",children:"ಪ್ರಕಾರ"}),a.jsx("th",{className:"border p-2 w-[150px]",children:"ಇಲಾಖೆ"}),a.jsx("th",{className:"border p-2 min-w-[250px] max-w-[350px]",children:"ವಿವರಣೆ"}),a.jsx("th",{className:"border p-2 w-[100px] text-center",children:"ಕ್ರಿಯೆ"})]})}),a.jsx("tbody",{children:g.length===0?a.jsx("tr",{children:a.jsx("td",{colSpan:5,className:"text-center p-6 text-gray-400",children:"ಡೇಟಾ ಇಲ್ಲ"})}):g.map((u,C)=>a.jsxs("tr",{className:"hover:bg-gray-50",children:[a.jsx("td",{className:"border p-2 text-center",children:(f-1)*m+C+1}),a.jsx("td",{className:"border p-2 break-words",children:u.type}),a.jsx("td",{className:"border p-2 break-words",children:u.department}),a.jsx("td",{className:"border p-2 break-words max-w-[350px]",children:u.description}),a.jsx("td",{className:"border p-2 text-center",children:a.jsxs("div",{className:"flex justify-center gap-3",children:[a.jsx(je,{onClick:()=>{c(u),o(!0)},className:"cursor-pointer text-blue-500"}),a.jsx(Oe,{onClick:()=>d(u._id),className:"cursor-pointer text-red-500"})]})})]},u._id))})]})})})}),r&&a.jsx(Er,{editData:i,close:()=>{o(!1),c(null)},onSave:y}),l&&a.jsx("div",{className:"fixed inset-0 bg-black/40 flex items-center justify-center z-50",onClick:()=>d(null),children:a.jsxs("div",{className:"bg-white p-5 rounded-xl w-full max-w-sm shadow-lg",onClick:u=>u.stopPropagation(),children:[a.jsx("h2",{className:"text-lg font-bold mb-3 text-red-600",children:"ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ"}),a.jsxs("p",{className:"text-sm text-gray-700 mb-4",children:["ನೀವು ಈ ದಾಖಲೆ ಅನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?",a.jsx("br",{}),"ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ."]}),a.jsxs("div",{className:"flex justify-end gap-2",children:[a.jsx("button",{onClick:()=>d(null),className:"px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm",children:"ರದ್ದುಮಾಡಿ"}),a.jsx("button",{onClick:async()=>{await t(bt(l)),d(null)},className:"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm",children:"ಅಳಿಸಿ"})]})]})})]})}function Ar(){const[t,e]=w.useState("pdf");return a.jsxs("div",{className:"p-2 s",children:[a.jsxs("div",{className:"flex gap-3 mb-6 font-bold",children:[a.jsx("button",{onClick:()=>e("pdf"),className:`px-4 py-2 rounded ${t==="pdf"?"bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white font-bold":"bg-gray-200"}`,children:"ಪ್ರಶ್ನೋತ್ತರಗಳು"}),a.jsx("button",{onClick:()=>e("question"),className:`px-4 py-2 rounded ${t==="question"?"bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white":"bg-gray-200"}`,children:"ಕೇಳಬಹುದಾದ ಪ್ರಶ್ನೆಗಳು"})]}),t==="pdf"?a.jsx(yr,{}):a.jsx(Nr,{})]})}export{Ar as default};
