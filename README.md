molt 4.2.0
==========

Molt is a tiny script that updates images according to the current viewport's width or height to have a better responsive design. It's built in top of [W](https://github.com/pyrsmk/W), supports AMD/CommonJS and is available on [bower](http://bower.io).

Molt aims to load your images in simple way, but if you want something more advanced to handle, per example, fluid images you can take a look at [picturefill](http://scottjehl.github.io/picturefill/) which follows the current W3C's `picture` proposal.

Install
-------

You can pick the minified library or install it with :

```
jam install pyrsmk-molt
bower install molt
npm install pyrsmk-molt --save-dev
```

What's new since 3.0
--------------------

- supports viewport's width and height
- two different syntaxes
- handle callbacks with promises to know when images are loaded
- the hability to hide an image is let to the user

Versions
--------

The library basic version you want to have is the minimized one with W inside, the so called `molt.W.min.js`. But if you have planned to use W standalone or from another library, you can pick the `molt.min.js` one.

Bases
-----

A molt image is set as a regular `img` tag on your HTML body with some attributes that tell when to load such or such image, but no `src` attribute which will be set by molt itself. Images are loaded by `modes` which are similar to media queries. They are interpreted like a media query's `min-width` or `min-height` condition. Per example, the `728w` mode will load the corresponding image when the viewport has a minimum width of `728px`. Likewise, a `480h` will load the image if the viewport's height is at least `480px`. So, let's see how we need to write our markup :

```html
<img data-molt-320w="images/image320w.jpg" data-molt-768w="images/image768w.jpg" data-molt-1600w="images/image1600w.jpg">
```

Pretty simple, isn't it? But that syntax could be really verbose on serveral circumstances. Here's an alternative that is doing the same by replacing the `{}` tag in the url by the current mode :

```html
<img data-molt-src="images/image{320w,768w,1600w}.jpg">
```

If, for any reason, you cannot rename you image files by including its corresponding mode, you can specify something more intelligible :

```html
<img data-molt-src="images/some_wonderful_picture-{320w:tiny,768w:medium,1600w:large}.jpg">
```

Then, if the current mode is `728w` the `images/some_wonderful_picture-medium.jpg` image will be loaded. Please note that if no mode is matched (when the user's viewport is less than the minimal mode your set) the image won't show up.

Now we have set our `img` tags, we can start the engine with the node list of the images you want molt to handle :

```javascript
molt($('img')).start();
```

Promises
--------

Molt is working by using something called `promises`. They are chainable methods that register callbacks. Those `promises` will let us handle image loadings and start all the engine when we're ready, and you can use any promise any times you want. But examples are better than words :

```javascript
molt($('img'))
    .early(function(images){
        // Called before downloading new images
    })
    .eachOnce(function(image,mode){
        // Called for each loaded image but once (useful for initializations)
    })
    .each(function(image,mode){
        // Called for each loaded image
    })
    .thenOnce(function(images){
        // Called when all images have been loaded but once (useful for initializations)
    })
    .then(function(images){
        // Called when all images have been loaded
    })
    .start();
```

Some parameters are passed to the callbacks the mode (could be `768w`, `800h` or anything else), and the image's node for `each()` or the node list for `then()`.

Caveats
-------

Currently, if you want to use several instances of molt, all your images will be returned into the promises of each instance.

License
-------

Molt is released under the [MIT license](http://dreamysource.mit-license.org).
