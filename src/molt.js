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
            Refresh images for that new window size
        */
        var refresh=function(){
            // Guess the current mode
            var innerWidth=this.innerWidth,
                width=W(),
                mode,
                a;
            for(mode in dimensions){
                if(width<mode){
                    mode=a;
                    break;
                }
                a=mode;
            }
            // Define node styles
            if(dimensions[mode].length){
                node.width=dimensions[mode][0];
                node.height=dimensions[mode][1];
                if(a=node.getAttribute('all')){
                    node.src=a.replace(/\{mode\}/g,mode).
                               replace(/\{width\}/g,dimensions[mode][0]).
                               replace(/\{height\}/g,dimensions[mode][1]);
                }
                else{
                    node.src=node.getAttribute(mode);
                }
            }
            // Hide node
            else{
                log('hide');
                node.style.display='none';
            }
            // Update node styles
            if(onrefresh){
                onrefresh(node);
            }
        },
        addEventListener=addEventListener;

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