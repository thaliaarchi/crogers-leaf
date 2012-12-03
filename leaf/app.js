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
    Mousetrap.bind('shift', function (e) {
        var $focused = $('*:focus');
        if($focused.is('textarea')) {
            $focused.trigger('compile');
        }
    });
});
//@ sourceMappingURL=app.js.map
