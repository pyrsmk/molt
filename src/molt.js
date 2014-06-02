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
		Promises={
			promises: {
				early: [],
				each: [],
				eachonce: [],
				once: [],
				then: []
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
		loading=0,
		registered=false,
		getOnLoad=function(url,img,mode){
			return function(){
				// Load image to the DOM
				img.src=url;
				// Launch 'eachonce' callbacks
				if(Promises.promises.eachonce.length){
					Promises.run('eachonce',{mode:mode,img:img});
					Promises.promises.eachonce=[];
				}
				// Launch 'each' callbacks
				Promises.run('each',{mode:mode,img:img});
				// If all images have been loaded
				if(!--loading){
					// Launch 'once' callbacks
					if(Promises.promises.once.length){
						Promises.run('once',{mode:mode,imgs:images});
						Promises.promises.once=[];
					}
					// Launch 'then' callbacks
					Promises.run('then',{mode:mode,imgs:images});
				}
			};
		},
		getOnError=function(url){
			return function(){
				--loading;
				throw "An error has occured when loading '"+url+"'";
			};
		},
		// Core function
		refresh=function(){
			// Register W once
			if(!registered){
				W(refresh);
				registered=true;
			}
			// Prepare
			var width=W(),
				i,j,k,l,
				attributes,
				url,
				mode,
				modes,
				img,
				image,
				then=true;
			loading+=images.length;
			// Launch 'early' callbacks
			Promises.run('early',{
				mode : mode,
				imgs : images
			});
			// Browse images
			for(i=0,j=images.length;i<j;++i){
				// Prepare
				img=images[i];
				modes=[];
				url='';
				attributes=img.attributes;
				mode=0;
				// Discover modes
				if(attributes['data-src']){
					modes=attributes['data-src'].value.match(/\{(.+?)\}/)[1].split(/\s*,\s*/);
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
						if(attributes['data-src']){
							url=attributes['data-src'].value.replace(/\{.+?\}/,modes[k]);
						}
						else{
							url=attributes['data-'+modes[k]].value;
						}
					}
				}
				// Load image
				if(url){
					then=false;
					image=new Image();
					image.src=url;
					if(image.complete===true){
						img.src=url;
						getOnLoad(url,img,mode)();
					}
					else{
						image.onload=getOnLoad(url,img,mode);
						image.onerror=getOnError(url);
					}
					if(img.style.visibility!='visible'){
						img.style.visibility='visible';
						img.style.width='auto';
						img.style.height='auto';
					}
				}
				// Hide image
				else if(img.style.visibility!='hidden'){
					--loading;
					img.style.visibility='hidden';
					img.style.width=0;
					img.style.height=0;
				}
			}
			// Launch 'then' callbacks
			if(then){
				Promises.run('then',{mode:mode,imgs:images});
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
			early: function(func){
				Promises.add('early',func);
				return promises;
			},
			each: function(func){
				Promises.add('each',func);
				return promises;
			},
			eachOnce: function(func){
				Promises.add('eachonce',func);
				return promises;
			},
			once: function(func){
				Promises.add('once',func);
				return promises;
			},
			then: function(func){
				Promises.add('then',func);
				return promises;
			},
			start: function(){
				refresh();
			}
		};
		return promises;
	};

}));