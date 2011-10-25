/*
    molt, images updater for media devices

    Version : 0.1
    Author  : Aurélien Delogu (dev@dreamysource.fr)
    URL     : https://github.com/pyrsmk/molt
    License : MIT
*/

(function(window,document){

    /*
        Get the window's width

        Return
            integer
    */
    window.getWindowWidth=window.getWindowWidth || function(){
        if(typeof(window.innerWidth)=='number'){
            return window.innerWidth;
        }
        else{
            return document.documentElement.clientWidth;
        }
    };

    /*
        Get the window's height

        Return
            integer
    */
    window.getWindowHeight=window.getWindowHeight || function(){
        if(typeof(window.innerHeight)=='number'){
            return window.innerHeight;
        }
        else{
            return document.documentElement.clientHeight;
        }
    };

    /*
        Create a molt image

        Parameters
            string url          : image url
            object dimensions   : image resolutions corresponding to the specified mode
                                  (mode,[width,height]) pair list
            function insert     : insert the node into the DOM
            function update     : update the node

        Return
            molt
    */
    window.molt=window.molt || function(url,dimensions,insert,update){

        /*
            string _url         : image url
            object _dimensions  : image resolutions corresponding to the specified mode
            function _update    : update the node
            object _node        : image node
            string _display     : "current" display property for that image
        */
        var _url,
            _dimensions,
            _update,
            _node,
            _display='inline';

        /*
            Refresh images for that new window size
        */
        var refresh=function(){
            // Guess the current mode
            var w=window.getWindowWidth(),
                mode,
                last;
            for(mode in _dimensions){
                if(w<mode){
                    mode=last;
                    break;
                }
                last=mode;
            }
            // Define node properties
            if(_dimensions[mode].length){
                if(_node.style.display=='none'){
                    _node.style.display=_display;
                }
                _node.width=_dimensions[mode][0];
                _node.height=_dimensions[mode][1];
                var url=_url;
                _node.src=url.replace(/\{mode\}/g,mode).
                              replace(/\{width\}/g,_dimensions[mode][0]).
                              replace(/\{height\}/g,_dimensions[mode][1]);
            }
            else{
                var display=_node.style.display || _display;
                _node.style.display='none';
            }
            // Update node
            _update(_node);
        };

        // Format
        if(!insert){
            insert=function(){};
        }
        if(!update){
            update=function(){};
        }
        // Sort dimensions
        var dims=[];
        for(var mode in dimensions){
            dims[mode]=dimensions[mode];
        }
        // Create node
        var node=document.createElement('img');
        node.alt='';
        // Save data
        _url=url;
        _dimensions=dims;
        _update=update;
        _node=node;
        // Insert it into the DOM
        insert(node);
        // Update node
        refresh();
        // Catch resize event
        if(window.addEventListener){
            window.addEventListener("resize",refresh,false);
        }
        else if(window.attachEvent){
            window.attachEvent("onresize",refresh);
        }
        return window.molt;

    };

})(this,this.document);