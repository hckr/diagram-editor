define("diagramView", ["require", "exports"], function (require, exports) {
    "use strict";
    var DiagramView = (function () {
        function DiagramView(width, height) {
            this.blocks = [];
            this.selectedBlocks = [];
            this.dragging = false;
            this.resizing = false;
            this.mouseDownPositionX = 0;
            this.mouseDownPositionY = 0;
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
            this.registerEvents();
            this.drawingLoop();
        }
        DiagramView.prototype.addBlock = function (block) {
            this.blocks.push(block);
        };
        DiagramView.prototype.registerEvents = function () {
            var _this = this;
            this.canvas.addEventListener('mousedown', function (e) { _this.onMouseDown(e); }, false);
            this.canvas.addEventListener('mousemove', function (e) { _this.onMouseMove(e); }, false);
            this.canvas.addEventListener('mouseup', function (e) { _this.onMouseUp(e); }, false);
        };
        DiagramView.prototype.getBlockUnderCursor = function (event) {
            var mouseX = event.pageX - this.canvas.offsetLeft;
            var mouseY = event.pageY - this.canvas.offsetTop;
            for (var _i = 0, _a = this.blocks; _i < _a.length; _i++) {
                var block = _a[_i];
                var boundingSquare = block.getBoundingSquare(0);
                var bounds = {
                    top: boundingSquare.top,
                    right: boundingSquare.left + boundingSquare.width,
                    bottom: boundingSquare.top + boundingSquare.height,
                    left: boundingSquare.left
                };
                if (mouseY > bounds.top && mouseY < bounds.bottom &&
                    mouseX > bounds.left && mouseX < bounds.right) {
                    return block;
                }
            }
            return null;
        };
        DiagramView.prototype.handleSelection = function (event) {
            var block = this.getBlockUnderCursor(event);
            var wasPreviouslySelected = this.selectedBlocks.indexOf(block) != -1;
            if (block) {
                if (event.ctrlKey) {
                    if (wasPreviouslySelected) {
                        this.selectedBlocks = this.selectedBlocks.filter(function (el) { return el != block; });
                        return;
                    }
                    this.selectedBlocks.push(block);
                    return;
                }
                if (!wasPreviouslySelected) {
                    this.selectedBlocks = [block];
                }
                this.onDragStart(event);
                return;
            }
            if (!event.ctrlKey) {
                this.selectedBlocks = [];
            }
        };
        DiagramView.prototype.onDragStart = function (event) {
            this.canvas.style.cursor = 'move';
            this.dragging = true;
        };
        DiagramView.prototype.onDragMove = function (event) {
            var _this = this;
            this.selectedBlocks.filter(function (b) { return b.draggable; }).forEach(function (block) {
                block.setDragOffset(event.clientX - _this.mouseDownPositionX, event.clientY - _this.mouseDownPositionY);
            });
        };
        DiagramView.prototype.onDragEnd = function (event) {
            this.selectedBlocks.filter(function (b) { return b.draggable; }).forEach(function (block) {
                block.dragEnd();
            });
            this.canvas.style.cursor = 'default';
            this.dragging = false;
        };
        DiagramView.prototype.onMouseDown = function (event) {
            this.handleSelection(event);
            this.mouseDownPositionX = event.clientX;
            this.mouseDownPositionY = event.clientY;
        };
        DiagramView.prototype.onMouseMove = function (event) {
            if (this.dragging) {
                this.onDragMove(event);
            }
            if (this.resizing) {
                this.selectedBlocks.forEach(function (obj) {
                });
            }
        };
        DiagramView.prototype.onMouseUp = function (event) {
            if (this.dragging) {
                this.onDragEnd(event);
            }
            this.resizing = false;
        };
        DiagramView.prototype.drawingLoop = function () {
            var _this = this;
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.blocks.forEach(function (block) {
                block.drawInContext(_this.context);
            });
            this.context.save();
            this.context.setLineDash([1, 1]);
            this.selectedBlocks.forEach(function (block) {
                var boundingSquare = block.getBoundingSquare(5);
                _this.context.strokeRect(boundingSquare.left, boundingSquare.top, boundingSquare.width, boundingSquare.height);
            });
            this.context.restore();
            window.requestAnimationFrame(function () {
                _this.drawingLoop();
            });
        };
        return DiagramView;
    }());
    exports.DiagramView = DiagramView;
});
define("blocks", ["require", "exports"], function (require, exports) {
    "use strict";
    // enum value can be read as string, e.g.: blockType[blockType.Entry]
    (function (BlockType) {
        BlockType[BlockType["Entry"] = 0] = "Entry";
        BlockType[BlockType["Condition"] = 1] = "Condition";
        BlockType[BlockType["Action"] = 2] = "Action";
        BlockType[BlockType["Exit"] = 3] = "Exit";
    })(exports.BlockType || (exports.BlockType = {}));
    var BlockType = exports.BlockType;
    var ConditionBlock = (function () {
        function ConditionBlock(top, left, conditionText) {
            this.type = BlockType.Condition;
            this.resizable = true;
            this.draggable = true;
            this.diagonal = 100;
            this.dragOffsetX = 0;
            this.dragOffsetY = 0;
            this.top = top;
            this.left = left;
            this.conditionText = conditionText;
        }
        ConditionBlock.prototype.drawInContext = function (context) {
            var posX = this.left + this.dragOffsetX;
            var posY = this.top + this.dragOffsetY;
            var rectangleSide = this.diagonal / Math.sqrt(2);
            context.save();
            context.translate(posX, posY);
            context.save();
            context.translate(this.diagonal / 2, this.diagonal / 2);
            context.font = "16px sans-serif";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(this.conditionText, 0, 0);
            context.restore();
            context.rotate(0.25 * Math.PI);
            context.translate(rectangleSide / 2, -rectangleSide / 2);
            context.strokeRect(0, 0, rectangleSide, rectangleSide);
            context.restore();
        };
        ConditionBlock.prototype.getBoundingSquare = function (padding) {
            return {
                top: this.top - padding + this.dragOffsetY,
                left: this.left - padding + this.dragOffsetX,
                width: this.diagonal + 2 * padding,
                height: this.diagonal + 2 * padding
            };
        };
        ConditionBlock.prototype.setDragOffset = function (x, y) {
            this.dragOffsetX = x;
            this.dragOffsetY = y;
        };
        ConditionBlock.prototype.dragEnd = function () {
            this.top += this.dragOffsetY;
            this.left += this.dragOffsetX;
            this.dragOffsetX = 0;
            this.dragOffsetY = 0;
        };
        return ConditionBlock;
    }());
    exports.ConditionBlock = ConditionBlock;
});
define("diagramEditor", ["require", "exports", "diagramView", "blocks"], function (require, exports, diagramView_1, blocks_1) {
    "use strict";
    var DiagramEditor = (function () {
        function DiagramEditor(width, height) {
            this.diagramView = new diagramView_1.DiagramView(width, height);
            this.diagramView.addBlock(new blocks_1.ConditionBlock(20, 20, "one"));
            this.diagramView.addBlock(new blocks_1.ConditionBlock(100, 200, "two"));
        }
        DiagramEditor.prototype.appendTo = function (element) {
            element.appendChild(this.diagramView.canvas);
        };
        return DiagramEditor;
    }());
    exports.DiagramEditor = DiagramEditor;
});
//# sourceMappingURL=diagramEditor.js.map