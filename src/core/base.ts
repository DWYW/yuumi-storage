// 过期时间：[天,时,分,秒]
export type ExpireTime = [number, number, number, number]

export interface _YuumiBaseStorageOption {
  prefix?: string
  hyphen?: string
  expirationTime?: ExpireTime
  expiredAutoDelete?: boolean
}

export class _YuumiBaseStorage {
  prefix: string;
  hyphen: string;
  expirationTime: ExpireTime
  expiredAutoDelete: boolean

  constructor(option?: _YuumiBaseStorageOption) {
    const _option = Object.assign({
      prefix: "",
      hyphen: "_",
      expiredAutoDelete: true
    }, option)

    this.prefix = _option.prefix
    this.hyphen = _option.hyphen
    this.expiredAutoDelete = _option.expiredAutoDelete
    this.expirationTime = [0, 0, 0, 0].map((item, index) => {
      if (_option.expirationTime instanceof Array) {
        return Number(_option.expirationTime[index]) || 0
      }
      return item
    }) as ExpireTime
  }

  getCompleteKey(key: string) {
    return this.prefix ? `${this.prefix}${this.hyphen}${key}` : key
  }

  getShortKey(key: string) {
    return this.prefix ? key.replace(`${this.prefix}${this.hyphen}`, ""): key
  }

  getExpires(): string {
    const [days, hours, minutes, seconds] = this.expirationTime
    const stamp = Date.now() +
      days * 24 * 60 * 60 * 1000 +
      hours * 60 * 60 * 1000 +
      minutes * 60 * 1000 +
      seconds * 1000
    return new Date(stamp).toUTCString()
  }
}