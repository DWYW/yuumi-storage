## 安装

```
npm install yuumi-storage
```

## 使用

### web

```js
import { WebStorage } from "yuumi-storage"

const { cookie, local, session } = new WebStorage(options)

/**
 * options.prefix 要存储的数据的名称的前缀
 * options.hyphen 要存储的数据的名称的前缀和名称之间的连字符，默认未"_"
 * options.expireTime 过期时间：[天,时,分,秒]
 *
 * new WebStorage({
 *   prefix: "TEST",
 *   hyphen: ":",
 *   expireTime: [1, 0, 0, 0]
 * })
 */

```

```js
/**
 * 通过键值对存储
 * @param {string} key 要存储的数据的名称（键）
 * @param {string} value 要存储的数据的值（值）
 * @param {[number, number, number, number]} expireTime 过期时间：[天,时,分,秒]
 */
cookie.setItem(key: string, value: string, expireTime?: ExpireTime): void;
[local|session].setItem(key: string, value: string): void;
/**
 * 检索指定的键所对应的值
 * @param {string} key 要检索的数据的名称（键）
 * @returns {string|undefined}
 */
[cookie|local|session].getItem(key: string): string | undefined;
/**
 * 删除指定的键所对应的值
 * @param {string} key 要删除的数据的名称（键）
 */
[cookie|local|session].removeItem(key: string): void;
/**
 * 清空所有键值对
 * @param {Function} callback 回调函数，如何返回false则会跳过不清理
 * @callback callback
 * @param {string} key Cookie key值
 * @returns {boolean}
 */
[cookie|local|session].clear(callback?: (key: string) => boolean): void;
```

### 小程序

```js
import { MiniProgramStorage } from "yuumi-storage"

const storage = new MiniProgramStorage(options)

/**
 * options.prefix 要存储的数据的名称的前缀
 * options.hyphen 要存储的数据的名称的前缀和名称之间的连字符，默认未"_"
 *
 * new WebStorage({
 *   prefix: "TEST",
 *   hyphen: ":"
 * })
 */
```


```js
/**
 * 通过键值对存储
 * @param {string} key 要存储的数据的名称（键）
 * @param {any} value 要存储的数据的值（值）
 * @param {Object} option 可选参数
 * @param {boolean} option.async 是否使用异步操作
 * @returns {Promise<void>}
 */
setItem<T>(key: string, value: T, option?: AsyncOption): Promise<void>;
/**
 * 检索指定的键所对应的值
 * @param {string} key 要检索的数据的名称（键）
 * @param {Object} option 可选参数
 * @param {boolean} option.async 是否使用异步操作
 * @returns {Promise<any>}
 */
getItem<T>(key: string, option?: AsyncOption): Promise<T>;
/**
 * 删除指定的键所对应的值
 * @param {string} key 要删除的数据的名称（键）
 * @param {Object} option 可选参数
 * @param {boolean} option.async 是否使用异步操作
 * @returns {Promise<void>}
 */
removeItem(key: string, option?: AsyncOption): Promise<void>;
/**
 * 清空所有键值对
 * @param {Function} callback 回调函数，如何返回false则会跳过不清理
 * @param {Object} option 可选参数
 * @param {boolean} option.async 是否使用异步操作
 * @returns {Promise<void>}
 *
 * @callback callback
 * @param {string} key Cookie key值
 * @returns {boolean}
 */
clear(callback?: (key: string) => boolean, option?: AsyncOption): Promise<void[]>;
```