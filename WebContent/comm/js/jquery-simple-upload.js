!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/dist",n(n.s=5)}([function(e,t){e.exports=jQuery},function(e,t,n){var r=n(2),o=n(3);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var a={insert:"head",singleton:!1};r(o,a);e.exports=o.locals||{}},function(e,t,n){"use strict";var r,o=function(){return void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r},a=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),i=[];function s(e){for(var t=-1,n=0;n<i.length;n++)if(i[n].identifier===e){t=n;break}return t}function u(e,t){for(var n={},r=[],o=0;o<e.length;o++){var a=e[o],u=t.base?a[0]+t.base:a[0],l=n[u]||0,c="".concat(u," ").concat(l);n[u]=l+1;var p=s(c),d={css:a[1],media:a[2],sourceMap:a[3]};-1!==p?(i[p].references++,i[p].updater(d)):i.push({identifier:c,updater:m(d,t),references:1}),r.push(c)}return r}function l(e){var t=document.createElement("style"),r=e.attributes||{};if(void 0===r.nonce){var o=n.nc;o&&(r.nonce=o)}if(Object.keys(r).forEach((function(e){t.setAttribute(e,r[e])})),"function"==typeof e.insert)e.insert(t);else{var i=a(e.insert||"head");if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");i.appendChild(t)}return t}var c,p=(c=[],function(e,t){return c[e]=t,c.filter(Boolean).join("\n")});function d(e,t,n,r){var o=n?"":r.media?"@media ".concat(r.media," {").concat(r.css,"}"):r.css;if(e.styleSheet)e.styleSheet.cssText=p(t,o);else{var a=document.createTextNode(o),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(a,i[t]):e.appendChild(a)}}function f(e,t,n){var r=n.css,o=n.media,a=n.sourceMap;if(o?e.setAttribute("media",o):e.removeAttribute("media"),a&&btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}var h=null,v=0;function m(e,t){var n,r,o;if(t.singleton){var a=v++;n=h||(h=l(t)),r=d.bind(null,n,a,!1),o=d.bind(null,n,a,!0)}else n=l(t),r=f.bind(null,n,t),o=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=o());var n=u(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var r=0;r<n.length;r++){var o=s(n[r]);i[o].references--}for(var a=u(e,t),l=0;l<n.length;l++){var c=s(n[l]);0===i[c].references&&(i[c].updater(),i.splice(c,1))}n=a}}}},function(e,t,n){(t=n(4)(!1)).push([e.i,".simple-upload-dragover{background-color:#eef}.simple-upload-filename{margin-right:0.5em}\n",""]),e.exports=t},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n=e[1]||"",r=e[3];if(!r)return n;if(t&&"function"==typeof btoa){var o=(i=r,s=btoa(unescape(encodeURIComponent(JSON.stringify(i)))),u="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(s),"/*# ".concat(u," */")),a=r.sources.map((function(e){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(e," */")}));return[n].concat(a).concat([o]).join("\n")}var i,s,u;return[n].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,r){"string"==typeof e&&(e=[[null,e,""]]);var o={};if(r)for(var a=0;a<this.length;a++){var i=this[a][0];null!=i&&(o[i]=!0)}for(var s=0;s<e.length;s++){var u=[].concat(e[s]);r&&o[u[0]]||(n&&(u[2]?u[2]="".concat(n," and ").concat(u[2]):u[2]=n),t.push(u))}},t}},function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),a="simple-upload";n(1);function i(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],r=!0,o=!1,a=void 0;try{for(var i,s=e[Symbol.iterator]();!(r=(i=s.next()).done)&&(n.push(i.value),!t||n.length!==t);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw a}}return n}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return s(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return s(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var c={url:"",method:"post",params:{},ajax:{},dropZone:null,progress:null,validator:null,maxFileSize:null,maxFileNum:null,allowedFileName:null,allowedMimeType:null},p=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};u(this,e),this.options=o.a.extend({},c,n),this.$input=o()(t),this.$dropZone=o()(this.options.dropZone),this.$progress=o()(this.options.progress),this.uid=(new Date).getTime()+Math.random(),this.namespace="".concat(a,"-").concat(this.uid),this.dragCounter=0,this.init()}var t,n,r;return t=e,r=[{key:"makeParams",value:function(e){var t={};switch(Object.prototype.toString.call(e)){case"[object Function]":t=e();break;case"[object Array]":e.forEach((function(e){t[e.name]=e.value}));break;case"[object Object]":o.a.extend(t,e)}return t}},{key:"getDefaults",value:function(){return c}},{key:"setDefaults",value:function(e){return o.a.extend(c,e)}}],(n=[{key:"init",value:function(){this.$input.addClass(a),this.$dropZone.addClass(a).addClass("simple-upload-droppable"),this.$progress.addClass(a),this.unbind(),this.bind()}},{key:"destroy",value:function(){this.$input.removeClass(a),this.$dropZone.removeClass(a).removeClass("simple-upload-droppable"),this.$progress.removeClass(a),this.unbind()}},{key:"bind",value:function(){var e=this;this.$input.on("change.".concat(this.namespace),(function(t){e.process(t.target.files),t.target.value=""})),this.$dropZone.length&&(this.$dropZone.on("drop.".concat(this.namespace),(function(t){t.preventDefault(),t.stopPropagation(),e.dragCounter=0,e.$dropZone.removeClass("simple-upload-dragover"),e.process(t.originalEvent.dataTransfer.files)})).on("dragenter.".concat(this.namespace),(function(t){t.preventDefault(),e.dragCounter++,e.$dropZone.addClass("simple-upload-dragover")})).on("dragleave.".concat(this.namespace),(function(t){t.preventDefault(),e.dragCounter--,0==e.dragCounter&&e.$dropZone.removeClass("simple-upload-dragover")})),o()(document).on("drop.".concat(this.namespace),(function(e){e.preventDefault()})).on("dragover.".concat(this.namespace),(function(e){e.preventDefault()})))}},{key:"unbind",value:function(){this.$input.off(".".concat(this.namespace)),this.$dropZone.off(".".concat(this.namespace)),o()(document).off(".".concat(this.namespace));var e=o.a._data(this.$input.get(0),"events");if(e){var t=Object.keys(e).filter((function(e){return e.match(/^upload:/)}));this.$input.off(t.join(" "))}}},{key:"process",value:function(e){if(!this.$input.prop("disabled"))if(this.options.maxFileNum&&e.length>this.options.maxFileNum)this.$input.trigger("upload:over",[e]);else{var t=e;this.options.validator&&(t=this.options.validator(t));var n=i(this.validate(t),2),r=n[0],o=n[1];o.length>0&&this.$input.trigger("upload:invalid",[o]),r.length>0&&this.uploadFiles(r)}}},{key:"validate",value:function(e){for(var t=[],n=[],r=0;r<e.length;r++){var o=e[r];this.options.maxFileSize&&o.size>this.options.maxFileSize?(o.reason="size",n.push(o)):this.options.allowedFileName&&!o.name.match(this.options.allowedFileName)?(o.reason="name",n.push(o)):this.options.allowedMimeType&&!o.type.match(this.options.allowedMimeType)?(o.reason="type",n.push(o)):t.push(o)}return[t,n]}},{key:"uploadFiles",value:function(e){var t=this;this.$input.prop("disabled",!0),this.before(e);for(var n=(new o.a.Deferred).resolve(),r=function(r){n=n.then((function(){return t.uploadFile(e[r],r)}))},a=0;a<e.length;a++)r(a);n.then((function(){t.after(e),t.$input.prop("disabled",!1)}))}},{key:"uploadFile",value:function(e,t){var n=this,r=new o.a.Deferred;return o.a.ajax(o.a.extend({url:this.options.url,method:this.options.method,data:this.buildFormData(e),processData:!1,contentType:!1,beforeSend:function(){n.start(e,t)},xhr:function(){var r=o.a.ajaxSettings.xhr();return r.upload&&r.upload.addEventListener("progress",(function(r){n.progress(e,t,r.loaded,r.total)}),!1),r}},this.options.ajax)).done((function(r,o,a){n.done(e,t,r,o,a)})).fail((function(r,o,a){n.fail(e,t,r,o,a)})).always((function(){n.end(e,t),r.resolve()})),r.promise()}},{key:"before",value:function(e){var t=this;this.$progress.length&&e.forEach((function(e,n){t.buildProgress(e,n)})),this.$input.trigger("upload:before",[e])}},{key:"after",value:function(e){this.$input.trigger("upload:after",[e])}},{key:"start",value:function(e,t){this.$input.trigger("upload:start",[e,t])}},{key:"progress",value:function(e,t,n,r){this.findProgress(t).find(".simple-upload-percent").text(Math.ceil(n/r*100)+"%"),this.$input.trigger("upload:progress",[e,t,n,r])}},{key:"done",value:function(e,t,n,r,o){this.$input.trigger("upload:done",[e,t,n,r,o])}},{key:"fail",value:function(e,t,n,r,o){this.$input.trigger("upload:fail",[e,t,n,r,o])}},{key:"end",value:function(e,t){this.findProgress(t).hide("fast",(function(e){return o()(e).remove()})),this.$input.trigger("upload:end",[e,t])}},{key:"buildProgress",value:function(e,t){var n=o()("<div>").addClass("simple-upload-progress").data("upload-index",t);o()("<span>").addClass("simple-upload-filename").text(e.name).appendTo(n),o()("<span>").addClass("simple-upload-percent").text("...").appendTo(n),this.$progress.append(n)}},{key:"findProgress",value:function(e){return this.$progress.find(".simple-upload-progress").filter((function(t,n){return o()(n).data("upload-index")==e}))}},{key:"buildFormData",value:function(t){var n=new FormData;n.append(this.$input.attr("name"),t);var r=e.makeParams(this.options.params);for(var o in r)n.append(o,r[o]);return n}}])&&l(t.prototype,n),r&&l(t,r),e}();o.a.fn.simpleUpload=function(e){return this.each((function(t,n){var r=o()(n);r.data(a)&&r.data(a).destroy(),r.data(a,new p(r,e))}))},o.a.SimpleUpload=p}]);