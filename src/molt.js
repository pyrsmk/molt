/*
    molt, image updater for responsive designs

    Version:    2.1.0
    Author:     Aurélien Delogu (dev@dreamysource.fr)
    Homepage:   https://github.com/pyrsmk/molt
    License:    MIT
*/

(function(def){
    if(typeof module!='undefined'){
        module.exports=def;
    }
    else{
        this.molt=def;
    }
}(function(){
    
    /*
        Array nodes: molt images
    */
    var getAttribute='getAttribute',
        listeners=[],
        nodes=[],
        i,
    
    /*
        Refresh image nodes
    */
    refresh=function(){
        var j,
            url,
            display,
            node,
            modes,
            width=W(),
            stack;
        // Browse molt images
        i=-1;
        while(node=nodes[++i]){
            // Guess the current mode for that image
            modes=(url=node.getAttribute('url')).match(/\{\s*(.*?)\s*\}/)[1].split(/\s*,\s*/);
            j=modes.length;
            while(j){
                if(width>modes[--j].match(/^!?(.+)/)[1]){
                    break;
                }
            }
            // Negative mode
            if(modes[j].charAt(0)=='!'){
                // Hide image
                node.style.display='none';
            }
            // Normal mode
            else{
                // Show image
                if(node.style.display=='none'){
                    if(display=node.getAttribute('display')){
                        node.style.display=display;
                    }
                    else{
                        node.style.display='inline';
                    }
                }
                // Refresh src
                node.src=url.replace(/\{.+\}/g,modes[j]);
                // Call node listeners
                if(stack=listeners[url]){
                    j=stack.length;
                    while(j){
                        stack[--j].apply(node);
                    }
                }
            }
        }
    };
    
    return {
        
        /*
            Add a listener to the stack
            
                Object node         : node to listen
                Function callback   : function to call when the node has been refreshed
        */
        listen:function(node,callback){
            // Format
            node=node[getAttribute]('url');
            // Init node stack
            if(!listeners[node]){
                listeners[node]=[];
            }
            // Add listener
            listeners[node].push(callback);
        },

        /*
            Discover molt images
        */
        discover:function(){
            // Discover images
            var imgs=document.getElementsByTagName('img'),
                i=imgs.length;
            while(i){
                // Only accept images with URL attribute set
                if(imgs[--i][getAttribute]('url')){
                    nodes.push(imgs[i]);
                }
            }
            // Update images
            refresh();
            // Catch events
            W(refresh);
        }
        
    };

}()));
