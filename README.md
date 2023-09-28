## 安装

```
npm install yuumi-storage
```

## 使用

### web

```ts
/**
 * option.prefix 要存储的数据的名称的前缀
 * option.hyphen 要存储的数据的名称的前缀和名称之间的连字符，默认未"_"
 * option.expireTime 过期时间：[天,时,分,秒]
 * option.expiredAutoDelete 访问过期值自动删除
 * option.domain
 * option.path
 */

import { YuumiCookieStorage } from "yuumi-storage"
const instace = new YuumiCookieStorage{option}

/**
 * option.prefix 要存储的数据的名称的前缀
 * option.hyphen 要存储的数据的名称的前缀和名称之间的连字符，默认未"_"
 * option.expireTime 过期时间：[天,时,分,秒]
 * option.expiredAutoDelete 访问过期值自动删除
 */
import { YuumiLocalStorage } from "yuumi-storage"
const instace = new YuumiLocalStorage{option}

import { YuumiSessionStorage } from "yuumi-storage"
const instace = new YuumiSessionStorage{option}
```

### 小程序

```js
import { YuumiMiniProgramStorage } from "yuumi-storage"
const instace = new YuumiMiniProgramStorage{option}
```

```js
/**
 * 通过键值对存储
 * @param {string} key - 要存储的数据的名称（键）
 * @param {string} value - 要存储的数据的值（值）
 */
instance.setItemSync(key: string, value: string): void;
/**
 * 通过键值对存储
 * @param {string} key - 要存储的数据的名称（键）
 * @param {string} value - 要存储的数据的值（值）
 * @return {Promise<void>}
 */
instance.setItem(key: string, value: string): Promise<void>;
/**
 * 检索指定的键所对应的值
 * @param {string} key - 要检索的数据的名称（键）
 * @return {string|undefined}
 */
instance.getItemSync(key: string): string | undefined;
/**
 * 检索指定的键所对应的值
 * @param {string} key - 要检索的数据的名称（键）
 * @return {Promise<string|undefined>}
 */
instance.getItem(key: string): Promise<string | undefined>;
/**
 * 删除指定的键所对应的值
 * @param {string} key - 要删除的数据的名称（键）
 */
instance.removeItemSync(key: string): void;
/**
 * 删除指定的键所对应的值
 * @param {string} key - 要删除的数据的名称（键）
 * @return {Promise<void>}
 */
instance.removeItem(key: string): Promise<void>;
/**
 * 清空所有键值对
 * @param {clearFilter} filter - 过滤函数，如何返回false则会跳过不清理
 */
instance.clear(filter?: (key: string) => boolean): void;
```