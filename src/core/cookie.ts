import { _YuumiBaseStorage, _YuumiBaseStorageOption } from "./base"

export interface YuumiCookieStorageOption extends _YuumiBaseStorageOption {
  domain?: string
  path?: string
}

export class YuumiCookieStorage extends _YuumiBaseStorage {
  domain: string
  path: string

  constructor(option?: YuumiCookieStorageOption) {
    super(option)
    this.domain = option?.domain || ""
    this.path = option?.path || ""
  }

  private cookieCreator(key: string, value: string, expires?: string) {
    let cookie = `${key}=${encodeURIComponent(value)};`
    if (expires) {
      cookie += `expires=${expires};`
    }
    if (this.domain) {
      cookie += `domain=${this.domain};`
    }
    if (this.path) {
      cookie += `path=${this.path};`
    }
    return cookie
  }

  /**
   * 通过键值对存储
   * @param {string} key - 要存储的数据的名称（键）
   * @param {string} value - 要存储的数据的值（值）
   */
  setItemSync(key: string, value: string) {
    document.cookie = this.cookieCreator(
      this.getCompleteKey(key),
      value,
      /^(0,)+0$/.test(this.expirationTime.toString()) ? undefined : this.getExpires()
    )
  }

  /**
   * 通过键值对存储
   * @param {string} key - 要存储的数据的名称（键）
   * @param {string} value - 要存储的数据的值（值）
   * @return {Promise<void>}
   */
  setItem(key: string, value: string): Promise<void> {
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
   * @return {string|undefined}
   */
  getItemSync(key: string): string|undefined {
    const _key = this.getCompleteKey(key)
    const reg = new RegExp('(^| )' + _key + '=([^;]*)(;|$)')
    const matches = document.cookie.match(reg)
    return matches ? decodeURIComponent(matches[2]) : undefined
  }

  /**
   * 检索指定的键所对应的值
   * @param {string} key - 要检索的数据的名称（键）
   * @return {Promise<string|undefined>}
   */
  getItem(key: string): Promise<string|undefined> {
    const res = this.getItemSync(key)
    return Promise.resolve(res)
  }

  /**
   * 删除指定的键所对应的值
   * @param {string} key - 要删除的数据的名称（键）
   */
  removeItemSync(key: string) {
    const value = this.getItemSync(key)
    if (value === undefined) return

    const expires = new Date(Date.now() - 1).toUTCString()
    document.cookie = this.cookieCreator(
      this.getCompleteKey(key),
      value,
      expires
    )
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
    const reg = new RegExp('(^| )[^=]*=([^;]*)(;|$)', "g")
    const matches = document.cookie.match(reg)
    if (!matches) return

    const hasFilter = typeof filter === 'function'
    const expires = new Date(Date.now() - 1).toUTCString()
    matches.forEach((item) => {
      const res = item.trim().match(/([^=]+)=([^;]*)(;|$)/)
      if (!res) return
      const _key = res[1]
      const _value = res[2]
      if (hasFilter && !filter(this.getShortKey(_key))) return
      document.cookie = this.cookieCreator(_key, _value, expires)
    })
  }

  /**
   * @callback clearFilter
   * @param {string} key - key值
   * @return {boolean}
  */
}