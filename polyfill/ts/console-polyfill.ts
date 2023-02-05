(function (this: any) {
  this.console ??= {
    log() {
      output(WScript.StdOut, arguments);
    },
    error() {
      output(WScript.StdErr, arguments);
    },
  };
  function output(stream: IWshRuntimeLibrary.TextStreamWriter, messages: IArguments) {
    stream.WriteLine(`[${new Date().toLocaleTimeString()}] ${Array.from(messages, m => String(m)).join(' ')}`);
  }
})();
