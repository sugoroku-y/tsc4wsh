/// <reference types="wscript-util" />
/// <reference types="generator" />
/// <reference types="filesystemobject-util" />
/// <reference types="windows-installer" />
/// <reference types="msxml2" />
/// <reference types="activex-shell" />

namespace filever {
  declare const fso: Scripting.FileSystemObject;
  declare const installer: WindowsInstaller.Installer;
  const fsoU = Scripting.FileSystemObject.Utils;
  declare const wshShell: IWshRuntimeLibrary.WshShell;
  declare const shellapp: Shell32.Shell;

  /**
   * ファイルのバージョンを取得する。
   *
   * 具体的に取得するバージョンは以下のとおり。
   *
   * - msiはPropetyテーブルのProductVersion
   * - mspはPatch情報XMLのUpdatedVersion
   * - exeやdllなどバージョンリソースのあるものはそのバージョンリソース
   * - バージョンリソースの無いものは`-`
   *
   * @param filepath バージョンを取得するファイルへのパス。
   * @return \{{{string}}\} ファイルのバージョン。
   */
  function getFileVersion(filepath: string) {
    if (/\.msi$/i.test(filepath)) {
      const db = installer.OpenDatabase(filepath, 0);
      const view = db.OpenView(
        `SELECT Value FROM Property WHERE Property = 'ProductVersion'`
      );
      try {
        view.Execute();
        const record = view.Fetch();
        return record.StringData(1);
      } finally {
        view.Close();
      }
    }
    if (/\.msp$/i.test(filepath)) {
      const xml = installer.ExtractPatchXMLData(filepath);
      const doc = WScript.CreateObject('Msxml2.DOMDocument.6.0');
      doc.async = false;
      doc.setProperty(
        'SelectionNamespaces',
        `xmlns:patch='http://www.microsoft.com/msi/patch_applicability.xsd'`
      );
      if (!doc.loadXML(xml)) {
        throw new Error(`${filepath}:
    errorCode: ${doc.parseError.errorCode}
    reason: ${doc.parseError.reason}
    line: ${doc.parseError.line}
    linepos: ${doc.parseError.linepos}
    filepos: ${doc.parseError.filepos}
    srcText: ${doc.parseError.srcText}
    url: ${doc.parseError.url}`);
      }
      return doc.selectSingleNode(
        '/patch:MsiPatch/patch:TargetProduct/patch:UpdatedVersion'
      ).text;
    }
    return installer.FileVersion(filepath) || '-';
  }

  /** ファイル内容からのハッシュを16進文字列で返す。 */
  function FileHash(filepath: string) {
    const record = installer.FileHash(filepath, 0);
    let hexhash = '';
    for (let i = 1; i <= 4; ++i) {
      const hash = record.IntegerData(i);
      // tslint:disable-next-line:no-bitwise
      for (const h of [(hash >> 16) & 0xffff, hash & 0xffff]) {
        hexhash += h.toString(16).padStart(4, '0');
      }
    }
    return hexhash;
  }

  /** 電子署名済みであれば署名者を返す。 */
  function checkSignature(file: Scripting.File) {
    // 署名チェックツールの実行
    const process = (wshShell.Exec(
      `"${signtool()}" verify /pa /v "${file.Path}"`
    ) as any) as {
      readonly ExitCode: number;
      readonly ProcessID: number;
      readonly Status: IWshRuntimeLibrary.WshExecStatus;
      readonly StdErr: IWshRuntimeLibrary.TextStreamReader;
      readonly StdIn: IWshRuntimeLibrary.TextStreamWriter;
      readonly StdOut: IWshRuntimeLibrary.TextStreamReader;
      Terminate(): void;
    };
    // 標準出力および標準エラー出力から署名情報を取得
    let signer = '';
    let inSigningCertificateChain = false;
    let timestamped = false;
    while (!process.StdOut.AtEndOfStream || !process.StdErr.AtEndOfStream) {
      const line = (process.StdOut.AtEndOfStream
        ? process.StdErr.ReadLine()
        : process.StdOut.ReadLine()
      ).trim();
      // 署名
      if (line.startsWith('Signing Certificate Chain:')) {
        inSigningCertificateChain = true;
        continue;
      }
      // 時刻署名
      if (line.startsWith('Timestamp Verified by:')) {
        inSigningCertificateChain = false;
        continue;
      }
      // 署名確認成功
      if (line.startsWith('Successfully verified: ')) {
        inSigningCertificateChain = false;
        break;
      }
      // 時刻署名の確認
      if (line.startsWith('The signature is timestamped: ')) {
        timestamped = true;
        continue;
      }
      // 拡張子の形式になっていないので無視
      if (
        line ===
        'SignTool Error: This file format cannot be verified because it is not'
      ) {
        signer = '署名対象外';
        break;
      }
      // 署名していない
      if (line === 'SignTool Error: No signature found.') {
        signer = '署名していない';
        break;
      }
      // 署名エラー
      if (line.startsWith('SignTool Error: ')) {
        signer = `!!!!署名エラー(${line.substr(16)})!!!!`;
        break;
      }
      // 署名済み
      if (inSigningCertificateChain && line.startsWith('Issued to: ')) {
        signer = line.substr(11);
        continue;
      }
    }
    // サインツールのエラー
    if (!signer) {
      signer = '!!!!sintool error!!!!';
    }
    // 時刻署名しているかどうかもチェック
    if (!timestamped) {
      signer = `!!!!時刻署名なし!!!!(${signer})`;
    }
    return signer;
  }

