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
		loading,
		loaded,
		Promises={
			promises: {
				each: [],
				then: [],
				once: []
			},
			add: function(type,func){
				if(typeof func=='function'){
					this.promises[type].push(func);
				}
			},
			run: function(type,obj){
				for(var i=0,j=this.promises[type].length;i<j;++i){
					this.promises[type][i].apply(obj);
				}
			}
		},

	// Core function
	refresh=function(){
		// Prepare
		var width=W(),
			i,j,k,l,
			attributes,
			url,
			mode,
			modes,
			img;
		loading=0;
		loaded=0;
		// Browse images
		for(i=0,j=images.length;i<j;++i){
			// Prepare
			img=images[i];
			modes=[];
			url='';
			attributes=img.attributes;
			mode=0;
			// Discover modes
			if(attributes['data-modes']){
				modes=attributes['data-modes'].value.split(/\s*,\s*/);
			}
			else{
				for(k=0,l=attributes.length;k<l;++k){
					if(/^data-\d+$/i.test(attributes[k].name)){
						modes.push(parseInt(attributes[k].name.substring(5),10));
					}
				}
			}
			// Sort modes
			modes.sort(function(a,b){
				return a-b;
			});
			// Find which URL to load
			for(k=0,l=modes.length;k<l;++k){
				if(width>=modes[k]){
					mode=modes[k];
					if(attributes['data-modes']){
						url=attributes['data-src'].value.replace(/\*\*/,modes[k]);
					}
					else{
						url=attributes['data-'+modes[k]].value;
					}
				}
			}
			// Load image
			if(url && url!=img.src){
				++loading;
				img.src=img.src; // Prevents IE9 onload bug
				img.onload=function(mode,img){
					return function(e){
						++loaded;
						Promises.run('each',{
							mode : mode,
							image : img
						});
						if(loaded==loading){
							Promises.run('once',images);
							Promises.promises.once=[];
							Promises.run('then',images);
						}
					};
				}(mode,img);
				img.onerror=function(url){
					return function(){
						throw "An error occured when loading '"+url+"'";
					};
				}(url);
				img.src=url;
				if(img.style.visibility!='visible'){
					img.style.visibility='visible';
					img.style.width='auto';
					img.style.height='auto';
				}
			}
			// Hide image
			else if(img.style.visibility!='hidden'){
				img.style.visibility='hidden';
				img.style.width=0;
				img.style.height=0;
			}
		}
	};

	// Add new nodes to the stack
	return function(nodes){
		if(nodes.length===undefined){
			nodes=[nodes];
		}
		for(var i=0,j=nodes.length;i<j;++i){
			images.push(nodes[i]);
		}
		// Promises
		var promises={
			each: function(func){
				Promises.add('each',func);
				return promises;
			},
			then: function(func){
				Promises.add('then',func);
				return promises;
			},
			once: function(func){
				Promises.add('once',func);
				return promises;
			},
			start: function(){
				W(refresh);
				refresh();
			}
		};
		return promises;
	};

}));