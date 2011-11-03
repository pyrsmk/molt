/*
    molt, image updater for responsiveness

    Version : 1.0.0
    Author  : Aurélien Delogu (dev@dreamysource.fr)
    URL     : https://github.com/pyrsmk/molt
    License : MIT
*/

!function(name,obj){
    if(typeof module!='undefined'){
        module.exports=obj;
    }
    else{
        this[name]=obj;
    }
}('molt',function(){
    
    /*
        Create a molt image

        Parameters
            object node         : a DOM node
            object dimensions   : image resolutions corresponding to the specified mode
                                  (mode,[width,height]) pair list
            function onrefresh  : called when image has been updated

        Return
            molt
    */
    return function(node,dimensions,onrefresh){

        /*
            Refresh images for that new window size
        */
        var refresh=function(){
            // Guess the current mode
            var width=typeof window.innerWidth=='number'?window.innerWidth:document.documentElement.clientWidth,
                mode,
                last,
                all;
            for(mode in dimensions){
                if(width<mode){
                    mode=last;
                    break;
                }
                last=mode;
            }
            // Define node styles
            if(dimensions[mode].length){
                node.width=dimensions[mode][0];
                node.height=dimensions[mode][1];
                if(all=node.getAttribute('all')){
                    node.src=all.replace(/\{mode\}/g,mode).
                                 replace(/\{width\}/g,dimensions[mode][0]).
                                 replace(/\{height\}/g,dimensions[mode][1]);
                }
                else{
                    node.src=node.getAttribute(mode);
                }
            }
            // Hide node
            else{
                node.style.display='none';
            }
            // Update node styles
            onrefresh(node);
        };

        // Prepare data
        if(typeof node!='object' || typeof dimensions!='object'){
            return;
        }
        if(typeof onrefresh!='function'){
            onrefresh=function(){};
        }
        // Init the node
        if(node.alt===undefined){
            node.alt='';
        }
        // Update node
        refresh();
        // Catch resize event
        if(window.addEventListener){
            window.addEventListener("resize",refresh,false);
        }
        else if(window.attachEvent){
            window.attachEvent("onresize",refresh);
        }

    };

}());