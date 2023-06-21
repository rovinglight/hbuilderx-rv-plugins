
## 说明

这是一款供 HBuilderX 使用的注释插件。

1. 【功能】支持在文件头部插入并更新作者、创建时间、最后更新者、最后更新时间等字段。
2. 【功能】支持给函数添加 JSDoc 注释，且能自动识别参数。
3. 【特点】兼容其他插件插入的或是之前自行添加的头部注释，仍可在保存时更新最后编辑者以及最后更新时间；
4. 【特点】插入函数注释时能够智能识别参数类型，支持识别 typescript 类型、支持默认值推测类型。

### 文件头部注释

`.vue` 或 `.html` 文件插入的头部注释会是这样：

```html
<!--
 * @Description:
 * @Author: rovinglight
 * @Date: 2023-06-07 21:31:40
 * @LastEditors: rovinglight
 * @LastEditTime: 2023-06-07 21:31:40
-->
```

其余文件的头部注释：

```js
/*
 * @Description:
 * @Author: rovinglight
 * @Date: 2023-06-07 21:31:40
 * @LastEditors: rovinglight
 * @LastEditTime: 2023-06-07 21:31:40
 */
```

有其他文件注释模版需求欢迎评论 🎉

### 函数注释

支持在函数上方插入 JSDoc 注释，能够智能识别并插入参数类型，识别范围较 HBuilderX 自带的范围要大不少。

```javascript
/**
 *
 * @param {Object} paramWithDefault
 * @param {string} paramWithTsType
 * @param {number} paramWithBoth
 * @param {*} paramPlain
 * @param {Number} paramNumber
 * @returns
 */
const func = (
  paramWithDefault = {},
  paramWithTsType: string,
  paramWithBoth: number = 5,
  paramPlain,
  paramNumber = 5
) => {};

/**
 *
 * @param {String} param
 * @param {number} param2
 * @returns
 */
function func(param = "default", param2: number) {}
```

## 使用说明

### 设置

第一次使用需要配置用户名，配置完成后插件在插入、更新头部注释时都会使用您所配置的用户名：

1. 打开 HBuilderX 的设置界面；
2. 点击「插件配置」；
3. 找到 rv-annotation 设置组；
4. 设置「作者名」配置项。修改完成后应当会立即生效。

### 插入头部注释

我们提供了几种方式来插入头部注释：

- 在文档中单击右键，选择菜单中的「添加文件头部注释」
- 在文档中使用快捷键
  - Windows: Ctrl+Shift+I
  - MacOS: Command+Shift+I

> 温馨提示：由于编辑器限制，空文档暂时无法插入头部注释，试试回车添加一个空行后再插入。

### 更新头部注释

插入头部注释后，每次保存前，插件都会更新 `@LastEditTime` 和 `@LastEditor` 字段。后续我们会对更新的字段值添加配置。

### 插入函数注释

1. 选中函数上一行，函数上一行需要是个空行
2. 点击右键，选择菜单中的「添加函数注释」，当然我们也提供了快捷键：
   1. Windows: Ctrl+Shift+U
   2. MacOS: Command+Shift+U
