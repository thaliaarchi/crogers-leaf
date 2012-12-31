$(document).ready(function () {
    function selectTextRange(element, start, end) {
        if(element.setSelectionRange) {
            element.setSelectionRange(start, end);
        } else {
            var r = element.createTextRange();
            r.collapse(true);
            r.moveEnd('character', end);
            r.moveStart('character', start);
            r.select();
        }
    }
    $('.leaf-box').each(function (i, e) {
        var $e = $(e);
        var initText = $e.text();
        $e.text('');
        $e.append('<div class="row-fluid"><div class="span12 btn-group"></div></div>');
        var $btnGroup = $e.find('.btn-group');
        $btnGroup.append('<button class="btn btn-primary step-btn">Step</button>');
        $btnGroup.append('<button class="btn btn-primary run-btn">Run</button>');
        $btnGroup.append('<button class="btn btn-danger reset-btn">Reset</button>');
        var $stepBtn = $btnGroup.children('.step-btn');
        var $runBtn = $btnGroup.children('.run-btn');
        var $resetBtn = $btnGroup.children('.reset-btn');
        $e.append('<div class="row-fluid below-group"></div>');
        var $belowGroup = $e.children('.below-group');
        $belowGroup.append('<div class="span3"><textarea class="mousetrap leaf-box-input"></textarea></div>');
        var $codebox = $belowGroup.find('textarea');
        $codebox.text(initText);
        $belowGroup.append('<div class="span9 cont"></div>');
        var $cont = $belowGroup.children('.cont');
        var iState = new Interpreter.State($codebox.val());
        var v = UI.drawTree($cont, iState);
        $codebox.bind('recompile', function (e) {
            iState = new Interpreter.State($codebox.val());
            $cont.trigger('redraw');
        });
        $cont.bind('redraw', function (e) {
            v = UI.updateTree(v, iState);
            selectTextRange($codebox[0], Math.max(iState.i - 1, 0), iState.i);
        });
        $cont.resize(function () {
            v = UI.resizeTreeBox(v, $cont.width(), $cont.height());
        });
        $stepBtn.click(function () {
            iState = Interpreter.step(iState);
            $cont.trigger('redraw');
        });
        $runBtn.click(function () {
            iState = Interpreter.run(iState);
            $cont.trigger('redraw');
        });
        $resetBtn.click(function () {
            $codebox.trigger('recompile');
        });
    });
    Mousetrap.bind('ctrl+alt', function (e) {
        var $focused = $('*:focus');
        if($focused.is('.leaf-box-input')) {
            $focused.trigger('recompile');
        }
    });
    var resize = function () {
        var rowHeights = 0;
        $('.row-fluid').map(function (i, e) {
            var $e = $(e);
            rowHeights += $e.is('.leaf-box.max-height') ? 0 : $e.height();
        });
        var h = $(window).height() - rowHeights - 70;
        $('.leaf-box.max-height textarea').height(h);
        $('.leaf-box.max-height .cont').height(h);
    };
    $(window).resize(resize);
    resize();
});
//@ sourceMappingURL=app.js.map
