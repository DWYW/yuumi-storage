import { BaseCtorOptions, BaseCtor } from "../base"

export interface StorageCtorOptions extends BaseCtorOptions {
  type: "localStorage"|"sessionStorage"
}

export class _Storage extends BaseCtor {
  _storage: Storage

  constructor(options?: StorageCtorOptions) {
    const opts = Object.assign({
      type: localStorage
    }, options)
    super(opts)

    if (opts.type === "localStorage") {
      this._storage = window.localStorage
    } else {
      this._storage = window.sessionStorage
    }
  }

  /**
   * 通过键值对存储
   * @param {string} key 要存储的数据的名称（键）
   * @param {any} value 要存储的数据的值（值）
   */
  setItem (key: string, value: any) {
    key = this.getFillKey(key)
    this._storage.setItem(key, JSON.stringify(value))
  }

  /**
   * 检索指定的键所对应的值
   * @param {string} key 要检索的数据的名称（键）
   * @returns {any}
   */
  getItem<T> (key: string): T|null {
    key = this.getFillKey(key)
    const res = this._storage.getItem(key)
    return res ? JSON.parse(res) : res
  }

  /**
   * 删除指定的键所对应的值
   * @param {string} key 要删除的数据的名称（键）
   */
  removeItem (key: string) {
    key = this.getFillKey(key)
    this._storage.removeItem(key)
  }

  /**
   * 清空所有键值对
   * @param {Function} callback 回调函数，如何返回false则会跳过不清理
   * @callback callback
   * @param {string} key Cookie key值
   * @returns {boolean}
   */
  clear(callback?: (key: string) => boolean) {
    const hasCallBack = typeof callback === 'function'

    Object.keys(this._storage).forEach((key) => {
      if (hasCallBack && !callback(key)) return
      this._storage.removeItem(key)
    })
  }
}