/*
	molt, a responsive image updater

	Author
		Aurélien Delogu (dev@dreamysource.fr)
*/

(function(context,name,definition){
	if(typeof module!='undefined' && module.exports){
		module.exports=definition();
	}
	else if(typeof define=='function' && define.amd){
		define(definition);
	}
	else{
		context[name]=definition();
	}
}(this,'molt',function(){

	var images=[],

	// Core function
	refresh=function(){
		var width=W(),
			i,j,k,l,
			attributes,
			url,
			modes;
		// Browse images
		for(i=0,j=images.length;i<j;++i){
			// Prepare
			modes=[];
			url='';
			attributes=images[i].attributes;
			// Discover modes
			for(k=0,l=attributes.length;k<l;++k){
				if(/^data-\d+$/i.test(attributes[k].name)){
					modes.push(parseInt(attributes[k].name.substring(5),10));
				}
			}
			// Sort modes
			modes.sort(function(a,b){
				return a-b;
			});
			// Find which URL to load
			for(k=0,l=modes.length;k<l;++k){
				if(width>=modes[k]){
					url=attributes['data-'+modes[k]].value;
				}
			}
			// Load image
			if(url && url!=images[i].src){
				images[i].src=url;
				if(images[i].style.visibility!='visible'){
					images[i].style.visibility='visible';
					images[i].style.width='auto';
					images[i].style.height='auto';
				}
			}
			// Hide image
			else if(images[i].style.visibility!='hidden'){
				images[i].style.visibility='hidden';
				images[i].style.width=0;
				images[i].style.height=0;
			}
		}
	};

	// Refresh images when needed
	W(refresh);

	// Add new nodes to the stack
	return function(nodes){
		if(nodes.length===undefined){
			nodes=[nodes];
		}
		for(var i=0,j=nodes.length;i<j;++i){
			images.push(nodes[i]);
		}
		refresh();
	};

}));