  // コンテンツの作成日時を返す
  function GetContentCreationDate(file: Scripting.File) {
    if (fso.GetExtensionName(file.Name).toLowerCase() === 'msp') {
      // MSPだけはMsiPatchMetadataのCreationTimeUTCから取得
      const database = installer.OpenDatabase(
        file.Path,
        WindowsInstaller.msiOpenDatabaseMode.msiOpenDatabaseModePatchFile
      );
      const view = database.OpenView(
        `SELECT Value FROM MsiPatchMetadata WHERE Property = 'CreationTimeUTC'`
      );
      try {
        view.Execute();
        const record = view.Fetch();
        if (!record) {
          return;
        }
        const match = record
          .StringData(1)
          .match(/^(\d+)-(\d+)-(\d+)\s+(\d+:\d+)$/);
        if (!match) {
          return;
        }
        return new Date(
          `${match[1]}/${match[2]}/${match[3]} ${match[4]}`
        ).toLocaleString();
      } finally {
        view.Close();
      }
    }
    const folder = shellapp.NameSpace(file.ParentFolder.Path);
    if (!folder) {
      return;
    }
    const folderItem = folder.ParseName(file.Name);
    if (!folderItem) {
      return;
    }
    const timestamp = folderItem.ExtendedProperty(
      '{F29F85E0-4FF9-1068-AB91-08002B27B3D9} 12'
    );
    if (timestamp !== undefined) {
      return new Date(timestamp).toLocaleString(); // コンテンツの作成日時
    }
  }

  // ADODB.Streamが返すバイナリストリームをJavaScriptで扱えるように変換するため、dataType: 'bin.hex'を使う
  const el = WScript.CreateObject('Msxml2.DOMDocument.6.0').createElement('t');
  // ADODB.Streamからバイナリデータを読み込む
  function readStream(
    stream: ADODB.Stream,
    pos: number,
    length: 1 | 2 | 4 | 8,
    bigEndian?: true
  ): number | null {
    if (pos > stream.Size) {
      return null;
    }
    stream.Position = pos;
    el.dataType = 'bin.hex';
    el.nodeTypedValue = stream.Read(length);
    return parseInt(
      bigEndian
        ? el.text
        : el.text
            .split(/(?=(?:[0-9a-f]{2})+$)/)
            .reverse()
            .join(''),
      16
    );
  }

  // ビルドした日時を返す
  function GetBuildDate(file: Scripting.File | Scripting.Folder) {
    if (!fsoU.isFile(file)) {
      return;
    }
    // MSI/MSPは作成日時
    switch (fso.GetExtensionName(file.Name).toLowerCase()) {
      case 'msi':
      case 'msp':
        return GetContentCreationDate(file);
    }
    const STREAM = WScript.CreateObject('ADODB.Stream');
    STREAM.Mode = ADODB.ConnectModeEnum.adModeReadWrite;
    STREAM.Type = ADODB.StreamTypeEnum.adTypeBinary;
    STREAM.Open();
    try {
      STREAM.LoadFromFile(file.Path);
      if (readStream(STREAM, 0, 2, true) !== 0x4d5a /* MZ */) {
        return;
      }
      const pePos = readStream(STREAM, 0x3c, 4);
      if (pePos === null) {
        return;
      }
      if (readStream(STREAM, pePos, 2, true) !== 0x5045 /* PE */) {
        return;
      }
      const timestamp = readStream(STREAM, pePos + 8, 4);
      if (timestamp === null) {
        return;
      }
      // timestampは1970年1月1日午前0時0分0秒からの経過秒数なのでミリ秒に変換
      return new Date(timestamp * 1000).toLocaleString();
    } finally {
      STREAM.Close();
    }
  }

