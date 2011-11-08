/*
    molt, image updater for responsive designs

    Version:    2.0.0
    Author:     Aurélien Delogu (dev@dreamysource.fr)
    Homepage:   https://github.com/pyrsmk/molt
    License:    MIT
*/

this.molt=function(){
    
    /*
        Array nodes: molt images
    */
    var attributes='attributes',
        listeners=[],
        nodes=[],
        i,
    
    /*
        Refresh image nodes
    */
    refresh=function(){
        var j,
            url,
            node,
            mode,
            width=W(),
            stack;
        // Browse molt images
        i=-1;
        while(node=nodes[++i]){
            // Guess the current mode for that image
            for(j in (url=node[attributes].url).match(/\{.*\}/)[1].split(/\s*,\s*/)){
                if(!mode){
                    mode=j;
                }
                if(width<j){
                    break;
                }
                mode=j;
            }
            // Hide node
            if(mode[0]=='!'){
                node.style.display='none';
            }
            // Refresh src
            else{
                node.src=url.replace(/\{.+\}/g,mode);
            }
            // Call node listeners
            if(stack=listeners[url]){
                j=stack.length;
                while(j){
                    stack[--j]();
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
            node=node[attributes].url;
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
            var imgs=document.getNodesByTagName('img'),
                i=imgs.length;
            while(i){
                // Only accept images with URL attribute set
                if(imgs[--i][attributes].url){
                    nodes.push(imgs[i]);
                }
            }
            // Update images
            refresh();
            // Catch events
            W(refresh);
        }
        
    };

}();