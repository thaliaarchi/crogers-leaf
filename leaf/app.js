$(document).ready(function () {
    $('.leaf-box').each(function (i, e) {
        var $e = $(e);
        var $cont = $e.children('.cont');
        var $codebox = $e.find('textarea');
        var v = UI.drawTree($cont, Interpreter.run($codebox.val()));
        $codebox.change(function (e) {
            v = UI.updateTree(v, Interpreter.run($codebox.val()));
        });
    });
    Mousetrap.bind('shift', function (e) {
        var $focused = $('*:focus');
        if($focused.is('textarea')) {
            $focused.trigger('change');
        }
    });
});
//@ sourceMappingURL=app.js.map