  /**
   * ワイルドカード、相対パスの基準ディレクトリ。
   * コマンドラインオプション/basedirで変更可能。
   */
  const basedir = WScriptUtil.Arguments.Named(['BaseDir', 'Base', 'B']) || '.';
  /**
   * 出力するファイル情報のフォーマット。
   * 省略時は`$r\t$v`(相対パスとバージョン)
   */
  const format = WScriptUtil.Arguments.Named(['Format', 'F']) || '$r\t$v';

  /**
   * 追加書き込みするかどうか。省略時には新規書き込み。
   */
  const appendMode = WScriptUtil.Arguments.Switch(['Append', 'A']);

  /**
   * 出力先のファイル。省略時には標準出力を使う。
   */
  const output: {
    WriteLine: (s: string) => void;
  } = WScriptUtil.Arguments.Named({
    key: ['Output', 'Out', 'O'],
    // tslint:disable-next-line:object-literal-sort-keys
    conv: outputPath => {
      if (!outputPath) {
        return WScript.StdOut;
      }
      const mode = appendMode
        ? Scripting.IOMode.ForAppending
        : Scripting.IOMode.ForWriting;
      return fso.OpenTextFile(
        outputPath,
        mode,
        true,
        Scripting.Tristate.TristateFalse
      );
    },
  });
  /**
   * 使い方を表示するかどうか。
   */
  const showHelp = WScriptUtil.Arguments.Switch(['Help', 'H', '?']);

  /** 無視するファイル・ディレクトリを判定する。 FileOnlyが指定されていればファイル以外を無視、DirectoryOnlyが指定されていればディレクトリ以外を無視。 */
  const ignored = WScriptUtil.Arguments.Switch('FileOnly')
    ? (file: Scripting.File | Scripting.Folder) => !fsoU.isFile(file)
    : WScriptUtil.Arguments.Switch('DirectoryOnly')
    ? (file: Scripting.File | Scripting.Folder) => !fsoU.isFolder(file)
    : () => false;

  // コマンドラインオプションでsigntoolの指定があればそちらを優先する。
  let signtoolCache = WScriptUtil.Arguments.Named('SignTool');
  // 利用されるまでパス解決を行わないようにする
  function signtool() {
    // コマンドラインオプションでの指定があった場合はそちらを、既にコマンドを実行した場合は前回の結果を使用する。
    if (signtoolCache !== undefined) {
      return signtoolCache;
    }
    if (fso.FileExists('signtool.exe')) {
      // カレントディレクトリにあれば'signtool'だけでいい
      return (signtoolCache = 'signtool');
    }
    const onscriptpath = fso.BuildPath(
      fso.GetParentFolderName(WScript.ScriptFullName),
      'signtool.exe'
    );
    if (fso.FileExists(onscriptpath)) {
      // スクリプトと同じディレクトリにあればそれを使う
      return (signtoolCache = onscriptpath);
    }
    for (const path of wshShell.Environment.Item('PATH').split(/;/)) {
      if (
        fso.FileExists(
          fso.BuildPath(path.replace(/^"(.*)"$/, '$1'), 'signtool.exe')
        )
      ) {
        // Pathが通っていれば'signtool'だけでいい
        return (signtoolCache = 'signtool');
      }
    }
    // signtoolにパスが通っていなければレジストリからsigntoolのフルパスを取得
    try {
      const sdk = wshShell.RegRead(
        'HKLM\\SOFTWARE\\Microsoft\\Microsoft SDKs\\Windows\\CurrentInstallFolder'
      );
      if (typeof sdk === 'string') {
        return (signtoolCache = fsoU.resolve(sdk, 'bin', 'signtool.exe'));
      }
    } catch (ex) {
      // レジストリからも取得に失敗したら例外
      throw new Error(`signtoolが見つかりません。: ${ex.toString}`);
    }
  }

  /**
   * タイムスタンプを表示しないファイル名のパターン
   */
  const notimestamp = WScriptUtil.Arguments.Named(
    'NoTimeStamp',
    param => (param && fsoU.wildcardToRegExp(param)) || undefined
  );

