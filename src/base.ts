export interface BaseCtorOptions {
  prefix?: string;
  hyphen?: string;
}

export class BaseCtor {
  prefix: string;
  hyphen: string;

  constructor(options?: BaseCtorOptions) {
    const opts = Object.assign({
      prefix: "",
      hyphen: "_"
    }, options)

    this.prefix = opts.prefix
    this.hyphen = opts.hyphen
  }

  getFillKey(key: string) {
    return this.prefix ? `${this.prefix}${this.hyphen}${key}` : key
  }
}