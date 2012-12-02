var UI;
(function (UI) {
    var d3trees = {
    };
    var globi = 0;
    function getTreeData(d3svg) {
        return d3svg.data('treeId');
    }
    function setTreeData(d3svg, data) {
        return d3svg.data('treeId', data);
    }
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
    function drawTree(d3container, tree) {
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
            treeLayout: treeLayout,
            vis: vis
        };
        return updateTree(visData, tree);
    }
    UI.drawTree = drawTree;
    function updateTree(visData, tree) {
        var treeLayout = visData.treeLayout;
        var vis = visData.vis;
        var duration = 500;
        var diagonal = d3.svg.diagonal();
        var nodes = treeLayout.nodes(tree);
        var node = vis.selectAll('g.node').data(nodes, function (d) {
            return d.id();
        });
        var nodeEnter = node.enter().append('g').attr('class', 'node').attr('transform', function (d) {
            return translate(d.x, d.y);
        });
        nodeEnter.append('circle').attr('r', 5).style('fill', '#000');
        var nodeUpdate = node.transition().duration(duration).attr('transform', function (d) {
            return translate(d.x, d.y);
        });
        var nodeExit = node.exit().remove();
        var link = vis.selectAll('path.link').data(treeLayout.links(nodes), function (d) {
            return d.source.id() + '_' + d.target.id();
        });
        var linkEnter = link.enter().insert('path', 'g').attr('class', 'link').attr('d', diagonal);
        var linkUpate = link.transition().duration(duration).attr('d', diagonal);
        var linkExit = link.exit().remove();
        return visData;
    }
    UI.updateTree = updateTree;
})(UI || (UI = {}));
//@ sourceMappingURL=ui.js.map
