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
        $codebox.bind('compile', e => {
            v = UI.updateTree(v, Interpreter.run($codebox.val()));
        });
        $cont.resize(() => {
            v = UI.resizeTreeBox(v, $cont.width(), $cont.height());
        });
    });

    // Catch recompile keyboard events
    Mousetrap.bind('alt', (e) => {
        var $focused = $('*:focus');
        if ($focused.is('textarea')) {
            $focused.trigger('compile');
        }
    });

    // Resize stuff so it fills the whole screen
    var resize = () => {
        var h = $(window).height() - $('#toprow').height() - 50;
        $('.leaf-box textarea').height(h);
        $('.leaf-box .cont').height(h);

    };
    
    $(window).resize(resize);
    resize();
});