/*
    molt, images updater for media devices

    Version : 0.1.2
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
    window.molt=function(url,dimensions,insert,update,display){

        var node;

        /*
            Refresh images for that new window size
        */
        var refresh=function(){
            // Guess the current mode
            var w=window.getWindowWidth(),
                mode,
                last;
            for(mode in dimensions){
                if(w<mode){
                    mode=last;
                    break;
                }
                last=mode;
            }
            // Define node properties
            if(dimensions[mode].length){
                if(node.style.display=='none'){
                    node.style.display=display;
                }
                node.width=dimensions[mode][0];
                node.height=dimensions[mode][1];
                node.src=url.replace(/\{mode\}/g,mode).
                             replace(/\{width\}/g,dimensions[mode][0]).
                             replace(/\{height\}/g,dimensions[mode][1]);
            }
            // Hide node
            else{
                node.style.display='none';
            }
            // Update node
            update(node);
        };

        // Format
        if(!insert){
            insert=function(){};
        }
        if(!update){
            update=function(){};
        }
        // Sort dimensions
        /*var dims=[];
        for(var mode in dimensions){
            dims[mode]=dimensions[mode];
        }*/
        // Create node
        node=document.createElement('img');
        node.alt='';
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