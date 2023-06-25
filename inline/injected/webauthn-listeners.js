(function () {
	'use strict';

	function e(){let e,t;function n(e){return e instanceof ArrayBuffer||e instanceof Uint8Array||e instanceof DataView||e instanceof Array?Array.from(e instanceof ArrayBuffer?new Uint8Array(e):e):e}window.addEventListener("message",(n=>{"credential-created"===n.data.name?e(Object.assign(Object.assign({},n.data.data),{getClientExtensionResults:()=>(new TextEncoder).encode("bfff").buffer})):"credential-retrieved"===n.data.name&&t(Object.assign(Object.assign({},n.data.data),{getClientExtensionResults:()=>(new TextEncoder).encode("bfff").buffer}));})),navigator.credentials&&(navigator.credentials.create=t=>(null==t||delete t.signal,window.postMessage({name:"create-credential",data:JSON.stringify(t,((e,t)=>n(t)))},"*"),new Promise((t=>e=t))),navigator.credentials.get=e=>(null==e||delete e.signal,window.postMessage({name:"get-credential",data:JSON.stringify(e,((e,t)=>n(t)))},"*"),new Promise((e=>t=e))));}if("chrome"in globalThis){const t=document.createElement("script");t.textContent=`(${e.toString()})()`,(document.head||document.documentElement).appendChild(t),t.remove();}else e();

})();
