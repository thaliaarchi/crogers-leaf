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
        Tree.prototype.annotateIds = function (prefix) {
            this.id = prefix;
            if(this.left) {
                this.left.annotateIds(prefix + 'L');
            }
            if(this.right) {
                this.right.annotateIds(prefix + 'R');
            }
        };
        Tree.empty = function empty() {
            return new Tree();
        }
        return Tree;
    })();
    Interpreter.Tree = Tree;    
    function intToTree(n) {
        var tree = Tree.empty();
        var root = tree;
        for(var i = 0; i < n; i++) {
            tree.setRight(Tree.empty());
            tree = tree.right;
        }
        return root;
    }
    Interpreter.intToTree = intToTree;
    function treeToInt(t) {
        for(var i = 0; t.right; t = t.right , i++) {
            ; ;
        }
        return i;
    }
    Interpreter.treeToInt = treeToInt;
    function listToTree(list) {
        var tree = Tree.empty();
        var root = tree;
        for(var i = 0; i < list.length; i++) {
            var x = list[i];
            var xt = structureToTree(x);
            tree.setLeft(xt);
            tree.setRight(Tree.empty());
            tree = tree.right;
        }
        return root;
    }
    Interpreter.listToTree = listToTree;
    function stringToTree(str) {
        return listToTree(str.split('').map(function (c) {
            return c.charCodeAt(0);
        }));
    }
    Interpreter.stringToTree = stringToTree;
    function structureToTree(x) {
        if(typeof x === 'number') {
            return intToTree(x);
        } else {
            if(x instanceof Array) {
                return listToTree(x);
            } else {
                if(typeof x === 'string') {
                    return stringToTree(x);
                }
            }
        }
    }
    Interpreter.structureToTree = structureToTree;
    function run(code) {
        var tree = Tree.empty();
        var origRoot = tree;
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
        return origRoot;
    }
    Interpreter.run = run;
})(Interpreter || (Interpreter = {}));
//@ sourceMappingURL=interpreter.js.map
