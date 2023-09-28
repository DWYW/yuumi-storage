import { _YuumiStorage, _YuumiStorageOption } from "./core/storage"

export * from "./core/cookie"

export class YuumiLocalStorage extends _YuumiStorage {
  constructor(option?: _YuumiStorageOption) {
    super(() => window.localStorage, option)
  }
}

export class YuumiSessionStorage extends _YuumiStorage {
  constructor(option?: _YuumiStorageOption) {
    super(() => window.sessionStorage, option)
  }
}

export * from "./core/miniprogram"