  let shellappdesktopCache: Shell32.Folder3 | null | undefined;
  function ShellappDesktop() {
    if (shellappdesktopCache !== undefined) {
      return shellappdesktopCache;
    }
    shellappdesktopCache = shellapp.NameSpace(
      Shell32.ShellSpecialFolderConstants.ssfDESKTOP
    );
    return shellappdesktopCache || (shellappdesktopCache = null);
  }

  function GetExtendedProperty(
    file: Scripting.Folder | Scripting.File,
    propertyName: string
  ): string | null {
    const desktop = ShellappDesktop();
    if (!desktop) {
      return '-';
    }
    const item = desktop.ParseName(file.Path);
    if (!item) {
      return '-';
    }
    const c = item.ExtendedProperty(propertyName);
    if (!c) {
      return '-';
    }
    return c;
  }
  /**
   * 表示されるファイルの情報
   */
  const COLUMNS: {
    [arg: string]: (file: Scripting.File | Scripting.Folder) => string;
  } = {
    // ビルド日時。ビルド日時の取得できないファイル、ディレクトリの場合は`-`
    build: file => GetBuildDate(file) || '-',
    // バージョンリソースの
    company: file =>
      (fsoU.isFile(file) && GetExtendedProperty(file, 'System.Company')) || '-',
    // バージョンリソースの著作権欄
    copyright: file =>
      (fsoU.isFile(file) && GetExtendedProperty(file, 'System.Copyright')) ||
      '-',
    // ファイルの存在するディレクトリ(ディレクトリの場合はそのディレクトリ自身)のフルパス。
    directory: file => (fsoU.isFolder(file) ? file : file.ParentFolder).Path,
    // フルパス。
    fullpath: file => file.Path,
    // 16進文字列で表記したファイルハッシュ。ディレクトリの場合は`-`
    hash: file => (fsoU.isFolder(file) ? '-' : FileHash(file.Path)),
    // ファイルサイズ(桁区切り無し)、ディレクトリの場合は`-`
    length: file => (fsoU.isFolder(file) ? '-' : '' + file.Size),
    // ファイル名、ディレクトリの場合は`-`。
    name: file => (fsoU.isFolder(file) ? '-' : file.Name),
    // 相対パス。基準となるディレクトリは/BaseDirで指定する。
    relative: file => fsoU.relativePath(file.Path, basedir),
    // directoryの相対パス版。基準となるディレクトリは/BaseDirで指定する。
    reldir: file =>
      fsoU.relativePath(
        (fsoU.isFolder(file) ? file : file.ParentFolder).Path,
        basedir
      ),
    // 電子署名済みの場合は署名者。署名に不備があれば不備の内容。ディレクトリの場合は`-`
    sign: file => (fsoU.isFile(file) ? checkSignature(file) : '-'),
    // ファイルサイズ(3桁区切り)、ディレクトリの場合は`-`
    size: file =>
      fsoU.isFolder(file)
        ? '-'
        : ('' + file.Size).replace(/\d(?=(?:\d{3})+$)/g, '$&,'),
    // タイムスタンプ
    timestamp: file =>
      (notimestamp && notimestamp.test(file.Name) && '-') ||
      new Date(file.DateLastModified).toLocaleString(),
    // ファイルのバージョン。ディレクトリ、バージョンのないファイルは`-`
    version: file => (fsoU.isFolder(file) ? '-' : getFileVersion(file.Path)),
  };
  // 各情報のエイリアス
  COLUMNS.n = COLUMNS.name;
  COLUMNS.d = COLUMNS.dir = COLUMNS.directory;
  COLUMNS.s = COLUMNS.size;
  COLUMNS.l = COLUMNS.len = COLUMNS.length;
  COLUMNS.v = COLUMNS.ver = COLUMNS.version;
  COLUMNS.f = COLUMNS.full = COLUMNS.fullpath;
  COLUMNS.r = COLUMNS.rel = COLUMNS.relative;
  COLUMNS.t = COLUMNS.time = COLUMNS.timestamp;
  COLUMNS.h = COLUMNS.hash;
  COLUMNS.g = COLUMNS.sign;
  COLUMNS.b = COLUMNS.build;
  COLUMNS.rd = COLUMNS.reldir;
  COLUMNS.cp = COLUMNS.company;
  COLUMNS.cr = COLUMNS.copyright;

