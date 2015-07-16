(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.loader = factory();
  }
}(this, function () {
  return function loadModule(moduleUrl, path, callback) {
    var solverObj = null;

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      var DONE = request.DONE || 4;
      if (request.readyState === DONE){
        if (request.status == 200) {
          // emscripten puts Module into global namespace if it
          // determines that it runs in the web
          // save potential old window.Module
          var oldWindowModule;
          if (window.Module) {
            oldWindowModule = window.Module;
          }

          console.log("Evaluating asmjs code...");
          var newCode = "var memoryInitializerPath = '" + path + "';" + request.responseText;
          solverObj = new Function(newCode)();

          if (oldWindowModule) {
            window.Module = oldWindowModule;
          } else {
            delete window.Module;
          }
          callback(solverObj);
        } else {
          console.error("Error while loading ", moduleUrl);
        }
      }
    };
    request.open("GET", path + moduleUrl);
    request.send();
  };
}));
