/*
    molt, image updater for responsive designs

    Version     : 2.4.3
    Author      : Aurélien Delogu (dev@dreamysource.fr)
    Homepage    : https://github.com/pyrsmk/molt
    License     : MIT
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
        data='data-',
        triggers=[],
        listeners=[],
        nodes=[],
        i,

    /*
        Refresh image nodes
    */
    refresh=function(){
        var j,
            k,
            url,
            node,
            mode,
            modes,
            width=W();
        // Browse molt images
        i=-1;
        while(node=nodes[++i]){
            // Guess the current mode for that image
            modes=(url=node.getAttribute(data+'url')).match(/\{\s*(.*?)\s*\}/)[1].split(/\s*,\s*/);
            j=modes.length;
            while(j--){
                mode=modes[j].split(':');
                if(mode.length==1){
                    mode[1]=mode[0];
                }
                if(width>mode[0].match(/^!?(.+)/)[1]){
                    break;
                }
            }
            // Negative mode
            if(mode[0].charAt(0)=='!'){
                // Hide image
                node.style.display='none';
            }
            // Normal mode
            else{
                // Show image
                if(node.style.display=='none'){
                    if(k=node.getAttribute(data+'display')){
                        node.style.display=k;
                    }
                    else{
                        node.style.display='inline';
                    }
                }
                // Refresh src
                node.src=url.replace(/\{.+\}/g,mode[1]);
                // Call node listeners
                k=triggers.length;
                while(k--){
                    if(triggers[k]==node){
                        listeners[k].apply(node,[mode[1]]);
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
            Support for browsers with javascript disabled
            wrap any responsive images in a noscript tag
            and move the data-url attribute to the noscript tag

            <noscript data-url="http://cambelt.co/{320,480,768,1280}x400"><img src='http://cambelt.co/400x320'/></noscript>

        */
        noscript:function(){
          var noscriptTags = document.getElementsByTagName('noscript');
          i=-1;
          while(noscriptTag=noscriptTags[++i]){
            if(noscriptTag.getAttribute("data-url")){
              var image = document.createElement("img");
              image.setAttribute('data-url', noscriptTag.getAttribute('data-url'))
              noscriptTag.parentNode.insertBefore(image,noscriptTag);
            }
          }

          return this;
        },

        /*
            Discover molt images
        */
        discover:function(){
            // Discover images
            var img,
                imgs=document.getElementsByTagName('img'),
                discovered='discovered';
            i=-1;
            while(img=imgs[++i]){
                // Only accept images with data-url attribute set
                if(img[getAttribute](data+'url') && !img[getAttribute](data+discovered)){
                    img.setAttribute(data+discovered,discovered);
                    nodes.push(img);
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
