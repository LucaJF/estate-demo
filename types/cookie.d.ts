declare module 'cookie' {
  export interface CookieSerializeOptions {
    domain?: string | undefined
    encode?: ((val: string) => string) | undefined
    expires?: Date | undefined
    httpOnly?: boolean | undefined
    maxAge?: number | undefined
    path?: string | undefined
    sameSite?: boolean | 'lax' | 'strict' | 'none' | undefined
    secure?: boolean | undefined
    priority?: 'low' | 'medium' | 'high' | undefined
    partitioned?: boolean | undefined
  }
  export interface CookieParseOptions {
    decode?: ((val: string) => string) | undefined
  }
  export function parse(str: string, options?: CookieParseOptions): Record<string, string>
  export function serialize(name: string, val: string, options?: CookieSerializeOptions): string
}
