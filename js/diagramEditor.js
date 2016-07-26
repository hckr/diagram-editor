define("diagramView", ["require", "exports"], function (require, exports) {
    "use strict";
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.distanceTo = function (other) {
            return Math.sqrt(Math.abs(this.x - other.x) +
                Math.abs(this.y - other.y));
        };
        return Point;
    }());
    exports.Point = Point;
    var BoundingSquare = (function () {
        function BoundingSquare(top, left, width, height) {
            this.top = top;
            this.left = left;
            this.width = width;
            this.height = height;
        }
        BoundingSquare.prototype.getCenterPoint = function () {
            return new Point(this.left + Math.floor(this.width / 2), this.top + Math.floor(this.height / 2));
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
                if (block.draggable) {
                    this.onDragStart(event);
                }
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
    function mixinDraggable(block) {
        block.setDragOffset = (function (x, y) {
            this.dragOffsetX = x;
            this.dragOffsetY = y;
        }).bind(block);
        block.dragEnd = (function () {
            this.top += this.dragOffsetY;
            this.left += this.dragOffsetX;
            this.dragOffsetX = 0;
            this.dragOffsetY = 0;
        }).bind(block);
    }
    var ConditionBlock = (function () {
        function ConditionBlock(top, left, conditionText, resizable, draggable) {
            if (resizable === void 0) { resizable = true; }
            if (draggable === void 0) { draggable = true; }
            this.resizable = resizable;
            this.draggable = draggable;
            this.type = BlockType.Condition;
            this.diagonalX = 100;
            this.diagonalY = 50;
            this.dragOffsetX = 0;
            this.dragOffsetY = 0;
            this.top = top;
            this.left = left;
            this.conditionText = conditionText;
            if (draggable) {
                mixinDraggable(this);
            }
        }
        ConditionBlock.prototype.drawInContext = function (context) {
            var posX = this.left + this.dragOffsetX;
            var posY = this.top + this.dragOffsetY;
            context.save();
            context.fillStyle = '#fff';
            context.beginPath();
            context.translate(posX, posY);
            context.moveTo(0, this.diagonalY / 2);
            context.lineTo(this.diagonalX / 2, 0);
            context.lineTo(this.diagonalX, this.diagonalY / 2);
            context.lineTo(this.diagonalX / 2, this.diagonalY);
            context.lineTo(0, this.diagonalY / 2);
            context.stroke();
            context.fill();
            context.restore();
            context.save();
            context.translate(posX, posY);
            context.translate(this.diagonalX / 2, this.diagonalY / 2);
            context.font = '16px sans-serif';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(this.conditionText, 0, 0);
            context.restore();
        };
        ConditionBlock.prototype.getBoundingSquare = function (padding) {
            return new diagramView_1.BoundingSquare(this.top - padding + this.dragOffsetY, this.left - padding + this.dragOffsetX, this.diagonalX + 2 * padding, this.diagonalY + 2 * padding);
        };
        ConditionBlock.prototype.getPossibleConnectionPoints = function () {
            return [
                new diagramView_1.Point(this.left + this.diagonalX / 2 + this.dragOffsetX, this.top + this.dragOffsetY),
                new diagramView_1.Point(this.left + this.diagonalX / 2 + this.dragOffsetX, this.top + this.diagonalY + this.dragOffsetY),
                new diagramView_1.Point(this.left + this.dragOffsetX, this.top + this.diagonalY / 2 + this.dragOffsetY),
                new diagramView_1.Point(this.left + this.diagonalX + this.dragOffsetX, this.top + this.diagonalY / 2 + this.dragOffsetY)
            ];
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
            var connectionPointsFrom = this.from.getPossibleConnectionPoints();
            var connectionPointsTo = this.to.getPossibleConnectionPoints();
            var bestPointFrom, bestPointTo;
            var smallestDistance = Number.MAX_VALUE;
            for (var _i = 0, connectionPointsFrom_1 = connectionPointsFrom; _i < connectionPointsFrom_1.length; _i++) {
                var pointFrom = connectionPointsFrom_1[_i];
                for (var _a = 0, connectionPointsTo_1 = connectionPointsTo; _a < connectionPointsTo_1.length; _a++) {
                    var pointTo = connectionPointsTo_1[_a];
                    var distance = pointFrom.distanceTo(pointTo);
                    if (distance < smallestDistance) {
                        bestPointFrom = pointFrom;
                        bestPointTo = pointTo;
                        smallestDistance = distance;
                    }
                }
            }
            context.beginPath();
            context.moveTo(bestPointFrom.x, bestPointFrom.y);
            context.lineTo(bestPointTo.x, bestPointTo.y);
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
                new blocks_1.ConditionBlock(200, 100, 'three', true, false)
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