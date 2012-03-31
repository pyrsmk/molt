/*
    molt, image updater for responsive designs

    Version:    2.4.0
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
        triggers=[],
        listeners=[],
        nodes=[],
        i;

    /*
        Refresh image nodes
    */
    function refresh(){
        var j,
            k,
            l,
            url,
            display,
            node,
            modes,
            mapping,
            width=W(),
            stack;
            // Browse molt images
            i=-1;

        while(node=nodes[++i]){
            // Guess the current mode for that image
            modes=(url=node.getAttribute('data-url')).match(/\{\s*(.*?)\s*\}/)[1].split(/\s*,\s*/);
            for(l=0;l<modes.length;l++){
                mapping = modes[l].split(":");
                if(mapping.length===1){
                    modes[l] = [mapping[0], mapping[0]];
                }else{
                    modes[l] = [mapping[0], mapping[1]];
                }
            }
            j=modes.length;
            while(j){
                if(width>modes[--j][0].match(/^!?(.+)/)[1]){
                    break;
                }
            }
            // Negative mode
            if(modes[j][0].charAt(0)=='!'){
                // Hide image
                node.style.display='none';
            }
            // Normal mode
            else{
                // Show image
                if(node.style.display=='none'){
                    if(display=node.getAttribute('data-display')){
                        node.style.display=display;
                    }
                    else{
                        node.style.display='inline';
                    }
                }
                // Refresh src
                node.src=url.replace(/\{.+\}/g,modes[j][1]);
                // Call node listeners
                k=triggers.length;
                while(k){
                    if(triggers[--k]==node){
                        listeners[k].apply(node,[modes[j][1]]);
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
            triggers.push(node);
            listeners.push(callback);
        },

        /*
            Discover molt images
        */
        discover:function(){
            // Discover images
            var imgs=document.getElementsByTagName('img');
            for(var n = 0; n < imgs.length; n++){
                // Only accept images with data-url attribute set
                if(imgs[n][getAttribute]('data-url') && ! imgs[n][getAttribute]('data-molt')){
                    imgs[n].setAttribute('data-molt', 'discovered');
                    nodes.push(imgs[n]);
                }
            }
            // Update images
            refresh();
            // Catch events
            W(refresh);

            return nodes;
        }
    };

}()));
