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
        Tree.prototype.annotateIdsInternal = function (prefix) {
            this.id = prefix;
            if(this.left) {
                this.left.annotateIdsInternal(prefix + 'L');
            }
            if(this.right) {
                this.right.annotateIdsInternal(prefix + 'R');
            }
        };
        Tree.prototype.annotateIds = function () {
            return this.annotateIdsInternal('');
        };
        Tree.empty = function empty() {
            return new Tree();
        }
        return Tree;
    })();
    Interpreter.Tree = Tree;    
    var State = (function () {
        function State(code) {
            this.finished = false;
            this.code = code;
            this.i = 0;
            this.whileStack = [];
            this.tree = Tree.empty();
            this.origTree = this.tree;
            this.rootStack = [
                this.tree
            ];
        }
        return State;
    })();
    Interpreter.State = State;    
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
    function step(s) {
        if(s.finished || s.i >= s.code.length) {
            s.finished = true;
            return s;
        }
        switch(s.code[s.i]) {
            case '<': {
                if(s.r = s.tree.left) {
                    s.tree = s.tree.left;
                }
                break;

            }
            case '>': {
                if(s.r = s.tree.right) {
                    s.tree = s.tree.right;
                }
                break;

            }
            case '^': {
                if(s.r = s.tree.parent && s.tree !== peek(s.rootStack)) {
                    s.tree = s.tree.parent;
                }
                break;

            }
            case '{': {
                s.rootStack.push(s.tree);
                break;

            }
            case '}': {
                s.rootStack.pop();
                break;

            }
            case '(': {
                s.whileStack.push(s.i);
                break;

            }
            case ')': {
                if(s.r) {
                    s.i = s.whileStack[s.whileStack.length - 1];
                } else {
                    s.whileStack.pop();
                }
                break;

            }
            case '+': {
                s.tree.setLeft(Tree.empty());
                break;

            }
            case '*': {
                s.tree.setRight(Tree.empty());
                break;

            }
            case '-': {
                var deleted = s.tree;
                s.tree = s.tree.parent;
                if(s.tree.left === deleted) {
                    s.tree.left = null;
                } else {
                    if(s.tree.right === deleted) {
                        s.tree.right = null;
                    }
                }
                break;

            }
        }
        s.i++;
        return s;
    }
    Interpreter.step = step;
    function run(code) {
        var s = new State(code);
        while(!s.finished) {
            s = step(s);
        }
        return s;
    }
    Interpreter.run = run;
})(Interpreter || (Interpreter = {}));
//@ sourceMappingURL=interpreter.js.map
