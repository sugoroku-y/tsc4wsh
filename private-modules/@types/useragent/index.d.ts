declare namespace UserAgent {
  /** HTTPのsetProxy用設定値 */
  const enum SXH_PROXY_SETTING {
    /** SXH_PROXY_SET_PRECONFIGのエイリアス */
    SXH_PROXY_SET_DEFAULT = 0,
    /** プロキシを使わない。 */
    SXH_PROXY_SET_DIRECT = 1,
    /** レジストリにあるプロキシ設定を使用する。 */
    SXH_PROXY_SET_PRECONFIG = 0,
    /** 指定されたプロキシを使う。 */
    SXH_PROXY_SET_PROXY = 2,
  }
  /** HTTPのgetOption/setOption用 */
  const enum SERVERXMLHTTP_OPTION {
    /** 安全でないASCII文字をURLencodeするかどうか:真偽値(デフォルト:偽) */
    SXH_OPTION_ESCAPE_PERCENT_IN_URL = 1,
    /** SXH_SERVER_CERT_OPTIONで指定される問題をエラーとするかのフラグ:DWORD(デフォルト:0)sendを呼ぶ前に設定する必要がある。 */
    SXH_OPTION_IGNORE_SERVER_SSL_CERT_ERROR_FLAGS = 2,
    /** 送信するクライアント証明書の名前: 文字列(デフォルト:空文字列=ローカルストアの最初の証明書を使用する) */
    SXH_OPTION_SELECT_CLIENT_SSL_CERT = 3,
    /** 最後に使用したURL: 文字列(読み取り専用) */
    SXH_OPTION_URL = -1,
    /** URL文字列をシングルバイト表現に変換するために使用されるコードページ: 符号なし整数値(デフォルト: CP_UTF8) */
    SXH_OPTION_URL_CODEPAGE = 0,
  }
  const enum SXH_SERVER_CERT_OPTION {
    /** 未知の認証局 */
    SXH_SERVER_CERT_IGNORE_UNKNOWN_CA = 0x100,
    /** subjectの指定がないなどの不正な証明書 */
    SXH_SERVER_CERT_IGNORE_WRONG_USAGE = 0x200,
    /** 使用されている証明書名の不一致 */
    SXH_SERVER_CERT_IGNORE_CERT_CN_INVALID = 0x1000,
    /** 無効な日付、もしくは有効期限切れ */
    SXH_SERVER_CERT_IGNORE_CERT_DATE_INVALID = 0x2000,
    /** すべての証明書のエラー */
    SXH_SERVER_CERT_IGNORE_ALL_SERVER_ERRORS = SXH_SERVER_CERT_IGNORE_UNKNOWN_CA |
      SXH_SERVER_CERT_IGNORE_WRONG_USAGE |
      SXH_SERVER_CERT_IGNORE_CERT_CN_INVALID |
      SXH_SERVER_CERT_IGNORE_CERT_DATE_INVALID,
  }
  /** httpでサーバーに接続する。  */
  interface HTTP {
    /** HTTPリクエストの中断 */
    abort(): void;
    /** すべてのHTTPレスポンスヘッダの取得 */
    getAllResponseHeaders(): string;
    /** 最後に使用したURLの取得 */
    getOption(option: SERVERXMLHTTP_OPTION.SXH_OPTION_URL): string;
    /** 安全でないASCII文字をURLencodeするかどうかを取得 */
    getOption(option: SERVERXMLHTTP_OPTION.SXH_OPTION_ESCAPE_PERCENT_IN_URL): boolean;
    /** SXH_SERVER_CERT_OPTIONで指定される問題をエラーとするかのフラグを取得 */
    getOption(option: SERVERXMLHTTP_OPTION.SXH_OPTION_IGNORE_SERVER_SSL_CERT_ERROR_FLAGS): number;
    /** 送信するクライアント証明書の名前を取得。空文字列=ローカルストアの最初の証明書を使用する */
    getOption(option: SERVERXMLHTTP_OPTION.SXH_OPTION_SELECT_CLIENT_SSL_CERT): string;
    /** URL文字列をシングルバイト表現に変換するために使用されるコードページを取得。 */
    getOption(option: SERVERXMLHTTP_OPTION.SXH_OPTION_URL_CODEPAGE): number;
    /** HTTPレスポンスヘッダの取得 */
    getResponseHeader(header: string): string;
    /** readystateプロパティの変更イベント */
    readonly onreadystatechange: unknown;
    /** HTTP接続を開く */
    open(method: string, url: string, async?: unknown, user?: unknown, password?: any): void;
    /** ready state */
    readonly readyState: number;
    /** レスポンスの内容 */
    readonly responseBody: unknown;
    /** レスポンスの内容 */
    readonly responseStream: unknown;
    /** レスポンスの内容 */
    readonly responseText: string;
    /** レスポンスの内容 */
    readonly responseXML: unknown;
    /** HTTPリクエストを送信 */
    send(body?: any): void;
    /** 安全でないASCII文字をURLencodeするかどうか:真偽値(デフォルト:偽) */
    setOption(option: SERVERXMLHTTP_OPTION.SXH_OPTION_ESCAPE_PERCENT_IN_URL, value: boolean): void;
    /** SXH_SERVER_CERT_OPTIONで指定される問題をエラーとするかのフラグ:DWORD(デフォルト:0)sendを呼ぶ前に設定する必要がある。 */
    setOption(option: SERVERXMLHTTP_OPTION.SXH_OPTION_IGNORE_SERVER_SSL_CERT_ERROR_FLAGS, value: number): void;
    /** 送信するクライアント証明書の名前: 文字列(デフォルト:空文字列=ローカルストアの最初の証明書を使用する) */
    setOption(option: SERVERXMLHTTP_OPTION.SXH_OPTION_SELECT_CLIENT_SSL_CERT, value: string): void;
    /** URL文字列をシングルバイト表現に変換するために使用されるコードページ: 符号なし整数値(デフォルト: CP_UTF8) */
    setOption(option: SERVERXMLHTTP_OPTION.SXH_OPTION_URL_CODEPAGE, value: number): void;
    /** レジストリからプロキシ設定を読み取り */
    setProxy(proxySetting: SXH_PROXY_SETTING.SXH_PROXY_SET_PRECONFIG): void;
    /** プロキシを使用しない */
    setProxy(proxySetting: SXH_PROXY_SETTING.SXH_PROXY_SET_DIRECT): void;
    /** 指定したプロキシを使用する。 */
    setProxy(proxySetting: SXH_PROXY_SETTING.SXH_PROXY_SET_PROXY, proxyServer: string, bypassList?: string): void;
    /** プロキシ用の認証情報を設定する。 */
    setProxyCredentials(userName: string, password: string): void;
    /** HTTPリクエストヘッダを設定 */
    setRequestHeader(header: string, value: string): void;
    /** 各種タイムアウトを設定(単位ミリ秒) */
    setTimeouts(resolveTimeout: number, connectTimeout: number, sendTimeout: number, receiveTimeout: number): void;
    /** HTTPステータスコード */
    readonly status: number;
    /** HTTPステータス */
    readonly statusText: string;
    /**
     * 非同期送信が完了するかタイムアウトするまで待機する。
     * @param timeoutInSeconds {number} タイムアウトまでの時間(単位秒)
     */
    waitForResponse(timeoutInSeconds?: number): boolean;
  }
}

interface ActiveXObjectNameMap {
  'MSXML2.ServerXMLHTTP': UserAgent.HTTP;
}
