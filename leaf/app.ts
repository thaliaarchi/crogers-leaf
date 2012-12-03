///<reference path="Scripts/jquery-1.8.3.d.ts" />
///<reference path="interpreter.ts" />
///<reference path="ui.ts" />
///<reference path="Scripts/mousetrap.d.ts" />

$(document).ready(() => {
    $('.leaf-box').each((i, e) => {
        var $e = $(e);
        var $cont = $e.children('.cont');
        var $codebox = $e.find('textarea');
        var v = UI.drawTree($cont, Interpreter.run($codebox.val()));
        $codebox.change(e => {
            v = UI.updateTree(v, Interpreter.run($codebox.val()));
        });
    });

    Mousetrap.bind('shift', (e) => {
        var $focused = $('*:focus');
        if ($focused.is('textarea')) {
            $focused.trigger('change');
        }
    });
});