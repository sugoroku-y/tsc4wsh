/// <reference types="windows-installer" />
/// <reference types="filesystemobject-util" />
/// <reference types="iterables" />
/// <reference types="activex-helpers" />

namespace msiinfo {
  declare const fso: Scripting.FileSystemObject;
  const fsoU = Scripting.FileSystemObject.Utils;
  declare const installer: WindowsInstaller.Installer;
  const msiOpenDatabaseModeReadOnly =
    WindowsInstaller.msiOpenDatabaseMode.msiOpenDatabaseModeReadOnly;

  WScript.StdOut.WriteLine(
    `パス\t製品名\tバージョン\tProductCode\tPackageCode\tUpgradeCode\t最終更新日時`
  );
  for (const arg of Iterables.from(WScript.Arguments.Unnamed)) {
    for (const file of Iterables.filter(fsoU.wildcard(arg), fsoU.isFile)) {
      const db = installer.OpenDatabase(file.Path, msiOpenDatabaseModeReadOnly);
      const summaryInfo = db.SummaryInformation(
        WindowsInstaller.SummaryPropertyId.COUNT_OF_PID
      );
      const subject = summaryInfo.Property(
        WindowsInstaller.SummaryPropertyId.PID_SUBJECT
      );
      const packageCode = summaryInfo.Property(
        WindowsInstaller.SummaryPropertyId.PID_REVNUMBER
      );
      const lastSaveTime = new Date(
        summaryInfo.Property(
          WindowsInstaller.SummaryPropertyId.PID_LASTSAVE_DTM
        )
      ).toISOString();
      const view = db.OpenView(
        'SELECT `Value` FROM `Property` WHERE `Property`=?'
      );
      const param = installer.CreateRecord(1);
      ActiveXObject.set(param, 'StringData', [1], 'ProductVersion');
      view.Execute(param);
      const productVersion = view.Fetch().StringData(1);
      ActiveXObject.set(param, 'StringData', [1], 'ProductCode');
      view.Execute(param);
      const productCode = view.Fetch().StringData(1);
      ActiveXObject.set(param, 'StringData', [1], 'UpgradeCode');
      view.Execute(param);
      const upgradeCode = view.Fetch().StringData(1);

      WScript.StdOut.WriteLine(
        [
          file.Path,
          subject,
          productVersion,
          productCode,
          packageCode,
          upgradeCode,
          lastSaveTime,
        ].join('\t')
      );
    }
  }
}
