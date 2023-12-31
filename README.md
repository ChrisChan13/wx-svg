# wx-svg

微信小程序 SVG 组件，支持对 SVG 重新着色

## 安装

### npm

使用 npm 构建前，请先阅读微信官方的 [npm 支持](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

```bash
# 通过 npm 安装
npm i wx-svg -S --production
```

### 构建 npm 包

打开微信开发者工具，点击 **工具** -> **构建 npm**，并勾选 **使用 npm 模块** 选项，构建完成后，即可引入组件。

## 使用

### 引入组件

在 `app.json` 中配置为全局引入
```json
{
  "usingComponents": {
    "svg-icon": "wx-svg/index"
  }
}
```

在 `page.json` 中配置为本页面使用
```json
{
  "usingComponents": {
    "svg-icon": "wx-svg/index"
  }
}
```

### 使用组件

```html
<svg-icon src="/your-svg-file-path.svg" />
```

## 示例

### 基础用法

```html
<svg-icon src="/your-svg-file-path.svg" mode="widthFix" />
```

### 单颜色重新着色

传入 `color` 时，会对 SVG 中所有声明 `fill/stroke` 的元素，以及 SVG 根元素进行重新着色（[查看效果](#效果预览)）
```html
<svg-icon src="/your-svg-file-path.svg" color="#ff0000" />
```

### 多颜色重新着色

1. 以数组形式传入 `colors` 时，依照数组中的**颜色顺序**，会对 SVG 中所有声明 `fill/stroke` 的元素**按顺序**重新着色（[查看效果](#效果预览)）
```javascript
colorsArray: ['#ff0000', '#00ff00', '#0000ff']
```
```html
<svg-icon src="/your-svg-file-path.svg" colors="{{colorsArray}}" />
```
2. 以对象形式传入 `colors` 时，依照对象中的**键值关系**，会对 SVG 中所有声明 `fill/stroke` 的元素**按对应关系**重新着色（[查看效果](#效果预览)）
```javascript
colorsObject: { black: '#ff0000', '#fff': '#00ff00', '#808080': '#cdcdcd' }
```
```html
<svg-icon src="/your-svg-file-path.svg" colors="{{colorsObject}}" />
```

### 组合重新着色

同时传入 `color` 以及 `colors` 组合搭配，既能为指定元素重新着色，也能为其余未指定元素统一着色（[查看效果](#效果预览)）

## API

### 参数

||类型|说明|默认值|
|:-|:-|:-|:-|
|`src`|`string`|SVG 资源地址（支持绝对路径、临时路径以及网络资源）|-|
|`color`|`string`|SVG 颜色|-|
|`colors`|`array` \| `object`|SVG 颜色配置，支持数组或对象|-|
|`mode`|`string`|SVG 裁剪、缩放的模式（与 `image` 标签相同）|-|

* *当 src 传入网络资源并重新着色时，请注意将网络资源的域名配置于小程序的 downloadFile 合法域名中*

### 事件

||说明|
|:-|:-|
|`error`|当错误发生时触发，`event.detail = Error \|\| { errMsg }`|
|`load`|当图片载入完毕时触发，`event.detail = { height, width }`|

### 外部样式类

||说明|
|:-|:-|
|`image-class`|`image` 节点样式类|

## Demo

克隆本仓库，运行 `npm i & npm run dev`，将 miniprogram_dev 文件夹导入微信开发者工具

## 效果预览

![效果预览](screenshot.jpg)