import { _YuumiBaseStorage, _YuumiBaseStorageOption } from "./base"

export interface _YuumiStorageOption extends _YuumiBaseStorageOption {}

export class _YuumiStorage extends _YuumiBaseStorage {
  private storage: Storage
  constructor(storageGetter: () => Storage, option?: _YuumiStorageOption) {
    super(option)
    this.storage = storageGetter()
  }

  /**
   * 通过键值对存储
   * @param {string} key - 要存储的数据的名称（键）
   * @param {any} value - 要存储的数据的值（值）
   */
  setItemSync(key: string, value: any) {
    const _key = this.getCompleteKey(key)
    const _value = JSON.stringify(value)
    const res: {[x:string]: string} = {
      detail: _value
    }

    if (!/^(0,)+0$/.test(this.expirationTime.toString())) {
      res.expires = this.getExpires()
    }

    this.storage.setItem(_key, JSON.stringify(res))
  }

  /**
   * 通过键值对存储
   * @param {string} key - 要存储的数据的名称（键）
   * @param {any} value - 要存储的数据的值（值）
   * @return {Promise<void>}
   */
  setItem(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const res = this.setItemSync(key, value)
        resolve(res)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * 检索指定的键所对应的值
   * @param {string} key - 要检索的数据的名称（键）
   * @return {any}
   */
  getItemSync<T>(key: string): T|null {
    const _key = this.getCompleteKey(key)
    let res: any = this.storage.getItem(_key)

    if (res === null) return null

    try {
      res = JSON.parse(res)
    } catch(_) {
      return null
    }

    // 过期返回null
    if (res.expires !== undefined) {
      const expires = new Date(res.expires).getTime()
      if (expires < Date.now()) {
        this.expiredAutoDelete && this.removeItemSync(key)
        return null
      }
    }

    try {
      return JSON.parse(res.detail)
    } catch(_) {
      return null
    }
  }

  /**
   * 检索指定的键所对应的值
   * @param {string} key - 要检索的数据的名称（键）
   * @return {Promise<T|null>}
   */
  getItem<T>(key: string): Promise<T|null> {
    const res = this.getItemSync<T|null>(key)
    return Promise.resolve(res)
  }

  /**
   * 删除指定的键所对应的值
   * @param {string} key - 要删除的数据的名称（键）
   */
  removeItemSync(key: string) {
    const _key = this.getCompleteKey(key)
    this.storage.removeItem(_key)
  }

  /**
   * 删除指定的键所对应的值
   * @param {string} key - 要删除的数据的名称（键）
   * @return {Promise<void>}
   */
  removeItem(key: string): Promise<void> {
    const res = this.removeItemSync(key)
    return Promise.resolve(res)
  }

  /**
   * 清空所有键值对
   * @param {clearFilter} filter - 过滤函数，如何返回false则会跳过不清理
   */
  clear(filter?: (key: string) => boolean) {
    const hasFilter = typeof filter === 'function'

    Object.keys(this.storage).forEach((key) => {
      if (hasFilter && !filter(this.getShortKey(key))) return
      this.storage.removeItem(key)
    })
  }

  /**
   * @callback clearFilter
   * @param {string} key - key值
   * @return {boolean}
  */
}