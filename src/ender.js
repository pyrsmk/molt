var molt=require('molt');

$.ender({
    discover:molt.discover
});

$.ender({
    listen:function(callback){
        molt.listen(this,callback);
    }
},true);