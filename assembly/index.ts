// https://gist.github.com/jonleighton/958841
// Converted to AssemblyScript 2021/09/09 by DeepKolos

// Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
// use window.btoa' step. According to my tests, this appears to be a faster approach:
// http://jsperf.com/encoding-xhr-image-data/5

/*
MIT LICENSE
Copyright 2011 Jon Leighton
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { StringSink } from 'as-string-sink';

// prettier-ignore
const encodingsCodePoint: StaticArray<i32> = [
  65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 
  76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 
  87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 
  103, 104, 105, 106, 107, 108, 109, 110, 111, 
  112, 113, 114, 115, 116, 117, 118, 119, 120, 
  121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 
  57, 43, 47
];

const tailCodePoint: i32 = 61;
let a: u32, b: u32, c: u32, d: u32;
let e: u32 = 0;
let chunk: u32;

// prettier-ignore
export function base64ArrayBuffer(bytes: Uint8Array): string {
  let byteLength = bytes.byteLength;
  let byteRemainder = byteLength % 3;
  let mainLength = byteLength - byteRemainder;

  const stringSink = new StringSink('', (mainLength / 3 + 1) * 4);

  // Main loop deals with bytes in chunks of 3
  for (let i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk =
      ((<u32>unchecked(bytes[i])) << 16) |
      ((<u32>unchecked(bytes[i + 1])) << 8) |
      (<u32>unchecked(bytes[i + 2]));

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12;   // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6;      // 4032     = (2^6 - 1) << 6
    d = chunk & 63;               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    stringSink.writeCodePoint(encodingsCodePoint[a]);
    stringSink.writeCodePoint(encodingsCodePoint[b]);
    stringSink.writeCodePoint(encodingsCodePoint[c]);
    stringSink.writeCodePoint(encodingsCodePoint[d]);

    e += 4;
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = unchecked(<u32>bytes[mainLength]);

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4;   // 3   = 2^2 - 1

    stringSink.writeCodePoint(encodingsCodePoint[a]);
    stringSink.writeCodePoint(encodingsCodePoint[b]);
    stringSink.writeCodePoint(tailCodePoint);
    stringSink.writeCodePoint(tailCodePoint);
  } else if (byteRemainder == 2) {
    chunk =
      (unchecked(<u32>bytes[mainLength]) << 8) |
      unchecked(<u32>bytes[mainLength + 1]);

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4;   // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2;     // 15    = 2^4 - 1

    stringSink.writeCodePoint(encodingsCodePoint[a]);
    stringSink.writeCodePoint(encodingsCodePoint[b]);
    stringSink.writeCodePoint(encodingsCodePoint[c]);
    stringSink.writeCodePoint(tailCodePoint);
  }

  return stringSink.toString();
}
