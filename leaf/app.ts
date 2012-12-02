function peek(arr) {
    return arr[arr.length - 1];
}

module Interpreter {

    export class Tree {
        left: Tree;
        right: Tree;
        parent: Tree;

        setLeft(tree: Tree) {
            tree.parent = this;
            this.left = tree;
        }

        setRight(tree: Tree) {
            tree.parent = this;
            this.right = tree;
        }

        id() {
            var t = this;
            var ret = '';
            while (t.parent) {
                var LR = t.parent.left === t ? 'L' : 'R';
                ret = LR + ret;
                t = t.parent;
            }
            return ret;
        }

        static empty() { return new Tree(); }
    }

    export function run(code: string) {
        var tree = Tree.empty();
        var rootStack = [tree];
        var whileStack = [];
        var r;

        for (var i = 0; i < code.length; i++) {
            var lastr = r;
            r = null;
            switch (code[i]) {
                case '<':
                    if (r = tree.left)
                        tree = tree.left;
                    break;

                case '>':
                    if (r = tree.right)
                        tree = tree.right;
                    break;

                case '^':
                    if (r = tree.parent && tree !== peek(rootStack))
                        tree = tree.parent;
                    break;

                case '{':
                    rootStack.push(tree);
                    break;

                case '}':
                    rootStack.pop();
                    break;

                case '(':
                    whileStack.push(i);
                    break;

                case ')':
                    if (lastr)
                        i = whileStack[whileStack.length - 1];
                    else
                        whileStack.pop();
                    break;

                case '+':
                    tree.setLeft(Tree.empty());
                    break;

                case '*':
                    tree.setRight(Tree.empty());
                    break;

                case '-':
                    var deleted = tree;
                    tree = tree.parent;
                    if (tree.left === deleted)
                        tree.left = null;
                    else if (tree.right === deleted)
                        tree.right = null;
                    break;
            }
        }

        return tree;
    }
}