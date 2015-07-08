var memoryInitializerPath = null;
function loadModule(moduleUrl, path, callback) {
    var solverObj = null;
    memoryInitializerPath = path;

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        var DONE = request.DONE || 4;
        if (request.readyState === DONE){
            if (request.status == 200) {
                debugger
                // emscripten puts Module into global namespace if it
                // determines that it runs in the web
                // save potential old window.Module
                var oldWindowModule;
                if (window.Module) {
                    oldWindowModule = window.Module;
                }

                console.log("Evaluating asmjs code...");
                solverObj = new Function(request.responseText)();

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
}