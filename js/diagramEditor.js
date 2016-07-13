define("argumentTypes", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.string = { name: "string", fromString: function (str) { return str; } };
    exports.number = { name: "number", fromString: function (str) { return Number(str); } };
});
define("action", ["require", "exports"], function (require, exports) {
    "use strict";
    var Action = (function () {
        function Action(name, func, argDeclarations) {
            this.name = name;
            this.func = func;
            this.argDeclarations = argDeclarations;
        }
        Action.prototype.exec = function (args) {
            var _this = this;
            return this.func(args.map(function (argument, index) { return _this.argDeclarations[index].type.fromString(argument); }));
        };
        return Action;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Action;
});
define("diagramEditor", ["require", "exports", "action", "argumentTypes"], function (require, exports, action_1, argumentTypes_1) {
    "use strict";
    exports.addition = new action_1.default('addition', function (_a) {
        var x = _a[0], y = _a[1];
        return x + y;
    }, [{ name: 'first', type: argumentTypes_1.number }, { name: 'second', type: argumentTypes_1.number }]);
});
//# sourceMappingURL=diagramEditor.js.map