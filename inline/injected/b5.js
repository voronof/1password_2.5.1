(function () {
	'use strict';

	const e=()=>function(){if("undefined"!=typeof window)return window;if("undefined"!=typeof globalThis)return globalThis;throw new Error("unable to locate global object")}().crypto.getRandomValues(new Uint32Array(1))[0].toString(36);class t{constructor(){this.request=e=>new Promise(((t,n)=>{chrome.runtime.sendMessage(e,(s=>{"Success"===s.type?t(s.data):n(new Error(`Error response received for message <${e.name}>`));}));})),this.on=(e,t)=>{function n(n,s,i){return !(!n.name||n.name!==e)&&(new Promise((e=>e(t(n.data)))).then(i).catch((e=>{console.warn(`Caught error handling <${n.name}> message`);})),!0)}return chrome.runtime.onMessage.addListener(n),n},this.off=(e,t)=>{chrome.runtime.onMessage.removeListener(t);};}}class n{constructor(){this.uuid=e(),this.callbacks={},this.request=e=>new Promise((t=>{const s=n.generateId();this.callbacks[s]=t,this._sendMessage(Object.assign({callbackId:s},e));})),this.on=(e,t)=>this._register((n=>{n.name&&n.name===e&&Promise.resolve(t(n.data)).then((e=>{this._sendMessage(Object.assign(Object.assign({},n),{data:e}));}));})),this.off=(e,t)=>{this._deregister(e,t);},this.listenForResponses=()=>{this._register((e=>{"callbackId"in e&&e.callbackId in this.callbacks&&(this.callbacks[e.callbackId](e.data),delete this.callbacks[e.callbackId]);}));},this._sendMessage.bind(this),this._register.bind(this),this._deregister.bind(this),this.listenForResponses();}}n.generateId=()=>window.crypto.getRandomValues(new Uint32Array(1))[0];class s extends n{_sendMessage(e){}_register(e){var t;function n(e){e.data.outgoing;}return null===(t=window.top)||void 0===t||t.addEventListener("message",n),n}_deregister(e,t){}}class i extends n{static isSafariAppExtension(){return "undefined"!=typeof safari&&void 0!==safari.extension}_sendMessage(e){const t={callbackId:e.callbackId,uuid:this.uuid,outgoing:!0,frameOrigin:window.location.origin,message:{name:e.name,data:e.data}};safari.extension.dispatchMessage("message",t);}_register(e){const t=this.uuid;function n(n){const s=n.message;!s||s.uuid&&s.uuid!==t||e({callbackId:s.callbackId,name:s.message.name,data:s.message.data});}return safari.self.addEventListener("message",n),n}_deregister(e,t){safari.self.removeEventListener("message",t);}}const o="undefined"!=typeof chrome&&void 0!==chrome.runtime&&void 0!==chrome.runtime.sendMessage&&void 0!==chrome.runtime.onMessage?new t:i.isSafariAppExtension()?new i:new s,a={"auto-sign-in-to-b5":function(e){if(!d())return;document.dispatchEvent(new CustomEvent("B5InitializeSession",{detail:g(e)}));},"initialize-device":function(e){if(!d())return;document.dispatchEvent(new CustomEvent("B5InitializeDevice",{detail:g(e.device)}));},lock:()=>{},"display-mfa-required":function(e){if(!d())return;let t;const n=new MutationObserver((()=>{var s,i;if(null===(i=null===(s=document.getElementById("signin-form"))||void 0===s?void 0:s.firstElementChild)||void 0===i?void 0:i.classList.contains("two-factor-entry"))null==t||t.remove(),n.disconnect();else {const n=document.getElementsByClassName("existing-signin")[0];n&&0===document.getElementsByClassName("lock-message").length&&(t=document.createElement("div"),t.classList.add("lock-message","box","red"),t.textContent=e.content,n.insertBefore(t,n.firstChild));}}));n.observe(document.body,{childList:!0,subtree:!0});},"request-delegated-session":function(e){return d()?new Promise((t=>{document.addEventListener("B5RequestDelegatedSessionResponse",(e=>{t(e.detail);}),{once:!0}),document.dispatchEvent(new CustomEvent("B5RequestDelegatedSession",{detail:g(e)}));})):Promise.resolve(void 0)},"transfer-device-keys-succeeded":function(e){if(!d())return Promise.resolve(void 0);document.dispatchEvent(new CustomEvent("B5SaveDeviceKeysSucceededEvent",{detail:g(e)}));},"request-device-key-response":function(e){if(!d())return new Promise((e=>e(void 0)));document.dispatchEvent(new CustomEvent("B5DeviceKeyResponse",{detail:g(e)}));}};for(const e in a)o.on(e,a[e]);function d(){let e=window.location.hostname;if(!e)return !1;e=e.toLowerCase();const t=["1password.ca","1password.com","1password.eu","b5dev.ca","b5dev.com","b5dev.eu","b5local.com","b5staging.com","b5test.ca","b5test.com","b5test.eu","b5rev.com"];for(const n of t)if(e===n||e.endsWith("."+n))return !0;return !1}function c(e){const t=document.querySelector(`iframe[src="${e}"]`);t&&document.body.removeChild(t);}function r(e){!function(e,t){const n=document.createElement("iframe");n.id=e,t&&(n.src=t);document.body.appendChild(n);}("b5x-notification",e);}const u={B5WebReady:function(e){if(!d())return;const t=e.detail;if(!t.capabilities.DeviceInit)return;o.request({name:"b5Ready",data:{deviceInit:t.capabilities.DeviceInit,sessionInit:t.capabilities.SessionInit}});},B5SignInSucceeded:l,B5DelegatedSignInSucceeded:l,B5RequestDeviceCredentials:function(e){if(!d())return;const t=e.detail,n={name:"request-device-key",data:Object.assign({},t)};o.request(n);},"share-save-item":function(e){if(!d())return;o.request({name:"share-save-item",data:e.detail.itemJson});}};function l(e){if(d()){if("B5SignInSucceeded"===e.type){const t=e.detail;t.signinAddress=window.location.origin;const n={name:"sign-in-succeeded",data:{type:e.type,details:t}};o.request(n);}else {if("B5DelegatedSignInSucceeded"!==e.type)throw new Error("Unexpected event sent to handleUntrustedSignInEvent");{const t=e.detail;t.signinAddress=window.location.origin;const n={name:"sign-in-succeeded",data:{type:e.type,details:t}};o.request(n);}}o.on("show-add-account-prompt",r),o.on("close-add-account-prompt",c);}}for(const e in u)document.addEventListener(e,u[e]);function m(){document.dispatchEvent(new CustomEvent("B5OPXReady",{bubbles:!1,cancelable:!1,detail:g({capabilities:{CustomAutosave:!0,SessionInit:1,DeviceInit:1,SingleSignOn:1,DelegatedSession:0}})}));}function g(e){return "function"==typeof cloneInto?cloneInto(e,window.document):e}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",m):m(),o.request({name:"get-build-number",data:{}}).then((e=>{document.body.dataset.onepasswordExtensionVersion=e;}));

})();
