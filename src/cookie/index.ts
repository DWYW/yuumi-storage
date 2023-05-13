import { BaseCtorOptions, BaseCtor } from "../base"

// 过期时间：[天,时,分,秒]
export type ExpireTime = [number, number, number, number]

export interface CookieCtorOptions extends BaseCtorOptions {
  expireTime?: ExpireTime
}

export class _Cookie extends BaseCtor {
  expireTime: ExpireTime;

  constructor(options?: CookieCtorOptions) {
    const opts = Object.assign({
      expireTime: [7, 0, 0, 0]
    }, options)

    super(opts)
    this.expireTime = opts.expireTime
  }

  /**
   * 通过键值对存储
   * @param {string} key 要存储的数据的名称（键）
   * @param {string} value 要存储的数据的值（值）
   * @param {[number, number, number, number]} expireTime 过期时间：[天,时,分,秒]
   */
  setItem (key: string, value: string, expireTime?: ExpireTime) {
    key = this.getFillKey(key)
    const [days, hours, minutes, seconds] = expireTime || this.expireTime
    const stamp = Date.now() + days * 24 * 3600 * 1000 + hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000
    const expires = new Date(stamp).toUTCString()
    document.cookie = `${key}=${encodeURIComponent(value)};expires=${expires}`
  }

  /**
   * 检索指定的键所对应的值
   * @param {string} key 要检索的数据的名称（键）
   * @returns {string|undefined}
   */
  getItem (key: string): string|undefined {
    key = this.getFillKey(key)
    const reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')
    const matches = document.cookie.match(reg)
    return matches ? decodeURIComponent(matches[2]) : undefined
  }

  /**
   * 删除指定的键所对应的值
   * @param {string} key 要删除的数据的名称（键）
   */
  removeItem (key: string) {
    const value = this.getItem(key)

    if (value) {
      key = this.getFillKey(key)
      const expires = new Date(Date.now() - 1).toUTCString()
      document.cookie = `${key}=${value};expires=${expires}`
    }
  }

  /**
   * 清空所有键值对
   * @param {Function} callback 回调函数，如何返回false则会跳过不清理
   * @callback callback
   * @param {string} key Cookie key值
   * @returns {boolean}
   */
  clear(callback?: (key: string) => boolean) {
    const reg = new RegExp('(^| )[^=]*=([^;]*)(;|$)', "g")
    const matches = document.cookie.match(reg)
    if (!matches) return

    const hasCallBack = typeof callback === 'function'
    const expires = new Date(Date.now() - 1).toUTCString()
    matches.forEach((item) => {
      const res = item.trim().match(/([^=]+)=([^;]*)(;|$)/)
      if (!res) return

      const itemKey = res[1]
      const itemValue = res[2]

      if (hasCallBack && !callback(itemKey)) return
      document.cookie = `${itemKey}=${itemValue};expires=${expires}`
    })
  }
}