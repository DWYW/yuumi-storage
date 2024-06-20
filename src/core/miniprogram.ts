import { _YuumiBaseStorage, _YuumiBaseStorageOption } from "./base"

export interface YuumiMiniProgramStorageOption extends _YuumiBaseStorageOption {}

export class YuumiMiniProgramStorage extends _YuumiBaseStorage {
  private global: any
  constructor(option?: YuumiMiniProgramStorageOption) {
    super(option)
     // @ts-ignore
     if (wx) { this.global = wx }
     // @ts-ignore
     else if (my) { this.global = my }
  }

  /**
   * 通过键值对存储
   * @param {string} key - 要存储的数据的名称（键）
   * @param {any} value - 要存储的数据的值（值）
   */
  setItemSync(key: string, value: any) {
    const res: {[x:string]: string} = {
      detail: value
    }
    if (!/^(0,)+0$/.test(this.expirationTime.toString())) {
      res.expires = this.getExpires()
    }
    this.global.setStorageSync(this.getCompleteKey(key), res)
  }

  /**
   * 通过键值对存储
   * @param {string} key - 要存储的数据的名称（键）
   * @param {any} value - 要存储的数据的值（值）
   * @return {Promise<void>}
   */
  setItem(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const res: {[x:string]: string} = {
        detail: value
      }
      if (!/^(0,)+0$/.test(this.expirationTime.toString())) {
        res.expires = this.getExpires()
      }

      this.global.setStorage({
        key: this.getCompleteKey(key),
        data: res,
        success: () => resolve(),
        fail: reject
      })
    })
  }

  private parseValue<T>(data: any, key: string): T|null {
    // 过期返回null
    if (data.expires !== undefined) {
      const expires = new Date(data.expires).getTime()
      if (expires < Date.now()) {
        this.expiredAutoDelete && this.removeItemSync(key)
        return null
      }
    }

    return data.detail
  }

  /**
   * 检索指定的键所对应的值
   * @param {string} key - 要检索的数据的名称（键）
   * @param {boolean} onlyOnce - 是否只能获取一次，如果是获取后则会自动删除原有记录
   * @return {any}
   */
  getItemSync<T>(key: string, onlyOnce?: boolean): T|null {
    const value = this.global.getStorageSync(this.getCompleteKey(key))
    if (onlyOnce) {
      this.removeItemSync(key)
    }
    return this.parseValue<T|null>(value, key)
  }

  /**
   * 检索指定的键所对应的值
   * @param {string} key - 要检索的数据的名称（键）
   * @param {boolean} onlyOnce - 是否只能获取一次，如果是获取后则会自动删除原有记录
   * @return {Promise<T|null>}
   */
  getItem<T>(key: string, onlyOnce?: boolean): Promise<T|null> {
    return new Promise((resolve, reject) => {
      this.global.getStorage({
        key: this.getCompleteKey(key),
        success: (res: any) => {
          if (onlyOnce) {
            this.removeItemSync(key)
          }
          resolve(this.parseValue(res, key))
        },
        fail: reject
      })
    })
  }

  /**
   * 删除指定的键所对应的值
   * @param {string} key - 要删除的数据的名称（键）
   */
  removeItemSync(key: string) {
    this.global.removeStorageSync(this.getCompleteKey(key))
  }

  /**
   * 删除指定的键所对应的值
   * @param {string} key - 要删除的数据的名称（键）
   * @return {Promise<void>}
   */
  removeItem(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.global.removeStorage({
        key: this.getCompleteKey(key),
        success: () => resolve(),
        fail: reject
      })
    })
  }

  /**
   * 清空所有键值对
   * @param {clearFilter} filter - 过滤函数，如何返回false则会跳过不清理
   */
  clear(filter?: (key: string) => boolean) {
    const hasFilter = typeof filter === 'function'
    const { keys } = this.global.getStorageInfoSync()
    keys.forEach((key: string) => {
      if (hasFilter) {
        const _shortKey = this.getShortKey(key)
        if (!filter(_shortKey)) return
      } else if (!key.startsWith(this.prefix)) {
        return
      }
      
      this.global.removeStorageSync(key)
    })
  }

  /**
   * @callback clearFilter
   * @param {string} key - key值
   * @return {boolean}
  */
}