  function column(
    name: string,
    file: Scripting.File | Scripting.Folder
  ): string | undefined {
    if (!name) {
      return;
    }
    name = name.toLowerCase();
    if (!(name in COLUMNS)) {
      return;
    }
    return COLUMNS[name](file);
  }

  export function main() {
    if (showHelp) {
      WScript.StdOut
        .Write(`filevar.wsf: List information such as version and name of files and directories.

USAGE:
  cscript //nologo filver.wsf /Help
  cscript //nologo filver.wsf [/BaseDir:"base\\directory"] [/Format:"Format for output"] [/Output:"output file"] [path of files and directories...]

/Help
      Show this help.
      Alias: /H /?
/BaseDir:"base\\directory"
      Specify the base directory of the specified path pattern.
      If omitted, it is assumed that the current directory is specified.
      Alias: /Base /B
/Format:"Format for output"
      Specify the format used for output of file and directory information.
      If omitted, it is assumed that the '$r\\t$v' is specified
      Alias: /F

      $name
        The name of the file or the directory.
        Alias: $n
      $directory
        The path of the parent directory if it is a file, or its own path if it is a directory.
        Alias: $dir $d
      $size
        The three-digit delimited file size, or '-' if it is a directory.
        Alias: $s
      $length
        The file size(no delimited), or '-' if it is a directory.
        Alias: $len $l
      $version
        The version of the file, or '-' if it is a file without a version or it is a directory.
        Alias: $ver $v
      $fullpath
        The full path of the file or the directory.
        Alias: $full $f
      $relative
        The relative path of the file or the directory.
        Alias: $rel $r
      $reldir
        The relative path of the parent directory if it is a file, or its own relative path if it is a directory.
        Alias: $rd
      $timestamp
        The full path of the file or the directory.
        Alias: $time $t
      $hash
        The hash of the file, or '-' if it is a directory.
        Alias: $h
      $build
        The date to build the content.
        Alias: $b
      $sign
        The signer if the file is digitally signed, the error message if the signature it is incomplete. '-' if it is a directory.
        Alias: $g
      $company
        The company in the file version resource, or '-' if it is a directory, or with out the version resource.
        Alias: $cp
      $copyright
        The copyright in the file version resource, or '-' if it is a directory, or with out the version resource.
        Alias: $cr
/Output:"output file"
      The file to output into.
      If omitted, output into standard output.
      Alias: /Out /O
/Append
      Specify it with /Output, then append output to file.
/fileonly
      Show information of files only.
/directoryonly
      Show information of directories only.
      This parameter is ignored if \`/fileonly\` specified.
/notimestamp:filename-pattern
      Specify a pattern of file names that do not show timestamps.
      If omitted, show timestamps of all files.
/signtool:signtool_path
      Specify the path to 'signtool.exe'.
      If omitted, find signtool.exe from the current directory,
      this script directory, and Windows SDK directory

path of files and directories...
      Files and directories for listing information. Wild cards can be used.
      Example:
      *.dll
        DLL files in the current directory.
      aaa?.dll
        Dll files with only one letter after aaa.
      *.{exe;dll;ocx}
        EXE, DLL, OCX files in the current directory.
      aaa\\**\\*.{exe;dll;ocx}
        All EXE, DLL, OCX files under aaa directory.
`);
      return;
    }
    let args = [...Generator.from(WScript.Arguments.Unnamed)];
    if (args.length === 0) {
      args = ['**'];
    }

    // 各ファイル指定をワイルドカードとして展開
    for (const arg of args) {
      for (const file of fsoU.wildcard(arg, basedir)) {
        if (ignored(file)) {
          continue;
        }
        // 各ファイルの情報をフォーマットに従って出力
        output.WriteLine(
          format.replace(
            /\$(?:\{(\w+)\}|(\w+))|\\(?:x([0-9A-Fa-f]{2})|(.))/g,
            (whole, name1, name2, hex, ch) => {
              const value = column(name1 || name2, file);
              if (typeof value === 'string') {
                return value;
              }
              if (hex) {
                return String.fromCharCode(parseInt(hex, 16));
              }
              if (ch) {
                switch (ch) {
                  case 't':
                    return '\t';
                  case 'r':
                    return '\r';
                  case 'n':
                    return '\n';
                }
                return ch;
              }
              return whole;
            }
          )
        );
      }
    }
  }
}

filever.main();
