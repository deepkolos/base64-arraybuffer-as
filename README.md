# base64-arraybuffer-as

一个用 AssemblyScript 编写的 base64-arraybuffer

## 性能

```yml
CPU: i9 10900es
Node: 16.8.0
Input: tests/screen.jpg(3.95MB)

JS Cost: 314ms(4.13x)
Wasm Cost: 76ms(1.00x)
```

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
```

## TODO

1. 支持浏览器
2. 支持微信小程序

## 赞助

如果项目对您有帮助，欢迎打赏

<img src="https://upload-images.jianshu.io/upload_images/252050-d3d6bfdb1bb06ddd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="赞赏码" width="300">
