molt 3.0.0
==========

Molt is a tiny module that updates images according to the current viewport's width to have a better responsive design. It's built in front of [W](https://github.com/pyrsmk/W), it supports AMD/CommonJS and it's available on [bower](http://bower.io).

Updating from 2.5
-----------------

- syntax has changed from `data-url="myimg-{320,768}.jpg"` to `data-320="myimg-320.jpg" data-768="myimg-768.jpg"`
- the `listen()` method has been removed
- `negate` mode has been removed
- `ender` module has been removed
- the `data-display` attribute has been removed in favor of a better element hidding system

Syntax
------

A molt image is set as a regular `img` tag on your HTML body with some `mode` attributes and no `src` (which will be set by molt itself) :

```html
<img data-320="images/image320.jpg" data-728="images/image728.jpg" data-1600="images/image1600.jpg" alt="">
```

Each `mode` has a width set and an URL. The width actually works like the `min-width` media CSS property. So :
- if the current viewport's width is `1024px`, the loaded URL will be `images/image728.jpg`
- if it's `1920px`, the image will be `images/image1600.jpg`
- if the viewport's width is `240px` then the image will be hidden

After your tags are fine set, you just have to add images to molt's stack :

```javascript
molt($('#some-img'));
```

License
-------

Molt is released under the [MIT license](http://dreamysource.mit-license.org).
