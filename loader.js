define([], function() {
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
                    console.time("prepend code");
                    var newCode = "var memoryInitializerPath = '" + path + "';" + request.responseText;
                    console.timeEnd("prepend code");
                    solverObj = new Function(newCode)();

                    if (oldWindowModule) {
                        console.log("restoring Module");
                        window.Module = oldWindowModule;
                    } else {
                        console.log("deleting Module");
                        delete window.Module;
                    }
                    console.log("calling callback");
                    callback(solverObj);
                } else {
                    console.error("Error while loading ", moduleUrl);
                }
            }
        };
        request.open("GET", path + moduleUrl);
        request.send();
    };
})
