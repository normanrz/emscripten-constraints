function loadModule(moduleUrl) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        var DONE = request.DONE || 4;
        if (request.readyState === DONE){
            console.log("evaluating asmjs code...");
            var solverObj = new Function(request.responseText)();
            console.log("solverObj", solverObj);
        } else {
            console.error("error while loading z3");
        }
    };

    request.open("GET", moduleUrl, false); // be synchronous
    request.send();
}

loadModule("wrappedZ3.js");