function peek(arr) {
    return arr[arr.length - 1];
}

module Interpreter {

    export class Tree {
        id: string;
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

        annotateIds(prefix:string) {
            this.id = prefix;
            if (this.left)
                this.left.annotateIds(prefix + 'L');
            if (this.right)
                this.right.annotateIds(prefix + 'R');

        }

        static empty() { return new Tree(); }
    }

    export function intToTree(n:number) {
        var tree = Tree.empty();
        var root = tree;
        for (var i = 0; i < n; i++) {
            tree.setRight(Tree.empty());
            tree = tree.right;
        }

        return root;
    }

    export function treeToInt(t:Tree) {
        for (var i = 0; t.right; t = t.right, i++);
        return i;
    }

    export function listToTree(list:any[]) {
        var tree = Tree.empty();
        var root = tree;
        for (var i = 0; i < list.length; i++) {
            var x = list[i];
            var xt = structureToTree(x);            tree.setLeft(xt);
            tree.setRight(Tree.empty());
            tree = tree.right;
        }

        return root;
    }

    export function stringToTree(str:string) {
        return listToTree(str.split('').map(c => c.charCodeAt(0)));
    }

    export function structureToTree(x) {
        if (typeof x === 'number')
            return intToTree(x);
        else if (x instanceof Array)
            return listToTree(x);
        else if (typeof x === 'string')
            return stringToTree(x);
    }

    export function run(code: string) {
        var tree = Tree.empty();
        var origRoot = tree;
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

        return origRoot;
    }
}