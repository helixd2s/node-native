let utils = require("./index");
var native = require('bindings')('native');

let string = "Hello!";
let u8array = new Uint8Array([255, 255, 255, 255]);
console.log(string.charAddress());
