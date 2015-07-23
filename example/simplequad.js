contentLoaded(window, function() {
    var InitializedEmZ3, dirty = true;

    var canvas = new fabric.Canvas('canvas', { selection: false, stateful: false });
    window.canvas = canvas;
    fabric.Object.prototype.originX = fabric.Object.prototype.originY =
        'center';

    function makeCircle(left, top) {
        var c = new fabric.Circle({
            left: left,
            top: top,
            strokeWidth: 2,
            radius: 3,
            fill: 'black',
            stroke: 'black'
        });
        c.hasControls = c.hasBorders = false;
        return c;
    }

    fabric.Circle.prototype.myCenter = function() {
        return new fabric.Point(this.left,this.top);
    };

    function makeLine(coords) {
        return new fabric.Line(coords, {
            fill: 'black',
            stroke: 'black',
            strokeWidth: 2,
            selectable: false
        });
    }

    fabric.Line.prototype.myEnd1 = function() {
        return new fabric.Point(this.x1,this.y1);
    };

    fabric.Line.prototype.myEnd2 = function() {
        return new fabric.Point(this.x2,this.y2);
    };

    var side1 = makeLine([ 200, 100, 410, 320 ]),
        side2 = makeLine([ 410, 320, 210, 450 ]),
        side3 = makeLine([ 210, 450,  60, 200 ]),
        side4 = makeLine([  60, 200, 200, 100 ]),
        mid1  = makeLine([ 130, 150, 305, 210 ]),
        mid2  = makeLine([ 305, 210, 310, 385 ]),
        mid3  = makeLine([ 310, 385, 135, 325 ]),
        mid4  = makeLine([ 134, 325, 130, 150 ]);

    var p1 = makeCircle(side1.get('x1'), side1.get('y1')),
        p2 = makeCircle(side2.get('x1'), side2.get('y1')),
        p3 = makeCircle(side3.get('x1'), side3.get('y1')),
        p4 = makeCircle(side4.get('x1'), side4.get('y1')),
        m1 = makeCircle( mid1.get('x2'),  mid1.get('y2')),
        m2 = makeCircle( mid2.get('x2'),  mid2.get('y2')),
        m3 = makeCircle( mid3.get('x2'),  mid3.get('y2')),
        m4 = makeCircle( mid4.get('x2'),  mid4.get('y2'));

    canvas.add(side1, side2, side3, side4,
               mid1, mid2, mid3, mid4,
               p1, p2, p3, p4, m1, m2, m3, m4);

    canvas.on('object:moving', function(e) {
        // var now = performance.now()
//    always: {side1.myEnd1().eq(p1.myCenter())}

        side1.set({'x1': p1.left, 'y1': p1.top, 'x2': p2.left, 'y2': p2.top});
        side2.set({'x1': p2.left, 'y1': p2.top, 'x2': p3.left, 'y2': p3.top});
        side3.set({'x1': p3.left, 'y1': p3.top, 'x2': p4.left, 'y2': p4.top});
        side4.set({'x1': p4.left, 'y1': p4.top, 'x2': p1.left, 'y2': p1.top});

        mid1.set({'x1': m4.left, 'y1': m4.top, 'x2': m1.left, 'y2': m1.top});
        mid2.set({'x1': m1.left, 'y1': m1.top, 'x2': m2.left, 'y2': m2.top});
        mid3.set({'x1': m2.left, 'y1': m2.top, 'x2': m3.left, 'y2': m3.top});
        mid4.set({'x1': m3.left, 'y1': m3.top, 'x2': m4.left, 'y2': m4.top});

        canvas._objects.each(function (o) { o.set(o); o.setCoords(); });
    });

    //setup default solver
    bbb.defaultSolver = new ClSimplexSolver();

    // code editor
    var codeEditor = document.getElementById('code');
    var solverSelect = document.getElementById('solver');

    var editorCallback = function() {
        if (solverSelect.value === "EmZ3") {
            bbb.defaultSolver = InitializedEmZ3;
            dirty = true;
        } else {
            // if (dirty) {
            //     InitializedEmZ3 = new EmZ3();
            //     dirty = false;
            // }
            bbb.defaultSolver = new (eval(solverSelect.value))();
        }

        // remove old constraints
        bbb.unconstrainAll(p1);
        bbb.unconstrainAll(p2);
        bbb.unconstrainAll(p3);
        bbb.unconstrainAll(p4);
        bbb.unconstrainAll(m1);
        bbb.unconstrainAll(m2);
        bbb.unconstrainAll(m3);
        bbb.unconstrainAll(m4);

        codeEditor.style.border = "3px solid green";
        try {
              always: {p1.left+p2.left == 2*m1.left};
              always: {p1.top+p2.top == 2*m1.top};

              always: {p2.left+p3.left == 2*m2.left};
              always: {p2.top+p3.top == 2*m2.top};

              always: {p3.left+p4.left == 2*m3.left};
              always: {p3.top+p4.top == 2*m3.top};

              always: {p4.left+p1.left == 2*m4.left};
              always: {p4.top+p1.top == 2*m4.top};

              stay: {
                  // A hack to work around the split stay problem
                  priority: "medium"
                  p1.left && p1.top && p3.top && p3.left
              }
        } catch (e) {
            codeEditor.style.border = "3px solid red";
            throw e;
        }

        // rerender for immediate changes
        canvas.renderAll();
    };

    always: {p1.left+p2.left == 2*m1.left};
    always: {p1.top+p2.top == 2*m1.top};

    always: {p2.left+p3.left == 2*m2.left};
    always: {p2.top+p3.top == 2*m2.top};

    always: {p3.left+p4.left == 2*m3.left};
    always: {p3.top+p4.top == 2*m3.top};

    always: {p4.left+p1.left == 2*m4.left};
    always: {p4.top+p1.top == 2*m4.top};

    stay: {
        // A hack to work around the split stay problem
        priority: "medium"
        p1.left && p1.top && p3.top && p3.left
    }

    solverSelect.onchange = (function () {
        editorCallback.call(codeEditor);
    });
});
