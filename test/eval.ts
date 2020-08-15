/// <reference types="generator" />

/**
 * このスクリプトの使用方法を表示する
 */
function usage(): never {
  WScript.Echo(`
USAGE eval.wsf "script" [-r {${Object.keys(cachedProgid).join(
    '|'
  )}|name=progid}] [-l script_file]
`);
  return WScript.Quit(1) as never;
}

/**
 * -rでprogidを指定しなくても使えるように
 */
const cachedProgid: {[name: string]: string} = {
  fso: 'Scripting.FileSystemObject',
  installer: 'WindowsInstaller.Installer',
};
(function(this: any) {
  const args: string[] = [];
  const g = Generator.from(WScript.Arguments)[Symbol.iterator]();
  for (let ir = g.next(); !ir.done; ir = g.next()) {
    const arg = ir.value;
    if (arg === '--') {
      for (ir = g.next(); !ir.done; ir = g.next()) {
        args.push(ir.value);
      }
      break;
    }
    switch (arg) {
      case '-r':
      case '--require':
        // WScript.CreateObjectを一々呼び出さなくてもいいように-rで指定できるようにする
        const nextarg = ((ir = g.next() || usage()), ir.value);
        const eqIndex = nextarg.indexOf('=');
        const {name, progid} = (() => {
          if (eqIndex <= 0) {
            if (!(nextarg in cachedProgid)) {
              return usage();
            }
            return {name: nextarg, progid: cachedProgid[nextarg]};
          } else {
            return {
              name: nextarg.substr(0, eqIndex),
              progid: nextarg.substr(eqIndex + 1),
            };
          }
        })();
        this[name] = WScript.CreateObject(progid as any);
        continue;
      case '-l':
      case '--load':
        // 外部スクリプトを読み込めるようにする
        const loadpath = ((ir = g.next() || usage()), ir.value);
        new Function(
          WScript.CreateObject('Scripting.FileSystemObject')
            .OpenTextFile(arg)
            .ReadAll()
        ).call(this);
        continue;
    }
    args.push(arg);
  }
  // 最初の引数はスクリプト、それ以外はスクリプトへの引数
  const script = args.shift();
  // スクリプトがundefined=スクリプトが指定されなかったときは使い方を表示
  if (script === undefined) {
    return usage();
  }
  // Functionを使ってスクリプトを実行
  try {
    const r = new Function(`
      return eval("${script.replace(/["\\\x00-\x1f\x7f]/g, ch =>
        ch === '"' || ch === '\\'
          ? '\\' + ch
          : ch === '\t'
          ? '\\t'
          : ch === '\r'
          ? '\\r'
          : ch === '\n'
          ? '\\n'
          : '\\' +
            ch
              .charCodeAt(0)
              .toString(16)
              .padStart(2, '0')
      )}")
    `).apply(this, args);
    // スクリプトの返値をプロセスの終了コードとする
    WScript.Quit(+r || 0);
  } catch (ex) {
    WScript.StdErr.WriteLine(`${ex.name}(${ex.number}): ${ex.message}`);
    WScript.Quit(1);
  }
})();
