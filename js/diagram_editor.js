define("declarations", ["require", "exports"], function (require, exports) {
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
    exports.Action = Action;
    exports.stringArg = { name: "string", fromString: function (str) { return str; } };
    exports.numberArg = { name: "number", fromString: function (str) { return Number(str); } };
});
define("diagram_editor", ["require", "exports"], function (require, exports) {
    "use strict";
});
//# sourceMappingURL=diagram_editor.js.map