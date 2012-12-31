///<reference path="Scripts/jquery-1.8.3.d.ts" />
///<reference path="interpreter.ts" />
///<reference path="ui.ts" />
///<reference path="Scripts/mousetrap.d.ts" />

$(document).ready(() => {
    function selectTextRange(element: any, start: number, end: number) {
        if(element.setSelectionRange)
            element.setSelectionRange(start, end);
        else {
            var r = element.createTextRange();
            r.collapse(true);
            r.moveEnd('character', end);
            r.moveStart('character', start);
            r.select();   
        }
    }

    $('.leaf-box').each((i, e) => {
        var $e = $(e);
        // Get the initial program test
        var initText = $e.text();
        $e.text('');
        // Add the control buttons
        $e.append('<div class="row-fluid"><div class="span12 btn-group"></div></div>');
        var $btnGroup = $e.find('.btn-group');
        $btnGroup.append('<button class="btn btn-primary step-btn">Step</button>');
        $btnGroup.append('<button class="btn btn-primary run-btn">Run</button>');
        $btnGroup.append('<button class="btn btn-danger reset-btn">Reset</button>');
        var $stepBtn = $btnGroup.children('.step-btn');
        var $runBtn = $btnGroup.children('.run-btn');
        var $resetBtn = $btnGroup.children('.reset-btn');
        // Add textarea
        $e.append('<div class="row-fluid below-group"></div>');
        var $belowGroup = $e.children('.below-group');
        $belowGroup.append('<div class="span3"><textarea class="mousetrap leaf-box-input"></textarea></div>');
        var $codebox = $belowGroup.find('textarea');  
        $codebox.text(initText);
        // Add visualisation
        $belowGroup.append('<div class="span9 cont"></div>');
        var $cont = $belowGroup.children('.cont');
        // Draw tree, add hooks for updating it
        var iState = new Interpreter.State($codebox.val());
        var v = UI.drawTree($cont, iState);
        var lastCodeText = $codebox.val();;
        $codebox.bind('recompile', e => {
            iState = new Interpreter.State($codebox.val());
            lastCodeText = $codebox.val();
            $cont.trigger('redraw');
        });
        $cont.bind('redraw', e => {
            v = UI.updateTree(v, iState);
            selectTextRange($codebox[0], Math.max(iState.i-1,0), iState.i);
        });
        $cont.resize(() => {
            v = UI.resizeTreeBox(v, $cont.width(), $cont.height());
        });
        // Add hooks for buttons
        $stepBtn.click(() => {
            if (lastCodeText !== $codebox.val()) {
                $codebox.trigger('recompile');
                return;
            }
            iState = Interpreter.step(iState);
            $cont.trigger('redraw');
        });
        $runBtn.click(() => {
            if (lastCodeText !== $codebox.val()) {
                $codebox.trigger('recompile');
                return;
            }
            iState = Interpreter.run(iState);
            $cont.trigger('redraw');
        });
        $resetBtn.click(() => {
            $codebox.trigger('recompile');
        });
    });

    // Catch recompile keyboard events
    Mousetrap.bind('ctrl+alt', (e) => {
        var $focused = $('*:focus');
        if ($focused.is('.leaf-box-input')) {
            $focused.trigger('recompile');
        }
    });

    // Resize stuff so it fills the whole screen
    var resize = () => {
        var rowHeights = 0;
        $('.row-fluid').map((i, e) => {
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