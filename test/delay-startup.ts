/// <reference types="generator" />

declare const fso: Scripting.FileSystemObject;
declare const wshshell: IWshRuntimeLibrary.WshShell;

const shortcuts: {[targetPath: string]: string} = {};

// スクリプトと同じディレクトリにあるショートカットの実体をMapに記憶
const dir = fso.GetFolder(fso.GetParentFolderName(WScript.ScriptFullName));
for (const file of Generator.from(dir.Files)) {
  if (!/\.lnk$/i.test(file.Name)) {
    continue;
  }
  const shortcut = wshshell.CreateShortcut(file.Path);
  shortcuts[shortcut.TargetPath.toLowerCase()] = file.Path;
}

// tslint:disable-next-line:interface-name
interface ActiveXObjectNameMap {
  'WbemScripting.SWbemLocator': {
    ConnectServer(): {
      ExecQuery(
        wql: string
      ): {
        Item(
          index: any
        ): {
          Caption: string;
          CommandLine: string;
          CreationClassName: string;
          CreationDate: VarDate;
          CSCreationClassName: string;
          CSName: string;
          Description: string;
          ExecutablePath: string;
          ExecutionState: number;
          Handle: string;
          HandleCount: number;
          InstallDate: string;
          KernelModeTime: number;
          MaximumWorkingSetSize: number;
          MinimumWorkingSetSize: number;
          Name: string;
          OSCreationClassName: string;
          OSName: string;
          OtherOperationCount: number;
          OtherTransferCount: number;
          PageFaults: number;
          PageFileUsage: number;
          ParentProcessId: number;
          PeakPageFileUsage: number;
          PeakVirtualSize: number;
          PeakWorkingSetSize: number;
          Priority: number;
          PrivatePageCount: number;
          ProcessId: number;
          QuotaNonPagedPoolUsage: number;
          QuotaPagedPoolUsage: number;
          QuotaPeakNonPagedPoolUsage: number;
          QuotaPeakPagedPoolUsage: number;
          ReadOperationCount: number;
          ReadTransferCount: number;
          SessionId: number;
          Status: string;
          TerminationDate: VarDate;
          ThreadCount: number;
          UserModeTime: number;
          VirtualSize: number;
          WindowsVersion: string;
          WorkingSetSize: number;
          WriteOperationCount: number;
          WriteTransferCount: number;
          Terminate(): void;
        };
      };
    };
  };
}

const oLocator = WScript.CreateObject('WbemScripting.SWbemLocator');
const oService = oLocator.ConnectServer();
while (true) {
  // 現在実行中の全プロセスを取得、ショートカットの実体と同じだったらショートカットのマップから削除
  const oClassSet = oService.ExecQuery('Select * From Win32_Process');
  for (const objProcess of Generator.from(oClassSet)) {
    if (!objProcess.ExecutablePath) {
      continue;
    }
    delete shortcuts[objProcess.ExecutablePath.toLowerCase()];
  }
  const lnkpaths = Object.values(shortcuts);
  // ショートカットのMapが空になったら終了
  if (!lnkpaths.length) {
    break;
  }
  // 起動できていないショートカットを実行
  for (const lnkpath of lnkpaths) {
    wshshell.Run(`"${lnkpath}"`);
  }
  // 五秒待つ
  WScript.Sleep(5000);
}
