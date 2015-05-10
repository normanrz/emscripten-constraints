function loadModule(moduleUrl, path) {
    var solverObj = null;
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        var DONE = request.DONE || 4;
        if (request.readyState === DONE){
            if (request.status == 200) {
                console.log("evaluating asmjs code...");
                solverObj = new Function(request.responseText)();
                // console.log("solverObj", solverObj);
            } else {
                console.error("error while loading ", moduleUrl);
            }
        } 
    };
    request.open("GET", path + moduleUrl, false); // be synchronous
    request.send();
    return solverObj;
}