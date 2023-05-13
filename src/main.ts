import { _Cookie, CookieCtorOptions } from "./cookie/index"
import { _Storage, StorageCtorOptions } from "./storage/index"
import { _MiniProgramStorage, MiniProgramCtorOptions } from "./miniprogram/index"

export interface WebStorageCtorOptions extends CookieCtorOptions {}
export class WebStorage {
  cookie: _Cookie
  local: _Storage
  session: _Storage

  constructor(options: WebStorageCtorOptions) {
    this.cookie = new _Cookie(options)
    this.local = new _Storage(Object.assign({type: "localStorage"}, options) as StorageCtorOptions)
    this.session = new _Storage(Object.assign({type: "sessionStorage"}, options) as StorageCtorOptions)
  }
}

export class MiniProgramStorage extends _MiniProgramStorage {
  constructor(options: MiniProgramCtorOptions) {
    super(options)

    // @ts-ignore
    if (wx) { this._global = wx }
    // @ts-ignore
    else if (my) { this._global = my }
  }
}
