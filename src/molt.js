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
		getOnLoad=function(src,img){
			return function(){
				// Load image to the DOM
				img.src=src;
				// Launch 'eachonce' callbacks
				if(Promises.promises.eachonce.length){
					Promises.run('eachonce');
					Promises.promises.eachonce=[];
				}
				// Launch 'each' callbacks
				Promises.run('each',img);
				// If all images have been loaded
				if(!--loading){
					// Launch 'once' callbacks
					if(Promises.promises.once.length){
						Promises.run('once');
						Promises.promises.once=[];
					}
					// Launch 'then' callbacks
					Promises.run('then');
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
			var i,j,k,l,
				width=W(),
				src,
				node,
				image,
				then=true;
			loading+=images.length;
			// Launch 'early' callbacks
			Promises.run('early');
			// Browse images
			for(i=0,j=images.length;i<j;++i){
				// Find which URL to load
				src='';
				for(k=0,l=images[i].rules.length;k<l;++k){
					if(width>=images[i].rules[k].width){
						src=images[i].rules[k].src;
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
						getOnLoad(src,node)();
					}
					else{
						image.onload=getOnLoad(src,node);
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
		var i,j,k,l,
			widths,
			rules,
			rule,
			image,
			attributes;
		if(nodes.length===undefined){
			nodes=[nodes];
		}
		// Register W once
		if(!registered){
			W(refresh);
			registered=true;
		}
		// Browse images
		for(i=0,j=nodes.length;i<j;++i){
			// Prepare
			widths=[];
			rules=[];
			attributes=nodes[i].attributes;
			image={node:nodes[i],rules:[]};
			// Discover widths
			if(attributes['data-molt-src']){
				widths=attributes['data-molt-src'].value.match(/\{(.+?)\}/)[1].split(/\s*,\s*/);
			}
			else{
				for(k=0,l=attributes.length;k<l;++k){
					if(/^data-\d+$/i.test(attributes[k].name)){
						widths.push(parseInt(attributes[k].name.substring(5),10));
					}
				}
			}
			// Sort widths
			widths.sort(function(a,b){
				return a-b;
			});
			// Generate rules
			for(k=0,l=widths.length;k<l;++k){
				rule={width:widths[k]};
				if(attributes['data-molt-src']){
					rule.src=attributes['data-molt-src'].value.replace(/\{.+?\}/,widths[k]);
				}
				else{
					rule.src=attributes['data-molt-'+widths[k]].value;
				}
				image.rules.push(rule);
			}
			// Add a default rule
			if(attributes['data-molt-default']){ // bouger les options de start() dans la fonction primaire
				image.rules.unshift({
					width : 0,
					src : attributes['data-molt-default'].value
				});
			}
			images.push(image);
		}
		// Return promises
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