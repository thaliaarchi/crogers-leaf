function peek(arr) {
    return arr[arr.length - 1];
}
var Interpreter;
(function (Interpreter) {
    var Tree = (function () {
        function Tree() { }
        Tree.prototype.setLeft = function (tree) {
            tree.parent = this;
            this.left = tree;
        };
        Tree.prototype.setRight = function (tree) {
            tree.parent = this;
            this.right = tree;
        };
        Tree.prototype.id = function () {
            var t = this;
            var ret = '';
            while(t.parent) {
                var LR = t.parent.left === t ? 'L' : 'R';
                ret = LR + ret;
                t = t.parent;
            }
            return ret;
        };
        Tree.empty = function empty() {
            return new Tree();
        }
        return Tree;
    })();
    Interpreter.Tree = Tree;    
    function run(code) {
        var tree = Tree.empty();
        var rootStack = [
            tree
        ];
        var whileStack = [];
        var r;
        for(var i = 0; i < code.length; i++) {
            var lastr = r;
            r = null;
            switch(code[i]) {
                case '<': {
                    if(r = tree.left) {
                        tree = tree.left;
                    }
                    break;

                }
                case '>': {
                    if(r = tree.right) {
                        tree = tree.right;
                    }
                    break;

                }
                case '^': {
                    if(r = tree.parent && tree !== peek(rootStack)) {
                        tree = tree.parent;
                    }
                    break;

                }
                case '{': {
                    rootStack.push(tree);
                    break;

                }
                case '}': {
                    rootStack.pop();
                    break;

                }
                case '(': {
                    whileStack.push(i);
                    break;

                }
                case ')': {
                    if(lastr) {
                        i = whileStack[whileStack.length - 1];
                    } else {
                        whileStack.pop();
                    }
                    break;

                }
                case '+': {
                    tree.setLeft(Tree.empty());
                    break;

                }
                case '*': {
                    tree.setRight(Tree.empty());
                    break;

                }
                case '-': {
                    var deleted = tree;
                    tree = tree.parent;
                    if(tree.left === deleted) {
                        tree.left = null;
                    } else {
                        if(tree.right === deleted) {
                            tree.right = null;
                        }
                    }
                    break;

                }
            }
        }
        return tree;
    }
    Interpreter.run = run;
})(Interpreter || (Interpreter = {}));
//@ sourceMappingURL=app.js.map
