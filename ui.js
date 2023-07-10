var UI;
(function (UI) {
    function children(n) {
        var ret = [];
        if(n.left) {
            ret.push(n.left);
        }
        if(n.right) {
            ret.push(n.right);
        }
        return ret;
    }
    function translate(x, y) {
        return 'translate(' + x + ',' + y + ')';
    }
    function drawTree(d3container, state) {
        var tree = state.origTree;
        var w = d3container.width();
        var h = d3container.height();
        var gap = 7;
        var gap2 = gap * 2;
        var svg = d3.select(d3container[0]).append('svg').attr('width', w).attr('height', h);
        var vis = svg.append('g').attr('transform', translate(gap, gap));
        var treeLayout = d3.layout.tree().children(children).size([
            w - gap2, 
            h - gap2
        ]);
        var visData = {
            gap: gap,
            treeLayout: treeLayout,
            svg: svg,
            vis: vis,
            lastState: state
        };
        return updateTree(visData, state);
    }
    UI.drawTree = drawTree;
    function resizeTreeBox(visData, w, h) {
        var gap = visData.gap;
        visData.treeLayout = d3.layout.tree().children(children).size([
            w - gap * 2, 
            h - gap * 2
        ]);
        visData.svg.attr('width', w).attr('height', h);
        return updateTree(visData, visData.lastState);
    }
    UI.resizeTreeBox = resizeTreeBox;
    function updateTree(visData, state) {
        var tree = state.origTree;
        var treeLayout = visData.treeLayout;
        var vis = visData.vis;
        var duration = 500;
        var diagonal = d3.svg.diagonal();
        var nodes = treeLayout.nodes(tree);
        tree.annotateIds();
        var node = vis.selectAll('g.node').data(nodes, function (d) {
            return d.id;
        });
        var nodeEnter = node.enter().append('g').attr('class', 'node').attr('transform', function (d) {
            return translate(d.x, d.y);
        }).style('opacity', 0);
        nodeEnter.append('circle').attr('r', 5);
        var nodeUpdate = node.transition().duration(duration).attr('transform', function (d) {
            return translate(d.x, d.y);
        }).style('opacity', 1);
        node.style('fill', function (n) {
            return n === state.tree ? 'limegreen' : (state.rootStack.indexOf(n) >= 0 ? 'palevioletred' : 'black');
        }).style('stroke', 'white').style('stroke-width', '1px');
        var nodeExit = node.exit().remove();
        var link = vis.selectAll('path.link').data(treeLayout.links(nodes), function (d) {
            return d.source.id + '_' + d.target.id;
        });
        var linkEnter = link.enter().insert('path', 'g').attr('class', 'link').attr('d', diagonal).style('stroke', 'black').attr('stroke-dasharray', function (l) {
            return Interpreter.peek(l.target.id) === 'R' ? '4 4' : '';
        }).style('opacity', 0);
        var linkUpdate = link.transition().duration(duration).attr('d', diagonal).style('opacity', 1);
        var linkExit = link.exit().remove();
        visData.lastState = state;
        return visData;
    }
    UI.updateTree = updateTree;
})(UI || (UI = {}));
//@ sourceMappingURL=ui.js.map
