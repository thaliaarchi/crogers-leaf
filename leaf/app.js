$(document).ready(function () {
    $('.leaf-box').each(function (i, e) {
        var $e = $(e);
        var $cont = $e.children('.cont');
        var $codebox = $e.find('textarea');
        var v = UI.drawTree($cont, Interpreter.run($codebox.val()).origTree);
        $codebox.bind('compile', function (e) {
            v = UI.updateTree(v, Interpreter.run($codebox.val()).origTree);
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
        var h = $(window).height() - $('#toprow').height() - 70;
        $('.leaf-box textarea').height(h);
        $('.leaf-box .cont').height(h);
    };
    $(window).resize(resize);
    resize();
});
//@ sourceMappingURL=app.js.map
