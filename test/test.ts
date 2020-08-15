/// <reference types="wscript-util" />
/// <reference types="filesystemobject-util" />

const fsoU = Scripting.FileSystemObject.Utils;
declare const fso: Scripting.FileSystemObject;

const output = WScriptUtil.Arguments.Named({key: ['Output', 'Out', 'O'], conv: outputPath => {
  if (outputPath) return fso.OpenTextFile(outputPath, Scripting.IOMode.ForWriting, true, Scripting.Tristate.TristateFalse);
   return WScript.StdOut;
}});
for (const arg of WScriptUtil.Arguments.Unnamed()) {
  for (const item of fsoU.wildcard(arg)) {
    const d = new Date(item.DateLastModified);
    output.WriteLine(`${fsoU.relativePath(item.Path)} ${item.Size} ${d.toLocaleString()}`);
  }
}
