define("diagramView", ["require", "exports"], function (require, exports) {
    "use strict";
    var DiagramView = (function () {
        function DiagramView(width, height) {
            this.moving = false;
            this.resizing = false;
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
            this.registerEvents();
            this.drawingLoop();
        }
        DiagramView.prototype.addObject = function (object) {
            this.drawableObjects.push(object);
        };
        DiagramView.prototype.registerEvents = function () {
            this.canvas.addEventListener('mousedown', this.onMouseDown, false);
            this.canvas.addEventListener('mousemove', this.onMouseMove, false);
            this.canvas.addEventListener('mouseup', this.onMouseUp, false);
        };
        DiagramView.prototype.onMouseDown = function (event) {
        };
        DiagramView.prototype.onMouseMove = function (event) {
            if (this.moving) {
                this.selectedObjects.forEach(function (obj) {
                });
            }
            if (this.resizing) {
                this.selectedObjects.forEach(function (obj) {
                });
            }
        };
        DiagramView.prototype.onMouseUp = function (event) {
            this.moving = false;
            this.resizing = false;
        };
        DiagramView.prototype.drawingLoop = function () {
            var _this = this;
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawableObjects.forEach(function (obj) {
                obj.drawInContext(_this.context);
            });
            window.requestAnimationFrame(this.drawingLoop);
        };
        return DiagramView;
    }());
    exports.DiagramView = DiagramView;
});
define("diagramEditor", ["require", "exports", "diagramView"], function (require, exports, diagramView_1) {
    "use strict";
    var DiagramEditor = (function () {
        function DiagramEditor(width, height) {
            this.diagramView = new diagramView_1.DiagramView(width, height);
        }
        DiagramEditor.prototype.appendTo = function (element) {
            element.appendChild(this.diagramView.canvas);
        };
        return DiagramEditor;
    }());
    exports.DiagramEditor = DiagramEditor;
});
//# sourceMappingURL=diagramEditor.js.map