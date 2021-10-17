# base64-arraybuffer-as

一个用 AssemblyScript 编写的 base64-arraybuffer

> 发现个手写 wat 的 base64 encoder/decoder, 支持 simd, threads 等 [fast-base64](https://github.com/mitschabaude/fast-base64), 性能强多了
> 看了下实现, 应该主要优化方法是利用TextDecoder拼接字符串, 本仓库则是用as-string-sink拼接字符串

## 性能

```yml
CPU: i9 10900es
Input: tests/screen.jpg(3.95MB)
```

| Host       | Js           | Wasm         | Other                            |
| ---------- | ------------ | ------------ | -------------------------------- |
| Node 16.8  | 314ms(4.13x) | 76ms(1.00x)  | Buffer.toString Cost: 4ms(0.05x) |
| Chrome 96  | 256ms(2.20x) | 116ms(1.00x) |                                  |
| Firefox 94 | 327ms(0.95x) | 343ms(1.00x) |                                  |

### 但是 fast-base64 性能及其强大

| Host       | Js             | Wasm          | Other |
| ---------- | -------------- | ------------- | ----- |
| Chrome 97  | 21.89ms(2.20x) | 12.5ms(1.00x) |       |
| Firefox 96 | 14ms(0.95x)    | 7ms(1.00x)    |       |

```yml
Phone: Redmi note 10 Pro
Input: tests/screen.jpg(3.95MB)
```

| Host              | Js           | Wasm         | Other |
| ----------------- | ------------ | ------------ | ----- |
| WeChat WebView    | 359ms(2.28x) | 157ms(1.00x) |       |
| QQ Browser 11.9.6 | 366ms(2.61x) | 140ms(1.00x) |       |

## 使用

```sh
> npm/pnpm i -S base64-arraybuffer-as
```

### NodeJS

```js
const fs = require('fs');
const base64ArrayBuffer = require('base64-arraybuffer-as');

const imgData = fs.readFileSync(__dirname + './tests/screen.jpg');
const base64 = base64ArrayBuffer(imgData);

// 当然NodeJS下应该使用Buffer.toString('base64');
```

### Browser

```js
import * as AsBind from 'as-bind';

AsBind.instantiate(
  // your wasm location
  fetch('./build/optimized.wasm').then(i => i.arrayBuffer()),
).then(async ({ exports }) => {
  const imageData = new Uint8Array([0, 1, 2, 3, 4, 5]);
  const output = exports.base64ArrayBuffer(imageData);
});
```

## TODO

1. 支持浏览器 (done 火狐下 js 比 wasm 快
2. 支持微信小程序
3. 增加构建 wasm inline 版本
4. 增加 base64 to arraybuffer

## 赞助

如果项目对您有帮助，欢迎打赏

<img src="https://upload-images.jianshu.io/upload_images/252050-d3d6bfdb1bb06ddd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="赞赏码" width="300">
