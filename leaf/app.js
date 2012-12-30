$(document).ready(function () {
    $('.leaf-box').each(function (i, e) {
        var $e = $(e);
        var $cont = $e.children('.cont');
        var $codebox = $e.find('textarea');
        var v = UI.drawTree($cont, Interpreter.run($codebox.val()));
        $codebox.bind('compile', function (e) {
            v = UI.updateTree(v, Interpreter.run($codebox.val()));
        });
        $cont.resize(function () {
            v = UI.resizeTreeBox(v, $cont.width(), $cont.height());
        });
    });
    Mousetrap.bind('ctrl+alt', function (e) {
        var $focused = $('*:focus');
        if($focused.is('textarea')) {
            $focused.trigger('compile');
        }
    });
    var resize = function () {
        var rowHeights = 0;
        $('.row-fluid').map(function (i, e) {
            var $e = $(e);
            rowHeights += $e.children('#test').length === 0 ? $e.height() : 0;
        });
        var h = $(window).height() - rowHeights - 70;
        $('#test textarea').height(h);
        $('#test .cont').height(h);
    };
    $(window).resize(resize);
    resize();
});
//@ sourceMappingURL=app.js.map
