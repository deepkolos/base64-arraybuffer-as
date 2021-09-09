const fs = require('fs');
const assert = require('assert');
const base64ArrayBufferJS = require('./base64ArrayBuffer.js');
const base64ArrayBufferWasm = require('../index.js');

const imgData = fs.readFileSync(__dirname + '/screen.jpg');

const wasmOut = base64ArrayBufferWasm(imgData);
const jsOut = base64ArrayBufferJS(imgData.buffer);
assert.equal(jsOut !== '', true);
assert.equal(wasmOut !== '', true);
assert.equal(wasmOut, jsOut);

console.log('wasm output equal to js output');

const count = 1;

{
  const t = Date.now();
  let output;
  for (let index = 0; index < count; index++) {
    output = base64ArrayBufferWasm(imgData);
  }
  console.log('wasm encode cost', Date.now() - t);
  assert.equal(output, jsOut);
}

{
  const t = Date.now();
  for (let index = 0; index < count; index++) {
    base64ArrayBufferJS(imgData.buffer);
  }
  console.log('js encode cost', Date.now() - t);
}

{
  const t = Date.now();
  let output;
  for (let index = 0; index < count; index++) {
    output = imgData.toString('base64');
  }
  console.log('Buffer.toString encode cost', Date.now() - t);
  assert.equal(output, jsOut);
}
