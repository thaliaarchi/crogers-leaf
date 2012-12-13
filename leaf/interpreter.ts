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

        private annotateIdsInternal(prefix:string) {
            this.id = prefix;
            if (this.left)
                this.left.annotateIdsInternal(prefix + 'L');
            if (this.right)
                this.right.annotateIdsInternal(prefix + 'R');

        }

        public annotateIds() {
            return this.annotateIdsInternal('');
        }

        static empty() { return new Tree(); }
    }

    export class State {
        tree: Tree;
        origTree: Tree;
        rootStack: Tree[];
        whileStack: number[];
        code: string;
        i: number;
        r: any;
        finished = false;

        constructor (code: string) {
            this.code = code;
            this.i = 0;
            this.whileStack = [];
            this.tree = Tree.empty();
            this.origTree = this.tree;
            this.rootStack = [this.tree];
        }
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
            var xt = structureToTree(x);
            tree.setLeft(xt);
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

    export function step(s: State) {
        if (s.finished || s.i >= s.code.length) {
            s.finished = true;
            return s;
        }

        switch (s.code[s.i]) {
            case '<':
                if (s.r = s.tree.left)
                    s.tree = s.tree.left;
                break;

            case '>':
                if (s.r = s.tree.right)
                    s.tree = s.tree.right;
                break;

            case '^':
                if (s.r = s.tree.parent && s.tree !== peek(s.rootStack))
                    s.tree = s.tree.parent;
                break;

            case '{':
                s.rootStack.push(s.tree);
                break;

            case '}':
                s.rootStack.pop();
                break;

            case '(':
                s.whileStack.push(s.i);
                break;

            case ')':
                if (s.r)
                    s.i = s.whileStack[s.whileStack.length - 1];
                else
                    s.whileStack.pop();
                break;

            case '+':
                s.tree.setLeft(Tree.empty());
                break;

            case '*':
                s.tree.setRight(Tree.empty());
                break;

            case '-':
                var deleted = s.tree;
                s.tree = s.tree.parent;
                if (s.tree.left === deleted)
                    s.tree.left = null;
                else if (s.tree.right === deleted)
                    s.tree.right = null;
                break;
        }

        s.i++;

        return s;
    }

    export function run(code: string) {
        var s = new State(code);
        while (!s.finished) {
            s = step(s);
        }

        return s;
    }
}