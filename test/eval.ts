/// <reference types="generator" />

/**
 * このスクリプトの使用方法を表示する
 */
function usage(): never {
  WScript.Echo(`
USAGE eval.wsf "script" [-r {${Object.keys(cached_progid).join('|')}|name=progid}] [-l script_file]
`);
  return WScript.Quit(1) as never;
}

/**
 * -rでprogidを指定しなくても使えるように
 */
const cached_progid: {[name: string]: string} = {
  fso: 'Scripting.FileSystemObject',
  installer: 'WindowsInstaller.Installer',
};
(function (this: any) {
  const args: string[] = [];
  const g = Generator.from(WScript.Arguments)
  for (let ir = g.next(); !ir.done; ir = g.next()) {
    const arg = ir.value;
    if (arg === '--') {
      args.push(...g);
      break;
    }
    switch (arg) {
    case '-r':
    case '--require':
      // WScript.CreateObjectを一々呼び出さなくてもいいように-rで指定できるようにする
      const nextarg = (ir = g.next() || usage(), ir.value);
      var eqIndex = nextarg.indexOf('=');
      var name, progid;
      if (eqIndex <= 0) {
        name = nextarg;
        progid = cached_progid[nextarg];
        if (!progid) return usage();
      } else {
        name = nextarg.substr(0, eqIndex);
        progid = nextarg.substr(eqIndex + 1);
      }
      this[name] = WScript.CreateObject(progid as any);
      continue;
    case '-l':
    case '--load':
      // 外部スクリプトを読み込めるようにする
      const loadpath = (ir = g.next() || usage(), ir.value);
      new Function(WScript.CreateObject('Scripting.FileSystemObject').OpenTextFile(arg).ReadAll()).call(this);
      continue;
    }
    args.push(arg);
  }
  // 最初の引数はスクリプト、それ以外はスクリプトへの引数
  const _script = args.shift();
  // スクリプトがundefined=スクリプトが指定されなかったときは使い方を表示
  if (_script === undefined) return usage();
  // Functionを使ってスクリプトを実行
  try {
    const script = `return eval(${JSON.stringify(_script)})`;
    const r = new Function(script).apply(this, args);
    // スクリプトの返値をプロセスの終了コードとする
    WScript.Quit(+r || 0);
  } catch (ex) {
    WScript.StdErr.WriteLine(`${ex.name}(${ex.number}): ${ex.message}`);
    WScript.Quit(1);
  }
})();
