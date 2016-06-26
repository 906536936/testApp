;(function(){
    var TOUCHSTART,TOUCHEND;

    // normal mobile
    if (typeof window.oontouchstart != "undefined") {
        TOUCHSTART = "touchstart",
        TOUCHEND   = "touchend";

    // microsoft touch event
    } else if (typeof window.onmspointerdown != "undefined") {
        TOUCHSTART = "MSPointerDown",
        TOUCHEND   = "MSPointerUp";

    // pc
    } else {
        TOUCHSTART = "mousedown",
        TOUCHEND   = "mouseup";
    }

    function NodeFacade (node) {
        this._node = node;
    }

    NodeFacade.prototype.getNode = function (){
        return this._node;
    };

    NodeFacade.prototype.on = function(evt,callback) {

        // meanings click
        if (evt === "tap") {
            this._node.addEventListener(TOUCHSTART, callback);
        }else if (evt === "tapend") {
            this._node.addEventListener(TOUCHEND,callback);
        }else{
            this._node.addEventListener(evt,callback);
        }

        return this;
    };

    NodeFacade.prototype.off = function(evt,callback) {

        // meanings click
        if (evt === "tap") {
            this._node.removeEventListener(TOUCHSTART, callback);
        }else if (evt === "tapend") {
            this._node.removeEventListener(TOUCHEND,callback);
        }else{
            this._node.removeEventListener(evt,callback);
        }

        return this;
    };

    window.$ = function(selecor) {
        var node = document.querySelector(selecor);

        if (node) {
            return new NodeFacade(node);
        } else {
            throw new Error("not found node " + selecor)
            return null;
        }
    };

})(window);