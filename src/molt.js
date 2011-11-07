/*
    molt, image updater for responsive designs

    Version:    1.0.2
    Author:     Aurélien Delogu (dev@dreamysource.fr)
    Homepage:   https://github.com/pyrsmk/molt
    License:    MIT
*/

(function(name,def){
    if(typeof module!='undefined'){
        module.exports=def;
    }
    else{
        this[name]=def;
    }
}('molt',function(){
    
    /*
        Create a molt image

        Parameters
            object node         : a DOM node
            object dimensions   : image resolutions corresponding to the specified mode
                                  (mode,[width,height]) pair list
            function onrefresh  : called when image has been refreshed

        Return
            molt
    */
    return function(node,dimensions,onrefresh){

        /*
            Guess the current mode
            
            Return
                integer
        */
        var a,guessCurrentMode=function(){
            var mode,
                width=W();
            for(mode in dimensions){
                if(!a){
                    a=mode;
                }
                if(width<mode){
                    break;
                }
                a=mode;
            }
            return a;
        },

        /*
            Refresh images for that new window size
        */
        refresh=function(){
            // Guess the current mode
            var mode=guessCurrentMode();
            // Update node
            if(dimensions[mode].length){
                node.width=dimensions[mode][0];
                node.height=dimensions[mode][1];
                // Get URL from ALL attribute
                if(a=node.getAttribute('all')){
                    node.src=a.replace(/\{mode\}/g,mode).
                               replace(/\{width\}/g,dimensions[mode][0]).
                               replace(/\{height\}/g,dimensions[mode][1]);
                }
                // Get URL from specific mode attribute
                else{
                    node.src=node.getAttribute(mode);
                }// User-side node refresh
                if(onrefresh){
                    onrefresh(node);
                }
            }
            // Hide node
            else{
                node.style.display='none';
            }
        };

        // Get out!
        if(typeof node!='object' || typeof dimensions!='object'){
            return;
        }
        // Init the node
        if(!node.alt){
            node.alt='';
        }
        // Update node
        refresh();
        // Catch resize event
        W(refresh);

    };

}()));