molt 2.5.0
==========

The idea to develop molt comes from a few observations:

- in responsive development we need to provide scaled scripts and images to not overload bandwidth and devices
- web developers often provide images for all medias with only on-the-fly resizing, that is not optimized at all and not nice on all browsers
- apply a `display:none` property to an `img` is not sufficient, the browser still download the file
- [Responsive-Images](https://github.com/filamentgroup/Responsive-Images) and [responsive-images-alt](https://github.com/allmarkedup/responsive-images-alt) don't support several image dimensions and the first one is a bit intrusive
- [responsiveImages](https://github.com/jackfranklin/responsiveImages) is interesting but can't handle dynamic content generation on server side (with template engines)
- it also could happen that we don't need images at all for 320px devices (per example)

Molt try to solve all these problems.

Also, it's [W](https://github.com/pyrsmk/W) dependent and so can handle responsive events (it should be a good idea to read the W README file to well understand how it interacts with molt). So, if you've planned to use W in your website take the `molt-xxx.min.js` version, otherwise please take the `molt-W-xxx.min.js` one.

Syntax
------

A molt image is set as a regular `img` tag on your HTML body (for dynamic generation purposes on server side), but with an `url` attribute:

    <img data-url="images/img{320,1024}.jpg" data-display="block" alt="">

Numbers in brackets are modes. The selected mode will replace brackets: if the selected mode is 320 then the URL will look like `images/img320.jpg`. A mode is chosen like this:

- if the current window/device width is, let's say, 240px then molt will choose the 320 mode
- for a 480px width, the 320 mode again
- but if a 1280px resolution is detected, the 1024 mode is chosen

You can also map modes into different values, for example using `images/img-{320:small,1024:huge}.jpg` to load either `img-small.jpg` or `img-huge.jpg`.

Moreover, note that you can 'negate' a mode, like `!320`, to make your images hidden for that mode (please take a look at the listener example to know how deal with that special mode).

Finally, the `data-display` attribute is used when a previously hidden image (by a negative mode) shows up again. Currently, there's no way to distinguish which display CSS property is set on a node (really, no way at all, coming from a lack of specs). So, molt will reset that display property to the `display` attribute value, `inline` otherwise.

You can apply several properties or launch some actions on a specific refreshed node (when a zoom event has been catched, per example) by listening its refreshing state:

    // Get your image node
    var img=$('#foo img')[0];
    // Add a listener
    molt.listen(
        img,
        function(mode){
            if(mode==320){
                this.style.backgroundColor='red';
            }
            else{
                this.style.backgroundColor='green';
            }
        }
    );

Nodes are passed to the callback with the `this` keyword and current mode is directly accessible too. But, note that callbacks are only launched on non-negative modes.

To finish, molt must discover all your molt images to automatically manage them all:

    molt.discover();

Oh yeah... If you want to handle non-javascript users to make them displaying images even so: forget it. There's, currently, no clean solution for that.

Ender integration
-----------------

Some good news: molt is compatible with [ender](http://ender.no.de) :)

    var images=$('img');
    $(images[0]).listen(
        function(){
            // blah!
        }
    );
    $.discover();

License
-------

Molt is released under the MIT license.
