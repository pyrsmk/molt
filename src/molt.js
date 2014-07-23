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
				eachonce: [],
				each: [],
				thenonce: [],
				then: []
			},
			add: function(type,func){
				if(typeof func=='function'){
					this.promises[type].push(func);
				}
			},
			run: function(type,args){
				for(var i=0,j=this.promises[type].length;i<j;++i){
					this.promises[type][i].apply(this,args);
				}
			}
		},
		loading=0,
		getOnLoad=function(src,node,mode){
			return function(){
				// Load image to the DOM
				node.src=src;
				// Launch 'eachonce' callbacks
				if(Promises.promises.eachonce.length){
					Promises.run('eachonce',[node,mode]);
					Promises.promises.eachonce=[];
				}
				// Launch 'each' callbacks
				Promises.run('each',[node,mode]);
				// If all images have been loaded
				if(!--loading){
					// Launch 'thenonce' callbacks
					if(Promises.promises.thenonce.length){
						Promises.run('thenonce',[images]);
						Promises.promises.thenonce=[];
					}
					// Launch 'then' callbacks
					Promises.run('then',[images]);
				}
			};
		},
		getOnError=function(src){
			return function(){
				--loading;
				throw "An error has occured when loading '"+src+"'";
			};
		},
		// Core function
		refresh=function(){
			// Prepare
			var a,b,c,i,j,k,l,
				viewportWidth=W.getViewportWidth(),
				viewportHeight=W.getViewportHeight(),
				src,
				node,
				mode,
				image,
				then=true;
			loading+=images.length;
			// Launch 'early' callbacks
			Promises.run('early',[images]);
			// Browse images
			for(i=0,j=images.length;i<j;++i){
				// Find which URL to load
				src='';
				for(k=0,l=images[i].modes.length;k<l;++k){
					a=images[i].modes[k].mode;
					b=parseInt(a.substring(0,a.length-1),10);
					c=a.substring(a.length-1);
					switch(c){
						case 'w':
							if(b<=viewportWidth){
								mode=a;
								src=images[i].modes[k].src;
							}
							break;
						case 'h':
							if(b<=viewportHeight){
								mode=a;
								src=images[i].modes[k].src;
							}
							break;
						default:
							throw "Invalid '"+a+"' mode encountered";
					}
				}
				// Load image
				node=images[i].node;
				if(src){
					then=false;
					image=new Image();
					image.src=src;
					if(image.complete===true){
						node.src=src;
						getOnLoad(src,node,mode)();
					}
					else{
						image.onload=getOnLoad(src,node,mode);
						image.onerror=getOnError(src);
					}
					if(node.style.visibility!='visible'){
						node.style.visibility='visible';
						node.style.width='auto';
						node.style.height='auto';
					}
				}
				// Hide image
				else if(node.style.visibility!='hidden'){
					--loading;
					node.style.visibility='hidden';
					node.style.width=0;
					node.style.height=0;
				}
			}
			// Launch 'then' callbacks
			if(then){
				Promises.run('then');
			}
		};

	// Add new nodes to the stack
	return function(nodes){
		// Prepare
		var a,b,i,j,k,l,
			image,
			attributes;
		// Format
		if(nodes.length===undefined){
			nodes=[nodes];
		}
		// Register W
		W.addListener(refresh);
		// Browse images
		for(i=0,j=nodes.length;i<j;++i){
			// Prepare
			attributes=nodes[i].attributes;
			image={node:nodes[i],modes:[]};
			// Discover modes : advanced syntax
			if(attributes['data-molt-src']){
				a=attributes['data-molt-src'].value.match(/\{(.+?)\}/)[1].split(/\s*,\s*/);
				for(k=0,l=a.length;k<l;++k){
					b=a[k].split(':');
					image.modes.push({
						mode: b[0],
						src: attributes['data-molt-src'].value.replace(/\{.+?\}/,b[1] || b[0])
					});
				}
			}
			// Discover modes : simple syntax
			else{
				for(k=0,l=attributes.length;k<l;++k){
					if(/^data-molt-\d+[wh]$/i.test(attributes[k].name)){
						image.modes.push({
							mode: attributes[k].name.substring(10),
							src: attributes[k].value
						});
					}
				}
			}
			// Sort modes
			image.modes.sort(function(a,b){
				return parseInt(a.mode.substring(0,a.mode.length-1),10)-parseInt(b.mode.substring(0,b.mode.length-1),10);
			});
			// Add image to the stack
			images.push(image);
		}
		// Return promises
		var promises={
			early: function(func){
				Promises.add('early',func);
				return promises;
			},
			eachOnce: function(func){
				Promises.add('eachonce',func);
				return promises;
			},
			each: function(func){
				Promises.add('each',func);
				return promises;
			},
			thenOnce: function(func){
				Promises.add('thenonce',func);
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