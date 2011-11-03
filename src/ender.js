var molt=require('molt');

$.ender({
    molt:function(node,dimensions,onrefresh){
        new molt(node,dimensions,onrefresh);
        return this;
    }
});