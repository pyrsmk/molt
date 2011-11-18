/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://ender.no.de)
  * Build: ender build molt
  * =============================================================
  */

/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011 (@ded @fat)
  * http://ender.no.de
  * License MIT
  */
!function (context) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {}
    , old = context.$

  function require (identifier) {
    // modules can be required from ender's build system, or found on the window
    var module = modules[identifier] || window[identifier]
    if (!module) throw new Error("Requested module '" + identifier + "' has not been defined.")
    return module
  }

  function provide (name, what) {
    return (modules[name] = what)
  }

  context['provide'] = provide
  context['require'] = require

  function aug(o, o2) {
    for (var k in o2) k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k])
    return o
  }

  function boosh(s, r, els) {
    // string || node || nodelist || window
    if (typeof s == 'string' || s.nodeName || (s.length && 'item' in s) || s == window) {
      els = ender._select(s, r)
      els.selector = s
    } else els = isFinite(s.length) ? s : [s]
    return aug(els, boosh)
  }

  function ender(s, r) {
    return boosh(s, r)
  }

  aug(ender, {
      _VERSION: '0.3.6'
    , fn: boosh // for easy compat to jQuery plugins
    , ender: function (o, chain) {
        aug(chain ? boosh : ender, o)
      }
    , _select: function (s, r) {
        return (r || document).querySelectorAll(s)
      }
  })

  aug(boosh, {
    forEach: function (fn, scope, i) {
      // opt out of native forEach so we can intentionally call our own scope
      // defaulting to the current item and be able to return self
      for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(scope || this[i], this[i], i, this)
      // return self for chaining
      return this
    },
    $: ender // handy reference to self
  })

  ender.noConflict = function () {
    context.$ = old
    return this
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = ender
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = context['ender'] || ender

}(this);

!function () {

  var module = { exports: {} }, exports = module.exports;

  /*
      molt, image updater for responsive designs
  
      Version:    2.0.2
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
          listeners=[],
          nodes=[],
          i,
      
      /*
          Refresh image nodes
      */
      refresh=function(){
          var j,
              url,
              node,
              modes,
              width=W(),
              stack;
          // Browse molt images
          i=-1;
          while(node=nodes[++i]){
              // Guess the current mode for that image
              modes=(url=node.getAttribute('url')).match(/\{\s*(.*?)\s*\}/)[1].split(/\s*,\s*/);
              j=modes.length;
              while(j){
                  if(width>modes[--j].match(/^!?(.+)/)[1]){
                      break;
                  }
              }
              // Hide node
              if(modes[j].charAt(0)=='!'){
                  node.style.display='none';
              }
              // Refresh src
              else{
                  node.src=url.replace(/\{.+\}/g,modes[j]);
                  // Call node listeners
                  if(stack=listeners[url]){
                      j=stack.length;
                      while(j){
                          stack[--j](node);
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
              // Format
              node=node[getAttribute]('url');
              // Init node stack
              if(!listeners[node]){
                  listeners[node]=[];
              }
              // Add listener
              listeners[node].push(callback);
          },
          
          /*
              Discover molt images
          */
          discover:function(){
              // Discover images
              var imgs=document.getElementsByTagName('img'),
                  i=imgs.length;
              while(i){
                  // Only accept images with URL attribute set
                  if(imgs[--i][getAttribute]('url')){
                      nodes.push(imgs[i]);
                  }
              }
              // Update images
              refresh();
              // Catch events
              W(refresh);
          }
          
      };
  
  }()));

  provide("molt", module.exports);

  var molt=require('molt');
  
  $.ender({
      discover:molt.discover
  });
  
  $.ender({
      listen:function(callback){
          molt.listen(this,callback);
      }
  },true);

}();