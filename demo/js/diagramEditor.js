define("diagramView", ["require", "exports"], function (require, exports) {
    "use strict";
    var BoundingSquare = (function () {
        function BoundingSquare(top, left, width, height) {
            this.top = top;
            this.left = left;
            this.width = width;
            this.height = height;
        }
        BoundingSquare.prototype.getCenterPoint = function () {
            return {
                x: this.left + Math.floor(this.width / 2),
                y: this.top + Math.floor(this.height / 2)
            };
        };
        return BoundingSquare;
    }());
    exports.BoundingSquare = BoundingSquare;
    var DiagramView = (function () {
        function DiagramView(width, height) {
            this.blocks = [];
            this.selectedBlocks = [];
            this.connections = [];
            this.dragging = false;
            this.resizing = false;
            this.mouseDownPositionX = 0;
            this.mouseDownPositionY = 0;
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            this.canvas = canvas;
            this.context = canvas.getContext('2d');
            this.registerEvents();
            this.drawingLoop();
        }
        DiagramView.prototype.addBlock = function (block) {
            this.blocks.push(block);
        };
        DiagramView.prototype.addConnection = function (connection) {
            this.connections.push(connection);
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
            this.connections.forEach(function (connection) {
                connection.drawInContext(_this.context);
            });
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
define("blocks", ["require", "exports", "diagramView"], function (require, exports, diagramView_1) {
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
            context.rotate(0.25 * Math.PI);
            context.translate(rectangleSide / 2, -rectangleSide / 2);
            context.fillStyle = '#fff';
            context.fillRect(0, 0, rectangleSide, rectangleSide);
            context.strokeRect(0, 0, rectangleSide, rectangleSide);
            context.restore();
            context.save();
            context.translate(posX, posY);
            context.translate(this.diagonal / 2, this.diagonal / 2);
            context.font = '16px sans-serif';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(this.conditionText, 0, 0);
            context.restore();
        };
        ConditionBlock.prototype.getBoundingSquare = function (padding) {
            return new diagramView_1.BoundingSquare(this.top - padding + this.dragOffsetY, this.left - padding + this.dragOffsetX, this.diagonal + 2 * padding, this.diagonal + 2 * padding);
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
define("connections", ["require", "exports"], function (require, exports) {
    "use strict";
    var NormalConnection = (function () {
        function NormalConnection(from, to) {
            this.from = from;
            this.to = to;
        }
        NormalConnection.prototype.drawInContext = function (context) {
            var center1 = this.from.getBoundingSquare(0).getCenterPoint();
            var center2 = this.to.getBoundingSquare(0).getCenterPoint();
            context.beginPath();
            context.moveTo(center1.x, center1.y);
            context.lineTo(center2.x, center2.y);
            context.stroke();
        };
        return NormalConnection;
    }());
    exports.NormalConnection = NormalConnection;
});
define("diagramEditor", ["require", "exports", "diagramView", "blocks", "connections"], function (require, exports, diagramView_2, blocks_1, connections_1) {
    "use strict";
    var DiagramEditor = (function () {
        function DiagramEditor(width, height) {
            var _this = this;
            this.diagramView = new diagramView_2.DiagramView(width, height);
            var blocks = [
                new blocks_1.ConditionBlock(20, 20, 'one'),
                new blocks_1.ConditionBlock(100, 300, 'two'),
                new blocks_1.ConditionBlock(200, 100, 'three')
            ];
            blocks.forEach(function (b) { return _this.diagramView.addBlock(b); });
            this.diagramView.addConnection(new connections_1.NormalConnection(blocks[0], blocks[1]));
        }
        DiagramEditor.prototype.appendTo = function (element) {
            element.appendChild(this.diagramView.canvas);
        };
        return DiagramEditor;
    }());
    exports.DiagramEditor = DiagramEditor;
});
//# sourceMappingURL=diagramEditor.js.map