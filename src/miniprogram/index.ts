import { BaseCtorOptions, BaseCtor } from "../base"

interface AsyncOption {
  async?: boolean
}

export interface MiniProgramCtorOptions extends BaseCtorOptions {}

export class _MiniProgramStorage extends BaseCtor {
  _global: any

  constructor(options?: MiniProgramCtorOptions) {
    const opts = Object.assign({
      type: localStorage
    }, options)
    super(opts)
  }

  /**
   * 通过键值对存储
   * @param {string} key 要存储的数据的名称（键）
   * @param {any} value 要存储的数据的值（值）
   * @param {Object} option 可选参数
   * @param {boolean} option.async 是否使用异步操作
   * @returns {Promise<void>}
   */
  setItem<T> (key: string, value: T, option?: AsyncOption): Promise<void> {
    key = this.getFillKey(key)
    return new Promise((resolve, reject) => {
      if (option && option.async) {
        // 异步操作
        this._global.setStorage({
          key,
          data: value,
          success: () => resolve(),
          fail: reject
        })
      } else {
        // 同步操作
        try {
          this._global.setStorageSync(key, value)
          resolve()
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  /**
   * 检索指定的键所对应的值
   * @param {string} key 要检索的数据的名称（键）
   * @param {Object} option 可选参数
   * @param {boolean} option.async 是否使用异步操作
   * @returns {Promise<any>}
   */
  getItem<T> (key: string, option?: AsyncOption): Promise<T> {
    key = this.getFillKey(key)
    return new Promise((resolve, reject) => {
      if (option && option.async) {
        // 异步操作
        this._global.getStorage({
          key,
          success: (res: any) => resolve(res.data),
          fail: reject
        })
      } else {
        // 同步操作
        try {
          const res = this._global.getStorageSync(key)
          resolve(res)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  /**
   * 删除指定的键所对应的值
   * @param {string} key 要删除的数据的名称（键）
   * @param {Object} option 可选参数
   * @param {boolean} option.async 是否使用异步操作
   * @returns {Promise<void>}
   */
  removeItem (key: string, option?: AsyncOption): Promise<void> {
    key = this.getFillKey(key)
    return new Promise((resolve, reject) => {
      if (option && option.async) {
        // 异步操作
        this._global.removeStorage({
          key,
          success: () => resolve(),
          fail: reject
        })
      } else {
        // 同步操作
        try {
          this._global.removeStorageSync(key)
          resolve()
        } catch (err) {
          reject(err)
        }
      }
    })
  }

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
  clear(callback?: (key: string) => boolean, option?: AsyncOption) {
    const hasCallBack = typeof callback === 'function'
    const promises: Promise<void>[] = []

    const { keys } = this._global.getStorageInfoSync()
    keys.forEach((key: string) => {
      if (hasCallBack && !callback(key)) return

      promises.push(new Promise((resolve, reject) => {
        if (option && option.async) {
          // 异步操作
          this._global.removeStorage({
            key,
            success: () => resolve(),
            fail: reject
          })
        } else {
          // 同步操作
          try {
            this._global.removeStorageSync(key)
            resolve()
          } catch (err) {
            reject(err)
          }
        }
      }))
    })

    return Promise.all(promises)
  }
}