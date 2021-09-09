const fs = require("fs");
const AsBind = require('as-bind/dist/as-bind.cjs');
const imports = { /* imports go here */ };
const wasmModule = AsBind.instantiateSync(fs.readFileSync(__dirname + "/build/optimized.wasm"), imports);
module.exports = wasmModule.exports.base64ArrayBuffer;
