molt 2.0.2
==========

The idea to develop molt comes from a few observations:

- in responsive development we need to provide scaled scripts and images to not overload bandwidth and devices
- web developers often provide images for all medias with only on-the-fly resizing, that is not optimized at all
- apply a `display:none` property to an `img` is not sufficient, the browser still download the file

Then we need a library that automatically switch images according to the current window (or media device) resolution. This way, minimal bandwith is used and responsiveness is on our hands again ;)

W
-

Molt is [W](https://github.com/pyrsmk/W) dependent. So, if you've planned to use W in your website take the `molt-xxx.min.js` version, otherwise please take the `molt-W-xxx.min.js` one.

It should be a good idea to read the W README file to well understand how molt works.

Syntax
------

A molt image is set as a regular `img` tag on your HTML body (for dynamic generation purposes, on server side) with an `url` attribute:

    <img url="images/img{320,1024}.jpg" alt="">

Numbers in brackets are modes. The selected mode will replace brackets: if the selected mode is 320 then the URL will look like `images/img320.jpg`. A mode is chosen like this:

- if the current window/device width is, let's say, 240px then molt will choose the 320 mode
- for a 480px width, the 320 mode again
- but if a 1280px resolution is detected, the 1024 mode is chosen

Moreover, note that you can 'negate' a mode, like `!320`, to make your images hidden for that mode (please take a look at the listener example to know how deal with that special mode). Now, inside a script, molt must discover all your molt images:

    molt.discover();

To finish, you can apply several properties or launch some actions on a specific refreshed node (when a zoom event has been catched by molt, per example) by listening is refreshing state:

    // Get your image node
    var img=$('#foo img')[0];
    // Add a listener
    molt.listen(
        img,
        function(node){
            // Force image displaying at each refresh
            /*
                It's especially needed when you've set an empty mode:
                when the empty mode is reached, display:none is applied
                but since molt can't know what primary display property is set, the user must set it himself
            */
            node.style.display='block';
        }
    );

Of course, it's _really_ recommended to listen nodes before calling `molt.discover()`.

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
