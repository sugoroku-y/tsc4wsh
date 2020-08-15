(function (this: any) {
  this.console = this.console || {};
  function output(stream: IWshRuntimeLibrary.TextStreamWriter, messages: IArguments) {
    stream.WriteLine(`[${new Date().toLocaleTimeString()}] ${Array.from(messages).map(m => m === undefined ? 'undefined' : m === null ? 'null' : m).join(' ')}`);
  }
  this.console.log = this.console.log || function log() {
    output(WScript.StdOut, arguments);
  };
  this.console.error = this.console.error || function error() {
    output(WScript.StdErr, arguments);
  };
})();
