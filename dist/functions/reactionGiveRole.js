"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=reactionGiveRole;var _config=require("../../config"),_=require("./");function _createForOfIteratorHelper(a,b){var c;if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(c=_unsupportedIterableToArray(a))||b&&a&&"number"==typeof a.length){c&&(a=c);var d=0,e=function(){};return{s:e,n:function n(){return d>=a.length?{done:!0}:{done:!1,value:a[d++]}},e:function e(a){throw a},f:e}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var f,g=!0,h=!1;return{s:function s(){c=a[Symbol.iterator]()},n:function n(){var a=c.next();return g=a.done,a},e:function e(a){h=!0,f=a},f:function f(){try{g||null==c["return"]||c["return"]()}finally{if(h)throw f}}}}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function reactionGiveRole(a,b,c,d){(0,_.log)("Entered reactiveGiveRole function");var e,f=_createForOfIteratorHelper(_config.allowableAddRoles);try{var g=function(){var b=e.value;-1!==a.content.indexOf(b)&&a.guild.members.fetch(c.id).then(function(a){a.roles.cache.find(function(a){return a.id===b})||d?a.roles.cache.find(function(a){return a.id===b})&&d&&((0,_.log)("Removed roleID ".concat(b," from user ").concat(c.username)),a.roles.remove(b)):((0,_.log)("Added roleID ".concat(b," to user ").concat(c.username)),a.roles.add(b))})};for(f.s();!(e=f.n()).done;)g()}catch(a){f.e(a)}finally{f.f()}}